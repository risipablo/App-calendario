import { useEffect, useState, useCallback } from "react";
import type { ICalendar } from "../interfaces/type.calendar";
import axiosInstance from "../utils/axiosIntance";
import { toast } from "react-hot-toast";

const TOAST_CONFIG = {
    position: 'top-center' as const,
    duration: 1500
}

export const useCalendar = () => {

    const [notes, setNotes] = useState<ICalendar[]>([])

    
    const loadNotes = useCallback(async () => {
        try {
            const response = await axiosInstance.get('/api/calendar')
            setNotes(response.data)
        } catch (error) {
            console.log(error)
            toast.error('Error al cargar los eventos', { position: 'top-center' })
        }
    }, [])

    
    const addNote = useCallback(async (title: string, date: string, category: string, priority: string, hour: string) => {
        try {
            const response = await axiosInstance.post('/api/calendar', {
                title: title.trim(),
                priority: priority || 'media',
                category: category || 'personal',
                hour: hour,
                date: date || null
            })
            
            setNotes(prev => [...prev, response.data])
            toast.success('Evento agregado exitosamente', TOAST_CONFIG)
            return response.data
        } catch(err) {
            console.error(err)
            toast.error('Error al agregar el evento', TOAST_CONFIG)
        }
    }, [])

    
    const getTodayEvents = useCallback(async () => {
        const today = new Date().toISOString().split('T')[0]

        try {
            const response = await axiosInstance.get('/api/calendar/today', {
                params: { date: today }
            })
            return response.data
        } catch(err) {
            console.error(err)
            toast.error('Error al obtener eventos de hoy', TOAST_CONFIG)
        }
    }, [])

    
    const deleteEvents = useCallback((id: string) => {
        axiosInstance.delete(`/api/calendar/${id}`)
            .then(() => {
                setNotes(prev => prev.filter((note) => note._id !== id))
                toast.success('Evento borrado exitosamente', TOAST_CONFIG)
            })
            .catch(err => {
                console.log(err)
                toast.error('Error al eliminar el evento', TOAST_CONFIG)
            })
    }, [])

    // ✅ deleteAllNotes con useCallback
    const deleteAllNotes = useCallback(() => {
        axiosInstance.delete(`/api/calendar`)
            .then(response => {
                setNotes([])
                console.debug(response)
                toast.success('Todos los eventos eliminados.', TOAST_CONFIG)
            })
            .catch(err => {
                console.error(err)
                toast.error('Error al eliminar los eventos.', TOAST_CONFIG)
            })
    }, [])

    // ✅ editEvents con useCallback
    const editEvents = useCallback((id: string, editData: {
        title: string, 
        priority: string, 
        category: string,
        date: string, 
        hour: string
    }) => {
        axiosInstance.patch(`/api/calendar/${id}`, editData)
            .then(response => {
                setNotes(prev => prev.map(note => 
                    note._id === id ? response.data : note
                ))
                toast.success('Evento actualizado correctamente.', TOAST_CONFIG)
            })
            .catch(err => {
                console.log(err)
                toast.error('Error al actualizar el evento.', TOAST_CONFIG)
            })
    }, [])

    
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadNotes()
    }, [loadNotes])  

    return {
        notes, 
        addNote, 
        getTodayEvents, 
        deleteEvents, 
        editEvents, 
        deleteAllNotes
    }
}