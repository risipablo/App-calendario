import { useState } from "react";
import type { GoalFormProps } from "../../interfaces/type.goal";
import { Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export const GoalForm = ({
    onAdd,
    priority,
    setPriority,
    setStartDate,
    setTitle,
    start_date,
    title
}:GoalFormProps) => {

    const [addModal, setAddModal] = useState(false)

    return(
        <>
              <button className="btn-add-task" onClick={() => setAddModal(true)}>
                <Plus size={18} />
                <span>Nueva Meta</span>
            </button>

            <AnimatePresence>
                {addModal && (
                    <motion.div 
                        className="task-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setAddModal(false)}
                    >
                        <motion.div 
                            className="task-modal-content"
                            initial={{ scale: 0.7, opacity: 0, rotateX: 90 }}
                            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                            exit={{ scale: 0.7, opacity: 0, rotateX: 90 }}
                            transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="task-modal-header">
                                <h3>Nueva Tarea</h3>
                                <button 
                                    className="task-modal-close" 
                                    onClick={() => setAddModal(false)}
                                >
                                    <X size={22} />
                                </button>
                            </div>

                            <div className="task-modal-body">
                                <div className="task-form-group">
                                    <label>Fecha</label>
                                    <input 
                                        type="date" 
                                        className="task-input"
                                        value={start_date} 
                                        onChange={(e) => setStartDate(e.target.value)} 
                                    />
                                </div>

                                <div className="task-form-group">
                                    <label>Título</label>
                                    <input 
                                        type="text" 
                                        className="task-input"
                                        placeholder="Ingresa el título de la tarea"
                                        value={title} 
                                        onChange={(e) => setTitle(e.target.value)} 
                                    />
                                </div>

                                <div className="task-form-group">
                                    <label>Prioridad</label>
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
                                </div>

                                <div className="task-modal-actions">
                                    <button 
                                        className="task-btn task-btn-primary"
                                        onClick={() => {
                                            onAdd();
                                            setAddModal(false);
                                        }}
                                        disabled={!start_date || !title.trim() || !priority}
                                    >
                                        <Plus size={18} />
                                        Agregar
                                    </button>

                                    <button 
                                        className="task-btn task-btn-secondary"
                                        onClick={() => setAddModal(false)}
                                    >
                                        <X size={18} />
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </>
    )
}