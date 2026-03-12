import { useEffect, useState } from "react";
import type { ICalendar } from "../interfaces/type.calendar";
<<<<<<< HEAD
import axios from "axios";
import toast from "react-hot-toast";

const serverFront = config.Api

=======
import axiosInstance from "../utils/axiosIntance";

// const serverFront = config.Api

>>>>>>> feature/auth
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
<<<<<<< HEAD
            const response = await axios.post(`${serverFront}/api/calendar`,{
                title: title.trim(),
                priority: priority || 'media',
                category: category || 'personal',
                hour: hour,
                date: date || null
=======
            const response = await axiosInstance.post('/api/calendar',{
                title:title.trim(),
                priority:priority || 'media',
                category:category || 'personal',
                hour:hour,
                date:date || null
>>>>>>> feature/auth
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
<<<<<<< HEAD
        try {
            const response = await axios.get(`${serverFront}/api/calendar/today`,{
                params: { date: today }
            })
            return response.data
        } catch(err) {
            console.error(err)
            toast.error('Error al obtener los eventos de hoy', { position: 'top-center' })
        }
    }

    const deleteEvents = (id: string) => {
        try {
            axios.delete(`${serverFront}/api/calendar/${id}`)
            setNotes(prev => prev.filter(note => note._id !== id))
            toast.success('Evento eliminado', { position: 'top-center', duration: 1000 })
        } catch (err) {
            console.log(err)
            toast.error('Error al eliminar el evento', { position: 'top-center' })
        }
=======

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
>>>>>>> feature/auth
    }

    const deleteAllNotes = () => {
<<<<<<< HEAD
        const loadingToast = toast.loading('Eliminando todos los eventos...', { position: 'top-center' })
        axios.delete(`${serverFront}/api/calendar`)
=======
        axiosInstance.delete(`/api/calendar`)
>>>>>>> feature/auth
        .then(response => {
            setNotes([])
            console.debug(response)
            toast.success('Todos los eventos eliminados', { id: loadingToast, position: 'top-center', duration: 2000 })
        })
        .catch(err => {
            console.error(err)
            toast.error('Error al eliminar los eventos', { id: loadingToast, position: 'top-center' })
        })
    }

<<<<<<< HEAD
    const editEvents = (id: string, editData: { title: string, priority: string, category: string, date: string, hour: string }) => {
        const loadingToast = toast.loading('Guardando cambios...', { position: 'top-center' })
        axios.patch(`${serverFront}/api/calendar/${id}`, editData)
=======


    const editEvents = (id:string, editData:{title:string, priority:string, category:string,date:string, hour:string}) => {
        
        axiosInstance.patch(`/api/calendar/${id}`, editData)
>>>>>>> feature/auth
        .then(response => {
            const updateNotes = notes.map(note => note._id === id ? response.data : note)
            setNotes(updateNotes)
            toast.success('Evento actualizado correctamente', { id: loadingToast, position: 'top-center', duration: 2000 })
        })
        .catch(err => {
            console.log(err)
            toast.error('Error al actualizar el evento', { id: loadingToast, position: 'top-center' })
        })
    }

    return {
        notes, addNote, getTodayEvents, deleteEvents, editEvents, deleteAllNotes
    }
}