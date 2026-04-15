// Note interface

export interface INote{
    _id:string
    date:string
    title:string;
    category?:'trabajo'|'personal'|'estudio'|'deporte'|'idea'|'salud'|'otro'
    completed?:boolean
}

export interface NoteFormProps{
    date:string
    title:string
    category?:string
    setDate:(date:string) => void
    setTitle:(title: string) => void
    setCategory:(category: string) => void
    onAdd:() => void
}

export interface NoteContainerProps{
    note:INote[]
    addNote:(date:Date, title:string,category:string) => void
    deleteNote:(id:string) => void
    allDeleteNote:(id:string) => void
    editNote:(id:string,editData: {date:Date, title:string,category:string})=> void
    toogleComplete: (id: string) => void;
    ondAddNote?: () => void   
}