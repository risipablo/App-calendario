import { useEffect, useState } from "react";
import type { ICalendar } from "../interfaces/type.calendar";
import axiosInstance from "../utils/axiosIntance";
import { toast } from "react-hot-toast";

// const serverFront = config.Api

export const useCalendar = () => {

    const [notes, setNotes] = useState<ICalendar[]>([])

    useEffect(() =>{
        
        axiosInstance.get('/api/calendar')
        .then(response =>{
            setNotes(response.data)
        })
        .catch(error => {
            console.log(error)
            toast.error('Error al cargar los eventos', { position: 'top-center' })
        })
    },[])

    const addNote = async(title:string, date:string, category:string, priority:string, hour:string) => {
        const loadingToast = toast.loading('Agregando evento...', { position: 'top-center' })
        try{
            const response = await axiosInstance.post('/api/calendar',{
                title:title.trim(),
                priority:priority || 'media',
                category:category || 'personal',
                hour:hour,
                date:date || null
            })
            setNotes(prev => [...prev, response.data])
            toast.success('Evento agregado exitosamente', { id: loadingToast, position: 'top-center', duration: 3000 })
            return response.data
        } catch(err){
            console.error(err)
            toast.error('Error al agregar el evento', { id: loadingToast, position: 'top-center', duration: 4000 })
        }
    }

    const getTodayEvents = async() => {
        const today = new Date().toISOString().split('T')[0]

        const response = await axiosInstance.get('/api/calendar/today',{
            params:{date:today}
        })
        return response.data
    }


    const deleteEvents = (id:string) => {
        axiosInstance.delete(`/api/calendar/${id}`)
        .then(() => {
            const updateNotes = notes.filter((note) => note._id !== id)
            setNotes(updateNotes)
        })
        .catch(err => console.log(err))
    }

    const deleteAllNotes = () => {
        axiosInstance.delete(`/api/calendar`)
        .then(response => {
            setNotes([])
            console.debug(response)
            toast.success('Todos los eventos eliminados', { position: 'top-center', duration: 2000 })
        })
        .catch(err => {
            console.error(err)
            toast.error('Error al eliminar los eventos', { position: 'top-center' })
        })
    }



    const editEvents = (id:string, editData:{title:string, priority:string, category:string,date:string, hour:string}) => {
        
        axiosInstance.patch(`/api/calendar/${id}`, editData)
        .then(response => {
            const updateNotes = notes.map(note => note._id === id ? response.data : note)
            setNotes(updateNotes)
            toast.success('Evento actualizado correctamente', { position: 'top-center', duration: 2000 })
        })
        .catch(err => {
            console.log(err)
            toast.error('Error al actualizar el evento', { position: 'top-center' })
        })
    }

    return {
        notes, addNote, getTodayEvents, deleteEvents, editEvents, deleteAllNotes
    }
}