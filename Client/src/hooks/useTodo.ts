import { useEffect, useState } from 'react';
import type { ITodo } from '../interfaces/type.task';
import toast from "react-hot-toast"
import axios from 'axios';
import { config } from '../config/index';
import axiosInstance from '../utils/axiosIntance';

const serverFront = config.Api

export const UseTask = () => {
    const [task,setTask] = useState<ITodo[]>([])
    const [loading,setLoading] = useState(true)
    
    useEffect(() => {
        const token = localStorage.getItem('token')
    
        if(!token){
            console.error('No token')
            setLoading(false) 
            return
        }
    
        axiosInstance.get(`/api/task`,{
        })
        .then(response =>{
            setTask(response.data)
            setLoading(false) 
        })
        .catch(err => {
            console.error(err)
            setLoading(false) 
        })
    },[])

    
    const addTask = (date: Date, title: string, priority: string) => {
        if (date && title.trim() && priority.trim() !== '') {
            
        
            const loadingToast = toast.loading('Subiendo tarea...', {
                position: 'top-center'
            });
            
            axiosInstance.post(`/api/task`, {
                date: date,
                title: title,
                priority: priority,
                completed: false
            })
            .then(response => {
                setTask(prev => [...prev, response.data]);
                
                toast.success('Tarea agregada exitosamente', {
                    id: loadingToast,  
                    position: 'top-center',
                    duration: 3000  
                });
            })
            .catch(err => {
                console.log(err);
                
                
                toast.error('Error al agregar la tarea', {
                    id: loadingToast,  
                    position: 'top-center',
                    duration: 4000
                });
            });
        }
    };

    // Add New tasks
    const addNewTask = (taskId: string, title:string, priority: string) => {
        const token = localStorage.getItem('token')

        axios.post(`${serverFront}/api/task/${taskId}/addtask`,{
            title, priority
        },{
            headers:{
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
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
    }

    // Delete principal task
    const deleteTask = (id:string) => {
        const token = localStorage.getItem('token')
        axios.delete(`${serverFront}/api/task/${id}`,{
            headers:{
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        })
        .then(() => {
            setTask(prev => prev.filter(tas => tas._id !== id))
            toast.success('Task deleted successfully.',{
                position:'top-center',
                duration:1000
            })
        })
        .catch(err => {
            console.log(err)
            toast.error('Error delete task',{
                position:'top-center',
                duration:1000
            }) 
        })
    }

    // Delete principal task
    const deletePrincipalTask = (taskId:string) => {
        const token = localStorage.getItem('token')

        axios.delete(`${serverFront}/api/task/${taskId}/principal`,{
            headers:{
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        })
        .then(response => {
            setTask(prev => prev.map(tas => 
                tas._id === taskId ? response.data.updatedTask : tas
            ));
            
            toast.success('All task has been deleted, successfully.',{
                position:'top-center',
                duration:1000
            })
        })
        .catch(err => console.error(err))
        toast.error("An error occurred while deleting all tasks.")
    }

    // Delete subtask
    const deleteSubTask = (taskId:string, subTaskIndex:number) => {
        const token = localStorage.getItem('token')

        axios.delete(`${serverFront}/api/task/${taskId}/subtask/${subTaskIndex}`,{
            headers:{
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        })
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
    }

    // Delete all
    const deleteAll = () => {
        const token = localStorage.getItem('token')

        axios.delete(`${serverFront}/api/task`,{
            headers:{
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        })
        .then(response => {
            setTask([])
            console.debug(response.data)
            toast.success('All task has been deleted, successfully.',{
                position:'top-center',
                duration:1000
            })
        })
        .catch(err => console.error(err))
        toast.error("An error occurred while deleting all tasks.")
    }

    // Edit & save principal task
    const saveTask = (id:string, editData:{date:Date, title:string, priority:string}) => {
        const token = localStorage.getItem('token')

        axios.patch(`${serverFront}/api/task/${id}`, editData,{
            headers:{
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        })
        .then(response => {
            setTask(prev => prev.map(tas => {
                if(tas._id === id){
                    return response.data
                }
                return tas
            }))
            toast.success("Task save succesfully.",{
                position:'top-center',
                duration:1000
            })
        })
        .catch(err => console.log(err)) 
        toast.error("Error meanwhile edited and saved task.",{
            position:"top-center"
        })
    }

    // Edit & save subtaska
    const editSubTask = (taskId: string, subTaskIndex: number, updatedSubTask:{title?:string, priority?:string}) => {
        const token = localStorage.getItem('token')

        axios.patch(`${serverFront}/api/task/${taskId}/subtask/${subTaskIndex}`, updatedSubTask,{
            headers:{
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        })
        .then(response => {
            setTask(prev => prev.map(tas => tas._id === taskId ? response.data : tas))
            toast.success("Task edited and saved correctly.",{
                position:'top-center',
                duration:1000
            })
        })
        .catch(err => {
            console.log(err)
            toast.error("Error meanwhile edited and saved task.",{
                position:"top-center"
            })
        })
    }

    // Check all task
    const toogleAllTask = (taskId:string) => {
        const token = localStorage.getItem('token')

        axios.patch(`${serverFront}/api/task/${taskId}/completeAllTask`, {}, {
            headers:{
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        })
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
    }

    // Check principal task
    const completedTask = (taskId: string) => {
        const token = localStorage.getItem('token')

        axios.patch(`${serverFront}/api/task/${taskId}/completedTask`,{
            headers:{
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        })
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
    }


    // Completed subtask
    const completedSubTasks = (taskId: string, subTaskIndex: number) => {
        const token = localStorage.getItem('token')

        axios.patch(`${serverFront}/api/task/${taskId}/subtask/${subTaskIndex}/toggle`,{
            headers:{
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        })
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
    }

    // Incompleted task
    const incompletedSubTask = (taskId: string, subTaskIndex:number) => {
        const token = localStorage.getItem('token')

        axios.patch(`${serverFront}/api/task/${taskId}/subtask/${subTaskIndex}/incomplete`,{
            headers:{
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        })
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
    }

    return {
        task, loading, addTask, addNewTask, deleteTask, deleteAll, deleteSubTask, saveTask, editSubTask,completedSubTasks, completedTask, toogleAllTask,deletePrincipalTask ,incompletedSubTask
    }
}