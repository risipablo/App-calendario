import type React from "react";
import type { ModalConfirmProps } from "../components/layout/modalConfirm";
import type { ReactNode } from "react";


export interface ISubtask {
    id: number;
    title?: string;
    priority: string;
    completed: boolean;
    incompletedSubtask?:boolean
}

export interface ITodo{
    _id:string;
    date:string;
    title: string 
    priority: string 
    completed?: boolean
    subtasks?:ISubtask[]
    subtaskTitles?: string[];
    subtaskPriorities?: string[];
    subtaskCompleted?: boolean[];
    incompletedSubtask?:boolean[]
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
    incompletedSubtask:(taskId: string, subTaskIndex: number) => void;
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
    incompletedSubtask:(taskId: string, subTaskIndex: number) => void;
    ModalConfirm?:React.ComponentType<ModalConfirmProps>
}

export interface TaskContextType{
    task: ITodo[],
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
    incompletedSubtask:(taskId: string, subTaskIndex: number) => void;
    getTaskDay: () => ITodo[]
    getAllSubtasksDay: () => Array<ISubtask & { parentTask: string }>;
    getPendigTask: () => ITodo[] 
    getPendingSubtasks: () => Array<ISubtask & { parentTask: string }>;
    getCompletedTask:() => ITodo[]
    getCompletedSubtasks:() => Array<ISubtask & { parentTask: string }>;
    getFailTask: () =>Array<ISubtask & { parentTask: string }>;
    getTotalTasksDay: () => number
    getTotalTaskCompleted: () => number
    getTotalTaskIncompleted:() => number
}

export interface TaskProviderProps{
    children: ReactNode
}
