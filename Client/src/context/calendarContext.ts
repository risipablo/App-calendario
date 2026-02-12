import React, { createContext, useContext } from "react";
import type { CalendarContextType, CalendarProviderProps, ICalendar } from "../interfaces/type.calendar";
import { useCalendar } from "../hooks/useCalendar";


const CalendarContext = createContext<CalendarContextType | undefined>(undefined)

export const useCalendars = () => {
    const context = useContext(CalendarContext)
    if(!context){
        throw new Error("error")
    }
    return context
}


export const CalendarProvider:React.FC<CalendarProviderProps> = ({children}) => {
    const notesDate = useCalendar()

    const getNotesDay = ():ICalendar[] => {
        const todayDate = new Date().toISOString().split('T')[0];
        return notesDate.notes.filter((n: ICalendar) => {
            const noteDate = new Date(n.date).toISOString().split('T')[0];
            return noteDate === todayDate;
        });
    }

    const getNotesOfWeek = ():ICalendar[] => {
        const today = new Date()
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

        return notesDate.notes.filter(note => {
            const notesWeek = new Date(note.date)
            return notesWeek >= today && notesWeek <= nextWeek
        })
    }

    const getNotesOfMonth = ():ICalendar[] => {
        const today = new Date()

        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)

        return notesDate.notes.filter(note => {
            const noteDate = new Date(note.date)
            return noteDate >= firstDay && noteDate <= lastDay
        })
    }

    const getNotesImportant = ():ICalendar[] => {
        return getNotesOfMonth().filter(note => note.priority === 'alta')
    }


    

    const value: CalendarContextType = {
        notes: notesDate.notes,
        addNote: notesDate.addNote,
        deleteNote: notesDate.deleteEvents,
        getNotesDay,
        getNotesOfWeek,
        getNotesImportant,
        
        
   
    }

    return React.createElement(
        CalendarContext.Provider,
        {value},
        children
    )
}