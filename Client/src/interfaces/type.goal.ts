export type GoalPriority = 'alta' | 'media' | 'baja' 

// Goal Interfece
export interface IGoal{
    _id:string
    title:string
    description:string
    priority:GoalPriority
    start_date: string 
    completed:boolean
    complete_note?: string | null
    userId?: string
}

// Goal Form
export interface GoalFormProps{
    title:string
    description?:string
    priority:string
    start_date:string
    setTitle:(title: string) => void
    setDescription:(title:string) => void
    setPriority:(priority: string) => void
    setStartDate:(start_date: string) => void
    onAdd: () => void
}


export interface GoalContainerProps{
    goal:IGoal[]
    filteredGoal: IGoal[]
    setFilteredGoal: React.Dispatch<React.SetStateAction<IGoal[]>>;
    activeFilter?:string
    addGoal?:(title:string, description:string,priority:string, startDate?:string) => void
    deleteGoal:(id:string) => void
    editGoal: (id: string, editData: {title: string, description:string,priority: string, start_date: string}) => void;
    toogleComplete: (id: string) => void;
    allDeleteGoal: () => void;
    onDeleteFiltered?:() => void
    onAddGoal?:() => void
}