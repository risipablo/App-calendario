
import React, { createContext, useContext, } from "react";
import { UseTask } from "../hooks/useTodo";
import type { ISubtask, ITodo, TaskContextType, TaskProviderProps } from "../interfaces/type.task";

const TaskContext = createContext<TaskContextType | undefined>(undefined)


export const useTasks = () =>{
    const context = useContext(TaskContext)
    if(!context){
        throw new Error("error")
    }
    return context
}

export const TaskProvider:React.FC<TaskProviderProps> = ({children}) => {
    const taskData = UseTask()

    // useEffect(() => {
    //     console.log("Tareas: ", taskData.task)
    //     taskData.task.forEach(task => {
    //         console.log(`Task: ${task.title}`)
    //         console.log('Subtask: ' , task.subtasks)
    //     })
    // },[taskData.task])

    const getTaskDay = ():ITodo[] => {
        const today = new Date().toISOString().split('T')[0]
        return taskData.task.filter((t: ITodo) => {
            const taskDate = new Date(t.date).toISOString().split('T')[0]
            return taskDate === today
        })
    }

    // Obtener las subTask
    const getAllSubtasksDay = (): Array<ISubtask & { parentTask: string }> => {
        const todayTasks = getTaskDay()
        const allSubtasks: Array<ISubtask & { parentTask: string }> = []
        
        todayTasks.forEach(task => {
            
            if (task.subtaskTitles && task.subtaskTitles.length > 0) {
                for (let i = 0; i < task.subtaskTitles.length; i++) {
                    allSubtasks.push({
                        title: task.subtaskTitles[i],
                        priority: task.subtaskPriorities?.[i] || 'media',
                        completed: task.subtaskCompleted?.[i] || false,
                        incompletedSubtask:task.incompletedSubtask?.[i],
                        parentTask: task.title,
                        id: 0
                    })
                }
            }
        })
        
        return allSubtasks
    }

    // Tareas pendientes
    const getPendigTask = ():ITodo[] => {
        return getTaskDay().filter(t => !t.completed)
    }

    // Sub tareas pendientes 
    const getPendingSubtasks = (): Array<ISubtask & {parentTask:string}> => {
        return getAllSubtasksDay().filter(sub => !sub.completed)
    }

    // Tarea Principal
    const getCompletedTask = ():ITodo[] => {
        return getTaskDay().filter(t => t.completed)
    }


    // Subtareas completas
    const getCompletedSubtasks = (): Array<ISubtask & {parentTask:string}> => {
        return getAllSubtasksDay().filter(sub => sub.completed)
    }

    // Subtareas no realizas
    const getFailTask = ():Array<ISubtask & {parentTask:string}> => {
        return getAllSubtasksDay().filter(sub => sub.incompletedSubtask)
    }

    // Contador de tareas 
    const getTotalTasksDay = ():number => {
        const mainTask = getTaskDay().length
        const subtasks = getAllSubtasksDay().length
        return mainTask + subtasks
    }

    // Contador de tareas completas
    const getTotalTaskCompleted = ():number => {
        const mainTask = getCompletedTask().length
        const subtasks = getCompletedSubtasks().length
        return mainTask + subtasks
    }

    // Contador de tareas pendientes
    const getTotalTaskIncompleted = ():number => {
        const mainTask = getPendigTask().length
        const subtasks = getPendingSubtasks().length
        return mainTask + subtasks
    }


    

    

    const value: TaskContextType = {
        task: taskData.task,
        // loading: taskData.loading,
        addTask: taskData.addTask,
        addNewTask: taskData.addNewTask,
        deleteTask: taskData.deleteTask,
        // deleteAll: taskData.deleteAll,
        deleteSubTask: taskData.deleteSubTask,
        saveTask: taskData.saveTask,
        editSubTask: taskData.editSubTask,
        completedSubTasks: taskData.completedSubTasks,
        completedTask: taskData.completedTask,
        toogleAllTask: taskData.toogleAllTask,
        deletePrincipalTask: taskData.deletePrincipalTask,
        incompletedSubtask: taskData.incompletedSubTask,
        getTaskDay,
        getAllSubtasksDay,
        getCompletedSubtasks,
        getCompletedTask,
        getPendigTask,
        getPendingSubtasks,
        getTotalTaskCompleted,
        getTotalTaskIncompleted,
        getTotalTasksDay,
        getFailTask
        
    }

    return React.createElement(
        TaskContext.Provider,
        { value },
        children
    );

}