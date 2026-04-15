import { useState } from "react";
import type { NoteFormProps } from "../../interfaces/type.notes";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import "../../style/form.css"

export const NoteForm = ({
    onAdd,
    date,
    setDate,
    title,
    setTitle,
    category,
    setCategory
}:NoteFormProps) => {

    const [addModal, setAddModal] = useState(false)

    return(
        <>
            <button className="btn-add-task" onClick={() => setAddModal(true)}>
                <Plus size={18} />
                <span>Nueva Nota</span>
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
                                  value={date} 
                                  onChange={(e) => setDate(e.target.value)} 
                              />
                          </div>

                          <div className="task-form-group">
                              <label>Nota</label>
                              <input 
                                  type="text" 
                                  className="task-input"
                                  placeholder="Ingresa la nota"
                                  value={title} 
                                  onChange={(e) => setTitle(e.target.value)} 
                              />
                          </div>


                          <div className="task-form-group">
                              <label>Categoria</label>
                              <select 
                                  className="task-select"
                                  value={category} 
                                  onChange={(e) => setCategory(e.target.value)}
                              >
                                  <option value="">Selecciona una categoria</option>
                                  <option value="trabajo">Trabajo</option>
                                  <option value="personal">Personal</option>
                                  <option value="estudio">Estudio</option>
                                  <option value="deporte">Deporte</option>
                                  <option value="idea">Idea</option>
                                  <option value="salud">Salud</option>
                                  <option value="otro">Otro</option>
                              </select>
                          </div>

                          <div className="task-modal-actions">
                              <button 
                                  className="task-btn task-btn-primary"
                                  onClick={() => {
                                      onAdd();
                                      setAddModal(false);
                                  }}
                                  disabled={!date || !title}
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