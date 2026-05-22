// Note interface

export type NoteCategory = 'trabajo' | 'personal' | 'estudio' | 'deporte' | 'idea' | 'salud' | 'otro'

export interface INote{
    _id:string
    date:string
    title:string;
    category?: NoteCategory
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
    filteredNotes:INote[]
    setFilterNote: React.Dispatch<React.SetStateAction<INote[]>>;
    addNote:(date:Date, title:string,category:string) => void
    deleteNote:(id:string) => void
    allDeleteNote: () => void
    activeFilter?: string
    onDeleteFiltered?:() => void
    editNote:(id:string,editData: {date:Date, title:string,category:string})=> void
    toogleComplete: (id: string) => void;
    ondAddNote?: () => void   

}