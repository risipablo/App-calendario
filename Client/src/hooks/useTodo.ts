import { useCallback, useEffect, useState } from 'react';
import type { ITodo } from '../interfaces/type.task';
import toast from "react-hot-toast"
import axios from 'axios';
import { config } from '../config/index';

const serverFront = config.Api

export const UseTask = () => {
    const [task,setTask] = useState<ITodo[]>([])
    const [filterTask,setFilterTask] = useState<ITodo[]>([])
    const [loading,setLoading] = useState(true)

    useEffect(() => {
        setLoading(false)
        axios.get(`${serverFront}/api/task`)
        .then(response =>{
            setTask(response.data)
            setFilterTask(response.data)
        })
        .catch(err => console.error(err))
    },[])

    // Add new task
    const addTask = useCallback((date: Date, title: string, priority: string) => {
        if (date && title.trim() && priority.trim() !== '') {
            
            const formatDate = date.toISOString()
            
            axios.post(`${serverFront}/api/task`, {
                date: formatDate,
                title: title,
                priority: priority,
                completed: false
            })
            .then(response => {
                setTask(prev => {
                    const next = [...prev,response.data]
                    setFilterTask(prevFilter => {
                        return[...prevFilter,response.data]
                    })
                    return next
                })
                
                toast.success('Tarea agregada exitosamente', {    
                    position: 'top-center',
                    duration: 1000  
                });
            })
            .catch(err => {
                console.log(err);
                toast.error('Error al agregar la tarea', {
                
                    position: 'top-center',
                    duration: 1000
                });
            });
        }
    },[setTask, setFilterTask]);

    // Add New tasks (subtaks)
    const addNewTask = useCallback((taskId: string, title:string, priority: string) => {
        axios.post(`${serverFront}/api/task/${taskId}/addtask`,{
            title, priority
        })
        .then(response => {
            setTask(prev => prev.map(tas => tas._id === taskId ? response.data : tas))
            toast.success('New task added successfully',{
                position:'top-right',
                duration:1000
            })
        })
        .catch(err => {
            console.error(err)
            toast.error('Error adding a task',{
                position:'top-left'
            })
        })
    },[setTask])

    // Delete principal task
    const deleteTask = useCallback((id:string) => {
        axios.delete(`${serverFront}/api/task/${id}`)
        .then(() => {

            setTask(prev => prev.filter(tas => tas._id !== id))
            setFilterTask(prev => prev.filter(tas => tas._id !== id))
            
            toast.success('Task deleted successfully.',{
                position:'top-center',
                duration:1000
            })
        
        })
        .catch(err => { 
            console.error(err)
            toast.error('Error delete task',{
                position:'top-center',
                duration:1000
            }) 
        })
    },[setTask,setFilterTask])

    // // Delete principal task
    // const deletePrincipalTask = (taskId:string) => {
    //     axios.delete(`${serverFront}/api/task/${taskId}/principal`)
    //     .then(response => {
    //         setTask(prev => prev.map(tas => 
    //             tas._id === taskId ? response.data.updatedTask : tas
    //         ));
            
    //         toast.success('All task has been deleted, successfully.',{
    //             position:'top-center',
    //             duration:1000
    //         })
    //     })
    //     .catch(err => console.error(err))
    //     toast.error("An error occurred while deleting all tasks.")
    // }

    // Delete subtask
    const deleteSubTask = useCallback((taskId:string, subTaskIndex:number) => {
        axios.delete(`${serverFront}/api/task/${taskId}/subtask/${subTaskIndex}`)
        .then(response => {
            setTask(prev => prev.map(tas => tas._id === taskId ? response.data:tas))
            toast.success("Task deleted succesfully.", {
                position:'top-center',
                duration:1000
            })  
        })
        .catch(err => {
            console.log(err);
            toast.error('Error deleting task');
        });
    },[setTask])

    // Delete all
    const deleteAll = useCallback(() => {
        axios.delete(`${serverFront}/api/task`)
        .then(response => {
            setTask([])
            setFilterTask([])

            console.debug(response.data)
            toast.success('All task has been deleted, successfully.',{
                position:'top-center',
                duration:1000
            })
        })
        .catch(err => console.error(err))
        toast.error("An error occurred while deleting all tasks.")
    },[setTask,setFilterTask])

    // Edit & save principal task
    const saveTask = useCallback((id:string, editData:{date:Date, title:string, priority:string}) => {
        axios.patch(`${serverFront}/api/task/${id}`, editData)
        .then(response => {
            setTask(prev => prev.map(tas => tas._id === id ? response.data : tas));
            setFilterTask(prev => prev.map(tas => tas._id === id ? response.data : tas));

            toast.success("Task save succesfully.",{
                position:'top-center',
                duration:3000
            })
        })
        .catch(err => console.log(err)) 
        
    },[setTask,setFilterTask])

    // Edit & save subtaska
    const editSubTask = useCallback((taskId: string, subTaskIndex: number, updatedSubTask:{title?:string, priority?:string}) => {
        axios.patch(`${serverFront}/api/task/${taskId}/subtask/${subTaskIndex}`, updatedSubTask)
        .then(response => {
            setTask(prev => prev.map(tas => tas._id === taskId ? response.data : tas))
            toast.success("Task edited and saved correctly.",{
                position:'top-center',
                duration:3000
            })
        })
        .catch(err => {
            console.log(err)
            toast.error("Error meanwhile edited and saved task.",{
                position:"top-center",
                duration:3000
            })
        })
    },[setTask])

    // Check all task
    const toogleAllTask = useCallback((taskId:string) => {
        axios.patch(`${serverFront}/api/task/${taskId}/completeAllTask`)
        .then(response => {
            setTask(prev => prev.map(tas => tas._id === taskId ? response.data : tas))

            const task = response.data
            const message = task.completed ? "All Task completed" : "All Task marked as pending"

            toast.success(message,{
                position:'top-center',
                duration:1000
            })
        })
        .catch(err => {
            console.error(err)
            toast.error("Error update the task")
        })
    },[setTask])

    // Check principal task
    const completedTask = useCallback((taskId: string) => {
        axios.patch(`${serverFront}/api/task/${taskId}/completedTask`)
        .then(response => {
            setTask(prev => prev.map(tas => tas._id === taskId ? response.data : tas))

            const task = response.data
            const message = task.completed ? "Principal Task Completed" 
            : "Principal task as pending"

            toast.success(message, {
                position: 'top-center',
                duration:1000
            })
        })
        .catch(err => {
            console.error(err)
            toast.error("Error actualizando tareas")
        })
    },[setTask])


    // Completed subtask
    const completedSubTasks = useCallback((taskId: string, subTaskIndex: number) => {
        axios.patch(`${serverFront}/api/task/${taskId}/subtask/${subTaskIndex}/toggle`)
        .then(response => {
            setTask(prev => prev.map(tas => tas._id === taskId ? response.data : tas))
            
            const task = response.data
            const subtask = task.subtasks?.[subTaskIndex]
            // const subtask = task.subtasks?.[subTaskIndex] || 
            // { completed: task.subtaskCompleted?.[subTaskIndex] }
            
            toast.success(
                subtask?.completed ? "Task completed" : "Task as pending",
                {
                    position: 'top-center',
                    duration:1000
                }
            )
        })
        .catch(err => {
            console.log(err.message)
            toast.error("Error actualizando subtarea")
        })
    },[setTask])

    // Incompleted task
    const incompletedSubTask = useCallback((taskId: string, subTaskIndex:number) => {
        axios.patch(`${serverFront}/api/task/${taskId}/subtask/${subTaskIndex}/incomplete`)
        .then(response => {
            setTask(prev => prev.map(tas => tas._id === taskId ? response.data : tas))
        
            const task = response.data
            const subtask = task.subtasks?.[subTaskIndex]

            toast.error(
                subtask?.completed ? "Task incomplete" : "Task as pending",
                {
                    position: 'top-center',
                    duration:1000
                }
            )
        })
        .catch(err => {
            console.log(err.message)
            toast.error("Error actualizando subtarea")
        })
    },[setTask])

    return {
        task, loading, addTask, addNewTask, deleteTask, deleteAll, deleteSubTask, saveTask, editSubTask,completedSubTasks, completedTask, toogleAllTask ,incompletedSubTask,
        filterTask,setFilterTask
    }
}