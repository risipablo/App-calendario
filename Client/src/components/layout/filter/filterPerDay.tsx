import type React from "react"
import type { ITodo } from "../../../interfaces/type.task"
import { useEffect, useState } from "react"
import { X } from "lucide-react"

type Props = {
    task: ITodo[]
    setFilterTask: React.Dispatch<React.SetStateAction<ITodo[]>>
}

export const FilterPerDay = ({
    task,
    setFilterTask
}:Props) => {

    const [dateFilter, setDateFilter] = useState<string>('')
    const [pendingDate,setPendingDate] = useState<string>('')
    const [addModal, setAddModal] = useState(false);


    useEffect(() => {
        if(!dateFilter){
            setFilterTask(task)
            return
        }

        const filtered = task.filter(t =>
            t.date.split('T')[0] === dateFilter
        ) 
        setFilterTask(filtered)
    },[dateFilter,task,pendingDate])

    const handleApply = () => {
        setDateFilter(pendingDate)
        setAddModal(false)
    }

    const resetDate = () => {
        setDateFilter('dd-mm-yy')
        setPendingDate("")
        setAddModal(false)
    }
  
    return (
        <>
              
                <button onClick={() => setAddModal(true)}  className="btn-toggle-view" >Filtrar por fecha</button>
                {
                    addModal &&(
                        <div className="task-modal-overlay" >
                            <div className="task-modal-content">
                                <div className="task-modal-header">
                                    <h3> Seleccion Fecha</h3>
                                    <button className="task-modal-close" 
                                        onClick={() => setAddModal(false)}>
                                        <X size={22} />
                                    </button>
                                    
                                </div>
                            
                            <div className="task-modal-body">
                                    <div className="task-form-group">
                                        <label> Fecha </label>
                                        <input
                                            type="date"
                                            className="task-input" 
                                            value={pendingDate}
                                            onChange={(e) => setPendingDate(e.target.value)}
                                        />
                                    </div>

                                    <div className="task-modal-actions">
                                        <button 
                                        className="task-btn task-btn-primary"
                                            onClick={handleApply}
                                            disabled={!pendingDate}
                                        >
                                            Aplicar
                                        </button>
                                        {dateFilter && (
                                            <button className="task-btn task-btn-secondary" onClick={resetDate}>Limpiar</button>
                                        )}
                                    </div>
                                    
                            </div>
                            </div>
                
                    </div>
                )}


        </>
  
  )
}
