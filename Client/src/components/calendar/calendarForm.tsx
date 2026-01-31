import { useState } from "react";

import { Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { CalendarFromProps } from "../../interfaces/type.calendar";

export const CalendarForm = ({
    title,
    category,
    date,
    hour,
    onAdd,
    priority,
    setCategory,
    setDate,
    setPriority,
    setHour,
    setTitle
}:CalendarFromProps) => {

    const [addModal, setAddModal] = useState(false)

    return(
        <>
            <button className="btn-add-task" onClick={() => setAddModal(true)}>
                <Plus size={18} />
                <span>Nuevo evento</span>
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
    <label>Fecha y hora</label>

    <div className="task-date-time-row">
        <input 
            type="date"
            className="task-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
        />

        <input 
            type="time"
            className="task-input"
            value={hour}
            onChange={(e) => setHour(e.target.value)}
        />
    </div>
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

                                <div className="task-form-group">
                                    <label>Categoria</label>
                                    <select 
                                        className="task-select"
                                        value={category} 
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="">Selecciona una categoria</option>
                                        <option value="salud">Salud</option>
                                        <option value="finanzas">Finanzas</option>
                                        <option value="deporte">Deporte</option>
                                        <option value="trabajo">Trabajo</option>
                                        <option value="estudio">Estudio</option>
                                        <option value="personal">Personal</option>
                                        <option value="ocio">Ocio</option>
                                        <option value="familia">Familia</option>
                                        <option value="otros">Otros</option>
                                    </select>
                                </div>

                                <div className="task-modal-actions">
                                    <button 
                                        className="task-btn task-btn-primary"
                                        onClick={() => {
                                            onAdd();
                                            setAddModal(false);
                                        }}
                                        disabled={!date || !title.trim() || !priority ||!category}
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