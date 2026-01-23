
// Goal Interfece
export interface IGoal{
    _id:string
    title:string
    priority:'alta'|'media'|'baja'
    start_date: string 
    completed:boolean
    completed_at?: string | null
}

// Goal Form
export interface GoalFormProps{
    title:string
    priority:string
    start_date:string
    setTitle:(title: string) => void
    setPriority:(priority: string) => void
    setStartDate:(start_date: string) => void
    onAdd: () => void
}


export interface GoalContainerProps{
    goal:IGoal[]
    addGoal?:(title:string, priority:string, startDate?:string) => void
    deleteGoal:(id:string) => void
    editGoal: (id: string, editData: {title: string, priority: string, start_date: string}) => void;
    toogleComplete: (id: string) => void;
    allDeleteGoal: () => void;
    onAddGoal?:() => void
}