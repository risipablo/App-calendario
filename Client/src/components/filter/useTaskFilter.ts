import type { TaskStats } from './../../interfaces/type.task';

import { useCallback, useMemo } from "react"
import { useTasks } from "../../context/taskContex"
import type { ISubtask, ITodo } from "../../interfaces/type.task"

export type PeriodType = 'day' | 'week' | 'month' | 'all'

export const useTaskFilter = () => {
    const {task:allTasks}= useTasks()
    
    const filterTasksByDate = useCallback((tasks: ITodo[], period:PeriodType):ITodo[] => {

        const today = new Date()
        today.setHours(0,0,0,0)

        switch(period){
            case'day':{
                return tasks.filter(task => {
                    const taskDate = new Date(task.date)
                    taskDate.setHours(0,0,0,0)
                    return taskDate.getTime() === taskDate.getTime()
                })
            }

            case 'week':{
                const startOfWeek = new Date(today)
                startOfWeek.setDate(today.getDate() - today.getDate())

                const endOfWeek = new Date(today)
                endOfWeek.setDate(today.getDate() + (6 - today.getDate()))

                return tasks.filter(task => {
                    const taskDate = new Date(task.date)
                    return taskDate >= startOfWeek && taskDate <= endOfWeek
                })
            }

            case 'month':{
                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
                const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

                return tasks.filter(task => {
                    const taskDate = new Date(task.date)
                    return taskDate >= startOfMonth && taskDate <= endOfMonth
                })
            }

            case 'all':
                    default:
                        return tasks
        }

    },[]) 


    // Subtasks
    // Tomar el array de las tareas para convertilas en objetos independientes
    const extractSubtasks = useCallback((tasks: ITodo[]): Array<ISubtask & { parentTask: string; parentId?: string }> => {
        const subtasks: Array<ISubtask & { parentTask: string; parentId?: string }> = [] // almacenar cada tarea con la referencia del padre

        tasks.forEach(task => {
            if(task.subtaskTitles && task.subtaskTitles.length > 0){
                for(let i = 0; i < task.subtaskTitles.length; i++){
                    subtasks.push({
                        title:task.subtaskTitles[i],
                        priority: task.subtaskPriorities?.[i] || 'media',
                        completed: task.subtaskCompleted?.[i] || false,
                        incompletedSubtask: task.incompletedSubtask?.[i],
                        parentTask: task.title, // a que tarea pertence
                        parentId: task._id, // ID de la tarea de padre
                        id: i // Indice de la subtarea
                    })
                }
            }
        })

        return subtasks
    }, []);

   
    const useFilteredData = (period: PeriodType) => {

        // Filtar por fecha
        const filteredTasks = useMemo(() => 
            filterTasksByDate(allTasks, period),
            [allTasks, period, filterTasksByDate]
        );

        // subtareas filtradas
        const filteredSubtasks = useMemo(() => 
            extractSubtasks(filteredTasks),
            [filteredTasks, extractSubtasks]
        );


        // Componente para calculcar estadisticas
        const stats = useMemo((): TaskStats => {

            // tareas completadas
            const completed = {
                tasks: filteredTasks.filter(t => t.completed).length,
                subtasks: filteredSubtasks.filter(s => s.completed).length,
                total: 0
            };
            completed.total = completed.tasks + completed.subtasks;

            // Tareas pedientes
            const pending = {
                tasks: filteredTasks.filter(t => !t.completed && !t.incompletedSubtask).length,
                subtasks: filteredSubtasks.filter(t => !t.completed && !t.incompletedSubtask).length,
                total:0
            }
            pending.total = pending.tasks + pending.subtasks;


            // Tareas incompletas
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


    return{
        filterTasksByDate,
        extractSubtasks,
        useFilteredData,
        getAllTasks: () => allTasks
    }
}