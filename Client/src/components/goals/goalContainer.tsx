import { useState } from "react"
import { useGoals } from "../../hooks/useGoal"
import type { IGoal } from "../../types/interface"

export const GoalContainer = () => {

    const {goal,addGoal,deleteGoal, editGoal, toogleComplete, allDeleteGoal} = useGoals()

    const [title,setTitle] = useState<string>("")
    const [priority,setPriority] = useState<string>("")
    const [startDate, setStartDate] = useState<string>()

    const formateDate = (date:string) => {
        const cleanDate = date.split('T')[0]
        const [year,month,day] = cleanDate.split('-')
        return `${day}/${month}/${year}`
    }

    const handleAddGoal = () => {
        addGoal(title, priority, startDate)
        setTitle("")
        setPriority("")
        setStartDate("")
    }

    const handleDeleteGoal = (id:string) => {
        deleteGoal(id)
    }


    // edit goals
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editData, setEditData] = useState({
        title:'',
        priority:'',
        startDate: ''
    })

    const handleEditProduct = (goal:IGoal) => {
        setEditingId(goal._id)
        setEditData({
            title:goal.title,
            priority:goal.priority,
            startDate:goal.start_date
        })
    }

    const handleSaveGoal = (id:string) => {
        editGoal(id,{
            title:editData.title,
            priority:editData.priority,
            start_date:editData.startDate
        })
        setEditData({
            title:'',
            priority:'media',
            startDate:''
        })
        setEditingId(null)
    }

    const handleCancelEdit = () => {
        setEditData({
            title:'',
            priority:'',
            startDate:''
        })
        setEditingId(null)
    }

    return (
        <div className="goal-container">
            <h2>🎯 Mis Objetivos</h2>
            
            
            <div className="goal-form">
                <input 
                    type="text" 
                    placeholder="Título de la meta" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                />
                
                <select 
                    value={priority} 
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option value="">Selecciona una prioridad</option>
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                </select>
                
                <div className="date-input">
                    <label>Fecha límite (opcional):</label>
                    <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                
                <button onClick={handleAddGoal} className="btn-add">
                    Agregar Meta
                </button>
            </div>

            <button onClick={()=> allDeleteGoal()}> Eliminar todas ({goal.length})</button>

            {/* Lista de metas */}
            <div className="goals-list">
                {goal.length === 0 ? (
                    <p className="empty-message">No hay metas establecidas</p>
                ) : (
                    goal.map((met) => (
                        <div key={met._id} className={`goal-card ${met.completed ? 'completed' : ''}`}>
                            {editingId === met._id ? (
                                /* Formulario de edición */
                                <div className="edit-form">
                                    <input 
                                        type="text"
                                        value={editData.title}
                                        onChange={(e) => setEditData({
                                            ...editData,
                                            title: e.target.value
                                        })}
                                        className="edit-input"
                                    />
                                    
                                    <select 
                                        value={editData.priority}
                                        onChange={(e) => setEditData({
                                            ...editData,
                                            priority: e.target.value as IGoal['priority']
                                        })}
                                        className="edit-select"
                                    >
                                        <option value="alta">Alta</option>
                                        <option value="media">Media</option>
                                        <option value="baja">Baja</option>
                                    </select>
                                    
                                    <div className="date-input">
                                        <label>Fecha límite:</label>
                                        <input 
                                            type="date"
                                            value={editData.startDate}
                                            onChange={(e) => setEditData({
                                                ...editData,
                                                startDate: e.target.value
                                            })}
                                        />
                                    </div>
                                    
                                    <div className="edit-actions">
                                        <button 
                                            onClick={() => handleSaveGoal(met._id)}
                                            className="btn-save"
                                        >
                                            Guardar
                                        </button>
                                        <button 
                                            onClick={handleCancelEdit}
                                            className="btn-cancel"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                
                                <>
                                    <div className="goal-header">
                                        <h3>{met.title}</h3>
                                        <span className={`priority-badge ${met.priority}`}>
                                            {met.priority}
                                        </span>
                                    </div>
                                    
                                    <div className="goal-details">
                                        <p>Fecha creada: {formateDate(met.start_date)}</p>
                                        {met.completed && met.completed_at && (
                                            <p className="completed-date">
                                                Fecha completada: {formateDate(met.completed_at)}
                                            </p>
                                        )}
                                    </div>

                                    <input 
                                    type="checkbox" 
                                    checked={met.completed || false}
                                    onChange={(e) => {
                                        e.stopPropagation()
                                        if(toogleComplete){
                                            toogleComplete(met._id)
                                        }
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    />
                                    
                                    <div className="goal-actions">
        
                                        <button 
                                            onClick={() => handleEditProduct(met)}
                                            className="btn-edit"
                                        >
                                            Editar
                                        </button>
                                        
                                        <button 
                                            onClick={() => handleDeleteGoal(met._id)}
                                            className="btn-delete"
                                        >
                                            Eliminar
                                        </button>
                                    </div>

                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}