import { useState } from "react"
import { useGoals } from "../../hooks/useGoal"

export const GoalContainer = () => {

    const {goal,addGoal} = useGoals()

    const [title,setTitle] = useState<string>("")
    const [priority,setPriority] = useState<string>("")
    const [startDate, setStartDate] = useState<string>()

    const handleAddGoal = () => {
        addGoal(title, priority, startDate)
        setTitle("")
        setPriority("")
        setStartDate("")
    }

    return(
        <>
        <h2> Objetivos </h2>
        <div className="inputs-container">
            <input type="text" placeholder="agregar titulo" value={title} onChange={(e) => setTitle(e.target.value)} />
            <select 
                className="task-select"
                value={priority} 
                onChange={(e) => setPriority(e.target.value)}
            >
                <option value="">Selecciona una prioridad</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
            </select>
            <input type="date" placeholder="agregar fecha de inico" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            

            <button onClick={handleAddGoal}> Agregar </button>
        </div>

        {goal.length === 0 ? (
            <> No hay metas establecidas </>
        ): (
            goal.map((met) => (
                <div key={met._id}>
                    Titulo: {met.title}
                    Prioridad: {met.priority}
                    fecha de creacion: {met.start_date}
                </div>
            ))
        )}
        </>
    )
       
}