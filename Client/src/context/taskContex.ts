
import React, { createContext, useCallback, useContext, useMemo, } from "react";
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

    const getTaskDay = useCallback((): ITodo[] => {
        const todayStr = new Date().toLocaleDateString('en-CA'); 
        return taskData.task.filter((t: ITodo) => {
            
            const taskDateStr = t.date.split('T')[0];
            return taskDateStr === todayStr;
        });
    },[taskData.task])

    // Obtener las subTask
    const getAllSubtasksDay = useCallback((): Array<ISubtask & { parentTask: string }> => {
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
    },[getTaskDay])

    // Tareas pendientes
    const getPendigTask = useCallback(():ITodo[] => {
        return getTaskDay().filter(t => !t.completed)
    },[getTaskDay])

    // Sub tareas pendientes 
    const getPendingSubtasks = useCallback((): Array<ISubtask & {parentTask:string}> => {
        return getAllSubtasksDay().filter(sub => !sub.completed)
    },[getAllSubtasksDay])

    // Tarea Principal
    const getCompletedTask = useCallback(():ITodo[] => {
        return getTaskDay().filter(t => t.completed)
    },[getTaskDay])


    // Subtareas completas
    const getCompletedSubtasks = useCallback((): Array<ISubtask & {parentTask:string}> => {
        return getAllSubtasksDay().filter(sub => sub.completed)
    },[getAllSubtasksDay])

    // Subtareas no realizas
    const getFailTask = useCallback(():Array<ISubtask & {parentTask:string}> => {
        return getAllSubtasksDay().filter(sub => sub.incompletedSubtask)
    },[getAllSubtasksDay])

    // Contador de tareas 
    const getTotalTasksDay = useCallback(():number => {
        const mainTask = getTaskDay().length
        const subtasks = getAllSubtasksDay().length
        return mainTask + subtasks
    },[getAllSubtasksDay,getTaskDay])

    // Contador de tareas completas
    const getTotalTaskCompleted = useCallback(():number => {
        const mainTask = getCompletedTask().length
        const subtasks = getCompletedSubtasks().length
        return mainTask + subtasks
    },[getCompletedSubtasks,getCompletedTask])

    // Contador de tareas pendientes
    const getTotalTaskIncompleted = useCallback(():number => {
        const mainTask = getPendigTask().length
        const subtasks = getPendingSubtasks().length
        return mainTask + subtasks
    },[getPendigTask,getPendingSubtasks])


    const value: TaskContextType = useMemo(
        () =>(
            {
                task: taskData.task,
                filterTask:taskData.filterTask,
                setFilterTask: taskData.setFilterTask,
                addTask: taskData.addTask,
                addNewTask: taskData.addNewTask,
                deleteTask: taskData.deleteTask,
                deleteAll: taskData.deleteAll,
                deleteSubTask: taskData.deleteSubTask,
                saveTask: taskData.saveTask,
                editSubTask: taskData.editSubTask,
                completedSubTasks: taskData.completedSubTasks,
                completedTask: taskData.completedTask,
                toogleAllTask: taskData.toogleAllTask,
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
                getFailTask,
                
            }) ,
            [
                taskData.task,
                taskData.filterTask,
                taskData.setFilterTask,
                taskData.addTask,
                taskData.addNewTask,
                taskData.deleteTask,
                taskData.deleteAll,
                taskData.deleteSubTask,
                taskData.editSubTask,
                taskData.saveTask,
                taskData.toogleAllTask,
                taskData.completedTask,
                taskData.completedSubTasks,
                taskData.incompletedSubTask,
                getTaskDay,
                getAllSubtasksDay,
                getPendigTask,
                getPendingSubtasks,
                getCompletedTask,
                getCompletedSubtasks,
                getFailTask,
                getTotalTasksDay,
                getTotalTaskCompleted,
                getTotalTaskIncompleted,
            ]
        )
    
    return React.createElement(
        TaskContext.Provider,
        { value },
        children
    );

}

// const today = new Date().toISOString().split('T')[0]