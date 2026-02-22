import React, { createContext, useCallback, useContext, useMemo } from "react";
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

    const getNotesDay = useCallback(():ICalendar[] => {
        const todayDate = new Date().toISOString().split('T')[0];
        return notesDate.notes.filter((n: ICalendar) => {
            const noteDate = new Date(n.date).toISOString().split('T')[0];
            return noteDate === todayDate;
        });
    },[notesDate])

    const getNotesOfWeek = useCallback(():ICalendar[] => {
        const today = new Date()
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

        return notesDate.notes.filter(note => {
            const notesWeek = new Date(note.date)
            return notesWeek >= today && notesWeek <= nextWeek
        })
    },[notesDate])

    const getNotesOfMonth = useCallback(():ICalendar[] => {
        const today = new Date()

        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)

        return notesDate.notes.filter(note => {
            const noteDate = new Date(note.date)
            return noteDate >= firstDay && noteDate <= lastDay
        })
    },[notesDate])

    const getNotesImportant = useCallback(():ICalendar[] => {
        return getNotesOfMonth().filter(note => note.priority === 'alta')
    },[getNotesOfMonth])

    

    const value: CalendarContextType = useMemo(
        () => (
        {
        notes: notesDate.notes,
        addNote: notesDate.addNote,
        deleteNote: notesDate.deleteEvents,
        editNote:notesDate.editEvents,
        allDeleteNote:notesDate.deleteAllNotes,
        onAddNote:notesDate.addNote,
        getNotesDay,
        getNotesImportant,
        getNotesOfWeek
        
        }),
        [
            notesDate.notes,
            notesDate.addNote,
            notesDate.deleteEvents,
            notesDate.editEvents,
            notesDate.deleteAllNotes,
            getNotesDay,
            getNotesImportant,
            getNotesOfWeek
        
        ]

    )

    return React.createElement(
        CalendarContext.Provider,
        {value},
        children
    )
}