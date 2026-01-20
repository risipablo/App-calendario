import { useEffect, useState } from 'react';
import type { ITodo } from './../types/interface';
import toast from "react-hot-toast"
import axios from 'axios';
import { config } from '../config/index';

const serverFront = config.Api

export const UseTask = () => {
    const [task,setTask] = useState<ITodo[]>([])
    const [loading,setLoading] = useState(true)

    useEffect(() => {
        setLoading(false)
        axios.get(`${serverFront}/api/task`)
        .then(response =>{
            setTask(response.data)
        })
        .catch(err => console.error(err))
    },[])

    

    const addTask = (date: Date, title: string, priority: string) => {
        if (date && title.trim() && priority.trim() !== '') {
            
            
            const loadingToast = toast.loading('Subiendo tarea...', {
                position: 'top-center'
            });
            
            axios.post(`${serverFront}/api/task`, {
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
        axios.post(`http://localhost:3001/api/task/${taskId}/addtask`,{
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
    }

    // Delete principal task
    const deleteTask = (id:string) => {
        axios.delete(`http://localhost:3001/api/task/${id}`)
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
        axios.delete(`http://localhost:3001/api/task/${taskId}/principal`)
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
        axios.delete(`http://localhost:3001/api/task/${taskId}/subtask/${subTaskIndex}`)
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
        axios.delete(`http://localhost:3001/api/task`)
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
        axios.patch(`http://localhost:3001/api/task/${id}`, editData)
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
        axios.patch(`http://localhost:3001/api/task/${taskId}/subtask/${subTaskIndex}`, updatedSubTask)
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
        axios.patch(`http://localhost:3001/api/task/${taskId}/completeAllTask`)
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
        axios.patch(`http://localhost:3001/api/task/${taskId}/completedTask`)
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
        axios.patch(`http://localhost:3001/api/task/${taskId}/subtask/${subTaskIndex}/toggle`)
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

    return {
        task, loading, addTask, addNewTask, deleteTask, deleteAll, deleteSubTask, saveTask, editSubTask,completedSubTasks, completedTask, toogleAllTask,deletePrincipalTask
    }
}