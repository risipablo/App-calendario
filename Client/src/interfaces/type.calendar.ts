

// Calendar Interface
export interface ICalendar{
    _id: string
    title: string
    hour:string
    date:string
    category: 'salud'|'deporte'|'trabajo'|'estudio'|'personal'|'ocio'|'finanzas'|'otros'
    priority:'alta'|'media'|'baja'
}


export interface CalendarFromProps{
    title:string
    priority:string
    category:string
    date:string
    hour:string
    setTitle:(title: string) => void
    setHour:(hour:string) => void
    setPriority:(priority: string) => void
    setCategory:(category: string) => void
    setDate:(date: string) => void
    onAdd: () => void
}


export interface CalendarContainerProps{
    notes:ICalendar[]
    addNote:(title:string, date:string, priority:string, category:string, hour:string) => void
    deleteNote:(id: string) => void
    editNote?:(id:string, editData: {title:string, date:string, priority:string, category:string, hour:string}) => void
    onAddNote:() => void
}