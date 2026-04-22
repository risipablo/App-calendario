import { useCallback, useEffect, useState } from "react"
import type { IGoal } from "../interfaces/type.goal"
import toast from "react-hot-toast"
import axiosInstance from "../utils/axiosIntance"

const TOAST_CONFIG = {
    position: 'top-center' as const,
    duration: 1500
}

export const useGoals = () => {

    const [goal, setGoal] = useState<IGoal[]>([])
    const [loading, setLoading] = useState(true)
    
    // ✅ loadGoals con useCallback
    const loadGoals = useCallback(async () => {
        const token = localStorage.getItem('token')
        
        if (!token) {
            console.error('No token')
            setLoading(false)
            return
        }

        try {
            const response = await axiosInstance.get('/api/goal')
            setGoal(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadGoals()
    }, [loadGoals])

    // ✅ addGoal con useCallback
    const addGoal = useCallback(async (title: string, description: string, priority: string, start_date?: string) => {
        if (!title.trim()) {
            toast.error('El título es obligatorio', TOAST_CONFIG)
            return
        }

        try {
            const response = await axiosInstance.post('/api/goal', {
                title: title.trim(),
                description: description.trim(),
                priority: priority || 'media',
                start_date: start_date || null,
            })

            setGoal(prev => [...prev, response.data])
            toast.success('Meta agregada exitosamente', TOAST_CONFIG)
            return response.data
        } catch (err) {
            toast.error('Error al agregar meta', TOAST_CONFIG)
            console.error(err)
        }
    }, [])

    // ✅ deleteGoal con useCallback
    const deleteGoal = useCallback((id: string) => {
        axiosInstance.delete(`/api/goal/${id}`)
            .then(() => {
                setGoal(prev => prev.filter(prod => prod._id !== id))
                toast.success('Meta eliminada', TOAST_CONFIG)
            })
            .catch(err => {
                console.log(err)
                toast.error('Error al eliminar meta', TOAST_CONFIG)
            })
    }, [])

    // ✅ allDeleteGoal con useCallback
    const allDeleteGoal = useCallback(() => {
        axiosInstance.delete('/api/goal')
            .then(response => {
                setGoal([])
                toast.success('Todas las metas eliminadas', TOAST_CONFIG)
                console.debug(response.data)
            })
            .catch(err => {
                console.error(err)
                toast.error('Error al eliminar metas', TOAST_CONFIG)
            })
    }, [])

    // ✅ editGoal (ya estaba bien, solo ajusto dependencia)
    const editGoal = useCallback((id: string, editData: { title: string, description: string, priority: string, start_date: string }) => {
        axiosInstance.patch(`/api/goal/${id}`, editData)
            .then(response => {
                setGoal(prev => prev.map(goa => goa._id === id ? response.data : goa))
                toast.success('Meta guardada', TOAST_CONFIG)
            })
            .catch(err => {
                console.error(err)
                toast.error('Error al guardar la meta', TOAST_CONFIG)
            })
    }, [])  // ← setGoal es estable, no necesita dependencias

    // ✅ toogleComplete con useCallback
    const toogleComplete = useCallback((id: string) => {
        axiosInstance.patch(`/api/goal/${id}/completedGoal`)
            .then(response => {
                setGoal(prev => prev.map(goa => goa._id === id ? response.data : goa))

                const goalData = response.data
                const message = goalData.completed ? 'Meta completada ✓' : 'Meta marcada como pendiente'
                
                toast.success(message, { position: 'top-center', duration: 1000 })
            })
            .catch(err => {
                console.error(err)
                toast.error('Error al actualizar meta', TOAST_CONFIG)
            })
    }, [])

    return { 
        goal, 
        loading, 
        addGoal, 
        deleteGoal, 
        editGoal, 
        toogleComplete, 
        allDeleteGoal 
    }
}