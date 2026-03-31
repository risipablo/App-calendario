import { useEffect, useState, useCallback } from 'react';
import type { ITodo } from '../interfaces/type.task';
import toast from "react-hot-toast"
import axios from 'axios';
import { config } from '../config/index';
import axiosInstance from '../utils/axiosIntance';

const serverFront = config.Api

const TOAST_CONFIG = {
    position: 'top-center' as const,
    duration: 1500
}

export const UseTask = () => {
    const [task, setTask] = useState<ITodo[]>([])
    const [filterTask, setFilterTask] = useState<ITodo[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')

        if (!token) {
            console.error('No token')
            setLoading(false)
            return
        }

        axiosInstance.get(`/api/task`)
            .then(response => {
                setTask(response.data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    const addTask = useCallback((date: Date, title: string, priority: string) => {
        if (date && title.trim() && priority.trim() !== '') {
            axiosInstance.post(`/api/task`, {
                date,
                title,
                priority,
                completed: false
            })
            .then(response => {
                setTask(prev => {
                    const next = [...prev, response.data]
                    setFilterTask(prevFilter => [...prevFilter, response.data])
                    return next
                })
                toast.success('Tarea agregada exitosamente', TOAST_CONFIG)
            })
            .catch(err => {
                console.log(err)
                toast.error('Error al agregar la tarea', TOAST_CONFIG)
            })
        }
    }, [setTask, setFilterTask])

    const addNewTask = useCallback((taskId: string, title: string, priority: string) => {
        const token = localStorage.getItem('token')

        axios.post(`${serverFront}/api/task/${taskId}/addtask`, { title, priority }, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        })
        .then(response => {
            setTask(prev => prev.map(tas => tas._id === taskId ? response.data : tas))
            toast.success('New task added successfully', TOAST_CONFIG)
        })
        .catch(err => {
            console.error(err)
            toast.error('Error adding a task', TOAST_CONFIG)
        })
    }, [setTask])

    const deleteTask = useCallback((id: string) => {
        const token = localStorage.getItem('token')

        axios.delete(`${serverFront}/api/task/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        })
        .then(() => {
            setTask(prev => prev.filter(tas => tas._id !== id))
            setFilterTask(prev => prev.filter(tas => tas._id !== id))
            toast.success('Task deleted successfully.', TOAST_CONFIG)
        })
        .catch(err => {
            console.error(err)
            toast.error('Error deleting task', TOAST_CONFIG)
        })
    }, [setTask, setFilterTask])

    const deleteSubTask = useCallback((taskId: string, subTaskIndex: number) => {
        const token = localStorage.getItem('token')

        axios.delete(`${serverFront}/api/task/${taskId}/subtask/${subTaskIndex}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        })
        .then(response => {
            setTask(prev => prev.map(tas => tas._id === taskId ? response.data : tas))
            toast.success('Task deleted successfully.', TOAST_CONFIG)
        })
        .catch(err => {
            console.log(err)
            toast.error('Error deleting task', TOAST_CONFIG)
        })
    }, [setTask])

    const deleteAll = useCallback(() => {
        const token = localStorage.getItem('token')

        axios.delete(`${serverFront}/api/task`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        })
        .then(() => {
            setTask([])
            setFilterTask([])
            toast.success('All tasks deleted successfully.', TOAST_CONFIG)
        })
        .catch(err => {
            console.error(err)
            toast.error('An error occurred while deleting all tasks.', TOAST_CONFIG)
        })
    }, [setTask, setFilterTask])

    const saveTask = useCallback((id: string, editData: { date: Date, title: string, priority: string }) => {
        const token = localStorage.getItem('token')

        axios.patch(`${serverFront}/api/task/${id}`, editData, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        })
        .then(response => {
            setTask(prev => prev.map(tas => tas._id === id ? response.data : tas))
            setFilterTask(prev => prev.map(tas => tas._id === id ? response.data : tas))
            toast.success('Task saved successfully.', TOAST_CONFIG)
        })
        .catch(err => console.log(err))
    }, [setTask, setFilterTask])

    const editSubTask = useCallback((taskId: string, subTaskIndex: number, updatedSubTask: { title?: string, priority?: string }) => {
        const token = localStorage.getItem('token')

        axios.patch(`${serverFront}/api/task/${taskId}/subtask/${subTaskIndex}`, updatedSubTask, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        })
        .then(response => {
            setTask(prev => prev.map(tas => tas._id === taskId ? response.data : tas))
            toast.success('Task edited and saved correctly.', TOAST_CONFIG)
        })
        .catch(err => {
            console.log(err)
            toast.error('Error while editing and saving task.', TOAST_CONFIG)
        })
    }, [setTask])

    const toogleAllTask = useCallback((taskId: string) => {
        const token = localStorage.getItem('token')

        axios.patch(`${serverFront}/api/task/${taskId}/completeAllTask`, {}, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        })
        .then(response => {
            setTask(prev => prev.map(tas => tas._id === taskId ? response.data : tas))
            const message = response.data.completed ? 'All tasks completed' : 'All tasks marked as pending'
            toast.success(message, TOAST_CONFIG)
        })
        .catch(err => {
            console.error(err)
            toast.error('Error updating the task', TOAST_CONFIG)
        })
    }, [setTask])

    const completedTask = useCallback((taskId: string) => {
        const token = localStorage.getItem('token')

        axios.patch(`${serverFront}/api/task/${taskId}/completedTask`, {}, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        })
        .then(response => {
            setTask(prev => prev.map(tas => tas._id === taskId ? response.data : tas))
            const message = response.data.completed ? 'Task completed' : 'Task marked as pending'
            toast.success(message, TOAST_CONFIG)
        })
        .catch(err => {
            console.error(err)
            toast.error('Error updating task', TOAST_CONFIG)
        })
    }, [setTask])

    const completedSubTasks = useCallback((taskId: string, subTaskIndex: number) => {
        const token = localStorage.getItem('token')

        axios.patch(`${serverFront}/api/task/${taskId}/subtask/${subTaskIndex}/toggle`, {}, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        })
        .then(response => {
            setTask(prev => prev.map(tas => tas._id === taskId ? response.data : tas))
            const subtask = response.data.subtasks?.[subTaskIndex]
            toast.success(subtask?.completed ? 'Task completed' : 'Task marked as pending', TOAST_CONFIG)
        })
        .catch(err => {
            console.log(err.message)
            toast.error('Error updating subtask', TOAST_CONFIG)
        })
    }, [setTask])

    const incompletedSubTask = useCallback((taskId: string, subTaskIndex: number) => {
        const token = localStorage.getItem('token')

        axios.patch(`${serverFront}/api/task/${taskId}/subtask/${subTaskIndex}/incomplete`, {}, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        })
        .then(response => {
            setTask(prev => prev.map(tas => tas._id === taskId ? response.data : tas))
            toast.success('Task marked as incomplete', TOAST_CONFIG)
        })
        .catch(err => {
            console.log(err.message)
            toast.error('Error updating subtask', TOAST_CONFIG)
        })
    }, [setTask])

    return {
        task, loading, addTask, addNewTask, deleteTask, deleteAll, deleteSubTask,
        saveTask, editSubTask, completedSubTasks, completedTask, toogleAllTask,
        incompletedSubTask, filterTask, setFilterTask
    }
}