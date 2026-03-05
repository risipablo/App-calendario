import { useEffect, useState } from "react";
import type { ICalendar } from "../interfaces/type.calendar";
import axiosInstance from "../utils/axiosIntance";

// const serverFront = config.Api

export const useCalendar = () => {

    const [notes, setNotes] = useState<ICalendar[]>([])

    useEffect(() =>{
        
        axiosInstance.get('/api/calendar')
        .then(response =>{
            setNotes(response.data)
        })
        .catch(error => console.log(error))
    },[])

    const addNote = async(title:string, date:string, category:string, priority:string,hour:string) => {

        
        try{
            const response = await axiosInstance.post('/api/calendar',{
                title:title.trim(),
                priority:priority || 'media',
                category:category || 'personal',
                hour:hour,
                date:date || null
            })
            setNotes(prev =>[...prev,response.data])
            return response.data
        } catch(err){
            console.error(err)
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
        })
        .catch(err => console.error(err))
    }



    const editEvents = (id:string, editData:{title:string, priority:string, category:string,date:string, hour:string}) => {
        
        axiosInstance.patch(`/api/calendar/${id}`, editData)
        .then(response => {
            const updateNotes = notes.map( note => {
                if(note._id === id)
                    return response.data
                return note
            })
            setNotes(updateNotes)
        })
        .catch(err => console.log(err))
        
    }
    

    return{
        notes, addNote, getTodayEvents, deleteEvents,editEvents, deleteAllNotes
    }
}
