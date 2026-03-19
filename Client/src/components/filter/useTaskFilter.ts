// hooks/useTaskFilters.ts
import { useMemo, useCallback } from 'react';
import { useTasks } from '../../context/taskContex';
import type { ITodo, ISubtask } from '../../interfaces/type.task';

export type PeriodType = 'day' | 'week' | 'month' | 'all';

interface TaskStats {
    total: number;
    completed: {
        tasks: number;
        subtasks: number;
        total: number;
    };
    pending: {
        tasks: number;
        subtasks: number;
        total: number;
    };
    failed: {
        tasks: number;
        subtasks: number;
        total: number;
    };
    byPriority: {
        alta: { completed: number; pending: number; failed: number };
        media: { completed: number; pending: number; failed: number };
        baja: { completed: number; pending: number; failed: number };
    };
}

export const useTaskFilters = () => {
    const { task: allTasks } = useTasks();

    
    const filterTasksByDate = useCallback((tasks: ITodo[], period: PeriodType): ITodo[] => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        switch (period) {
            case 'day': {
                return tasks.filter(task => {
                    const taskDate = new Date(task.date);
                    taskDate.setHours(0, 0, 0, 0);
                    return taskDate.getTime() === today.getTime();
                });
            }

            case 'week': {
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - today.getDay()); // Domingo
                const endOfWeek = new Date(today);
                endOfWeek.setDate(today.getDate() + (6 - today.getDay())); // Sábado

                return tasks.filter(task => {
                    const taskDate = new Date(task.date);
                    return taskDate >= startOfWeek && taskDate <= endOfWeek;
                });
            }

            case 'month': {
                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

                return tasks.filter(task => {
                    const taskDate = new Date(task.date);
                    return taskDate >= startOfMonth && taskDate <= endOfMonth;
                });
            }

            case 'all':
            default:
                return tasks;
        }
    }, []);

    const extractSubtasks = useCallback((tasks: ITodo[]): Array<ISubtask & { parentTask: string; parentId?: string }> => {
        const subtasks: Array<ISubtask & { parentTask: string; parentId?: string }> = [];
        
        tasks.forEach(task => {
            if (task.subtaskTitles && task.subtaskTitles.length > 0) {
                for (let i = 0; i < task.subtaskTitles.length; i++) {
                    subtasks.push({
                        title: task.subtaskTitles[i],
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

    
    const useFilteredData = (period: PeriodType) => {
        const filteredTasks = useMemo(() => 
            filterTasksByDate(allTasks, period),
            [allTasks, period, filterTasksByDate]
        );

        const filteredSubtasks = useMemo(() => 
            extractSubtasks(filteredTasks),
            [filteredTasks, extractSubtasks]
        );

        const stats = useMemo((): TaskStats => {
            const completed = {
                tasks: filteredTasks.filter(t => t.completed).length,
                subtasks: filteredSubtasks.filter(s => s.completed).length,
                total: 0
            };
            completed.total = completed.tasks + completed.subtasks;

            const pending = {
                tasks: filteredTasks.filter(t => !t.completed && !t.incompletedSubtask).length,
                subtasks: filteredSubtasks.filter(s => !s.completed && !s.incompletedSubtask).length,
                total: 0
            };
            pending.total = pending.tasks + pending.subtasks;

            const failed = {
                tasks: filteredTasks.filter(t => t.incompletedSubtask).length,
                subtasks: filteredSubtasks.filter(s => s.incompletedSubtask).length,
                total: 0
            };
            failed.total = failed.tasks + failed.subtasks;

            
            const byPriority = {
                alta: { completed: 0, pending: 0, failed: 0 },
                media: { completed: 0, pending: 0, failed: 0 },
                baja: { completed: 0, pending: 0, failed: 0 }
            };

            
            filteredTasks.forEach(task => {
                const priority = task.priority.toLowerCase() as keyof typeof byPriority;
                if (priority in byPriority) {
                    if (task.completed) byPriority[priority].completed++;
                    else if (task.incompletedSubtask) byPriority[priority].failed++;
                    else byPriority[priority].pending++;
                }
            });

            
            filteredSubtasks.forEach(sub => {
                const priority = sub.priority.toLowerCase() as keyof typeof byPriority;
                if (priority in byPriority) {
                    if (sub.completed) byPriority[priority].completed++;
                    else if (sub.incompletedSubtask) byPriority[priority].failed++;
                    else byPriority[priority].pending++;
                }
            });

            return {
                total: filteredTasks.length + filteredSubtasks.length,
                completed,
                pending,
                failed,
                byPriority
            };
        }, [filteredTasks, filteredSubtasks]);

        return {
            tasks: filteredTasks,
            subtasks: filteredSubtasks,
            stats,
            completedTasks: filteredTasks.filter(t => t.completed),
            completedSubtasks: filteredSubtasks.filter(s => s.completed),
            pendingTasks: filteredTasks.filter(t => !t.completed && !t.incompletedSubtask),
            pendingSubtasks: filteredSubtasks.filter(s => !s.completed && !s.incompletedSubtask),
            failedTasks: filteredTasks.filter(t => t.incompletedSubtask),
            failedSubtasks: filteredSubtasks.filter(s => s.incompletedSubtask),
        };
    };

    
    return {
        useFilteredData,
        filterTasksByDate,
        extractSubtasks,
        getAllTasks: () => allTasks,
    };
};