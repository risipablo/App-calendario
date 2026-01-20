import type React from "react";
import type { ModalConfirmProps } from "../components/layout/modalConfirm";


export interface ISubtask {
    title: string;
    priority: string;
    completed: boolean;
}

export interface ITodo{
    // slice(offset: number, arg1: number): unknown;
    // length: number;
    _id:string;
    date:string;
    title: string 
    priority: string 
    completed?: boolean
    subtasks?:ISubtask[]
    subtaskTitles?: string[];
    subtaskPriorities?: string[];
    subtaskCompleted?: boolean[];
}

// Form for add tasks
export interface TaskFormProps{
    date:string
    title:string
    priority:string
    setDate:(date:string) => void
    setPriority:(priority:string) => void
    setTitle:(title:string) => void
    onAdd:() => void
}

export interface TaskTableProps{
    task: ITodo[];
    addTask:(date:Date, title:string, priority:string) => void
    onDelete: (id: string) => void;
    onDeleteAll: () => void;
    deletePrincipalTask: (id:string) => void
    deleteSubTask: (taskId: string, subTaskIndex: number) => void;
    editSubTask: (taskId: string, subTaskIndex: number, updatedSubTask: { title?: string; priority?: string }) => void;
    toogleAllTask:(taskId:string) => void;
    completedTask:(taskId:string) => void;
    completedSubTasks: (taskId: string, subTaskIndex: number) => void;
    addNewTask: (taskId: string, title: string, priority: string) => void;
    saveTask: (id: string, editData: { date: Date, title:string, priority:string }) => void;
    ModalConfirm?:React.ComponentType<ModalConfirmProps>
}

export interface TaskRowProps{
    tas: ITodo,
    addTask:(date:Date, title:string, priority:string) => void
    addNewTask:(taskId:string, title:string, priority:string) => void
    deleteTask: (id: string) => void,
    deletePrincipalTask: (id:string) => void
    deleteSubTask: (taskId: string, subTaskIndex: number) => void,
    editSubTask?: (taskId: string, subTaskIndex: number, updatedSubTask: {title?:string, priority?:string}) => void,
    saveTask:(id:string, editData:{date:Date, title:string, priority:string}) => void
    toogleAllTask?:(taskId:string) => void;
    completedTask?:(taskId:string) => void;
    completedSubTasks?: (taskId: string, subTaskIndex: number) => void;
    ModalConfirm?:React.ComponentType<ModalConfirmProps>
}


// goal interfece
export interface IGoal{
    _id:string
    title:string
    priority:'alta'|'media'|'baja'
    start_date: string 
    completed:boolean
    completed_at?: string | null
}


// Paginate props
export interface PaginateProps{
    currentPage:number
    setCurrentPage: (page:number) => void
    totalItems: number;
    itemsPerPage: number;
    offset:number
    pageCount:number
}
