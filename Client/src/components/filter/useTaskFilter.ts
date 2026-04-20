
import { useMemo, useCallback } from 'react';
import { useTasks } from '../../context/taskContex';
import type { ITodo, ISubtask, TaskStats } from '../../interfaces/type.task';

export type PeriodType = 'day' | 'week' | 'month' | 'all';


export const useTaskFilter = () => {
    const { task: allTasks } = useTasks();

    
    const filterTasksByDate = useCallback((tasks: ITodo[], period: PeriodType): ITodo[] => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        switch (period) {
            case 'day': {
                return tasks.filter(task => {
                    if (!task.date) return false;
                    const taskDate = new Date(task.date);
                    taskDate.setHours(0, 0, 0, 0);
                    return taskDate.getTime() === today.getTime();
                });
            }

            case 'week': {
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - today.getDay());

                const endOfWeek = new Date(today);
                endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

                return tasks.filter(task => {
                    if (!task.date) return false;
                    const taskDate = new Date(task.date);
                    return taskDate >= startOfWeek && taskDate <= endOfWeek;
                });
            }

            case 'month': {
                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

                return tasks.filter(task => {
                    if (!task.date) return false;
                    const taskDate = new Date(task.date);
                    return taskDate >= startOfMonth && taskDate <= endOfMonth;
                });
            }

            case 'all':
            default:
                return tasks;
        }
    }, []);

    // Extraer subtareas
    const extractSubtasks = useCallback((tasks: ITodo[]): Array<ISubtask & { parentTask: string; parentId?: string }> => {
        const subtasks: Array<ISubtask & { parentTask: string; parentId?: string }> = [];

        tasks.forEach(task => {
            if (task.subtaskTitles && task.subtaskTitles.length > 0) {
                for (let i = 0; i < task.subtaskTitles.length; i++) {
                    subtasks.push({
                        title: task.subtaskTitles[i],
                        date: new Date(task.date),
                        priority: task.subtaskPriorities?.[i] || 'media',
                        completed: task.subtaskCompleted?.[i] || false,
                        incompletedSubtask: task.incompletedSubtask?.[i],
                        parentTask: task.title,
                        parentId: task._id,
                        id: i,
                    });
                }
            }
        });

        return subtasks;
    }, []);

    // Filtro por mes específico
    const filterByMonth = useCallback((tasks: ITodo[], month: string, year?: string) => {
        
        if (!month || month === '') return tasks;
        
        const currentYear = year || new Date().getFullYear().toString();

        return tasks.filter(task => {
            if (!task.date) return false;
            
            const taskDate = task.date.split('T')[0];
            const parts = taskDate.split('-');
            
            if (parts.length < 2) return false;
            
            const [taskYear, taskMonth] = parts;
            return taskYear === currentYear && taskMonth === month;
        });
    }, []);

    // Principal que recibe los filtros
    const useFilteredData = (selectedMonth?: string, selectedYear?: string, period?: PeriodType) => {
        
        const filteredTasks = useMemo(() => {
            let result = [...allTasks];
            
            
            if (selectedMonth && selectedMonth !== '') {
                result = filterByMonth(result, selectedMonth, selectedYear);
            }
            
            else if (period && period !== 'all') {
                result = filterTasksByDate(result, period);
            }
            
            return result;
        }, [allTasks, selectedMonth, selectedYear, period, filterByMonth, filterTasksByDate]);

        // Extraer subtareas de las tareas filtradas
        const filteredSubtasks = useMemo(() => 
            extractSubtasks(filteredTasks),
            [filteredTasks, extractSubtasks]
        );

        // Calcular estadísticas
        const stats = useMemo((): TaskStats => {

            const completedTask = filteredTasks.filter(t => t.completed === true).length
            const completedSubTasks = filteredSubtasks.filter(t => t.completed === true).length

            // Tareas pendientes
            const pendingTask = filteredTasks.filter(t => t.completed === false).length
            const pendingSubTasks = filteredSubtasks.filter(t => t.completed === false && t.incompletedSubtask !== true).length
            

            // Tareas fallidas/no realizadas
            const failed = {
                tasks: 0,
                subtasks: filteredSubtasks.filter(s => s.incompletedSubtask).length,
                total: 0
            };
            failed.total = failed.tasks + failed.subtasks;

            const total = filteredTasks.length + filteredSubtasks.length
            const completedTotal = completedTask + completedSubTasks
            const pendingTotal = pendingTask + pendingSubTasks

            // Estadísticas por prioridad
            const byPriority = {
                alta: { completed: 0, pending: 0, failed: 0 },
                media: { completed: 0, pending: 0, failed: 0 },
                baja: { completed: 0, pending: 0, failed: 0 }
            };

            // Contar tareas principales por prioridad
            filteredTasks.forEach(task => {
                const priority = task.priority?.toLowerCase() as keyof typeof byPriority;
                if (priority in byPriority) {
                    if (task.completed) byPriority[priority].completed++;
                    else if (task.incompletedSubtask) byPriority[priority].failed++;
                    else byPriority[priority].pending++;
                }
            });

            // Contar subtareas por prioridad
            filteredSubtasks.forEach(sub => {
                const priority = sub.priority?.toLowerCase() as keyof typeof byPriority;
                if (priority in byPriority) {
                    if (sub.completed) byPriority[priority].completed++;
                    else if (sub.incompletedSubtask) byPriority[priority].failed++;
                    else byPriority[priority].pending++;
                }
            });

            return {
                total,
                completed:{tasks: completedTask, subtasks:completedSubTasks, total:completedTotal},
                pending:{tasks: pendingTask, subtasks: pendingSubTasks, total: pendingTotal },
                failed,
                byPriority
            };
        }, [filteredTasks, filteredSubtasks]);

        return {
            tasks: filteredTasks,
            subtasks: filteredSubtasks,
            stats,
            completedTasks: filteredTasks.filter(t => t.completed === true),
            completedSubtasks: filteredSubtasks.filter(s => s.completed === true),
            pendingTasks: filteredTasks.filter(t => t.completed === false), 
            pendingSubtasks: filteredSubtasks.filter(s => s.completed === false && s.incompletedSubtask !== true),
            failedTasks: [], 
            failedSubtasks: filteredSubtasks.filter(s => s.incompletedSubtask === true),
        };
    };

    return {
        
        filterTasksByDate,
        extractSubtasks,
        filterByMonth,
        useFilteredData,
        getAllTasks: () => allTasks
    };
};