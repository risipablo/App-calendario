import { useEffect, useState } from "react";
import { config } from "../config";
import type { ICalendar } from "../interfaces/type.calendar";
import axios from "axios";
import toast from "react-hot-toast";

const serverFront = config.Api

export const useCalendar = () => {

    const [notes, setNotes] = useState<ICalendar[]>([])

    useEffect(() =>{
        axios.get(`${serverFront}/api/calendar`)
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
            const response = await axios.post(`${serverFront}/api/calendar`,{
                title: title.trim(),
                priority: priority || 'media',
                category: category || 'personal',
                hour: hour,
                date: date || null
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
    }

    const deleteAllNotes = () => {
        const loadingToast = toast.loading('Eliminando todos los eventos...', { position: 'top-center' })
        axios.delete(`${serverFront}/api/calendar`)
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

    const editEvents = (id: string, editData: { title: string, priority: string, category: string, date: string, hour: string }) => {
        const loadingToast = toast.loading('Guardando cambios...', { position: 'top-center' })
        axios.patch(`${serverFront}/api/calendar/${id}`, editData)
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