import React, { createContext } from "react";
import type { CalendarContextType, CalendarProviderProps, ICalendar } from "../interfaces/type.calendar";
import { useCalendar } from "../hooks/useCalendar";

export const CalendarContext = createContext<CalendarContextType | undefined>(undefined)

export const CalendarProvider:React.FC<CalendarProviderProps> = ({children}) => {
    const notesDate = useCalendar()

    const getNotesDay = ():ICalendar[] => {
        const todayDate = new Date().toISOString().split('T')[0];
        return notesDate.notes.filter((n: ICalendar) => {
            const noteDate = new Date(n.date).toISOString().split('T')[0];
            return noteDate === todayDate;
        });
    }


    const value: CalendarContextType = {
        notes: notesDate.notes,
        addNote: notesDate.addNote,
        deleteNote: notesDate.deleteEvents,
        getNotesDay,
   
    }

    return React.createElement(
        CalendarContext.Provider,
        {value},
        children
    )
}