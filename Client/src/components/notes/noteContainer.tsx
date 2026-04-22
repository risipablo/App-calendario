import { useEffect, useState } from "react";
import type { INote, NoteContainerProps } from "../../interfaces/type.notes";
import { Calendar, CheckCircle2, Pencil, PencilLine, Save, Trash2, X } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { Toaster } from "react-hot-toast";
import { PaginationComponent } from "../layout/pagination";
import { ModalConfirm } from "../layout/modalConfirm";
import { Tooltip } from "@mui/material";
import "../../style/task.css"
import "../../style/goal.css"
import { FilterNote } from "../layout/filter/filterNoteFast";
// import { FIlterNote } from "../layout/filter/filterNoteFast";

export const NoteContainer = ({
    note,
    deleteNote,
    editNote,
    toogleComplete,
    displayNote,
    setFilterNote
}:NoteContainerProps) => {

    const [goalIndex, setGoalIndex] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editData, setEditData] = useState({
        date: '',
        title:'',
        category: '',
    });

    const [showModal, setShowModal] = useState(false);
    const [deleteAction, setDeleteAction] = useState<(() => void) | null>(null);
    const [modalConfig, setModalConfig] = useState({
        title: "",
        message: "",
        confirmText: ""
    });

    const formateDate = (date:string) => {
        const cleanDate = date.split('T')[0]
        const [year,month,day] = cleanDate.split('-')
        return `${day}/${month}/${year}`
    }

    const openDeleteModal = (
        action: () => void,
        title: string,
        message: string,
        confirmText: string
    ) => {
        setDeleteAction(() => action);
        setModalConfig({ title, message, confirmText });
        setShowModal(true);
    };

    const confirmModal = () => {
        if (deleteAction) {
            deleteAction();
            setShowModal(false);
            setDeleteAction(null);
        }
    };

    const handleEditNote = (note: INote) => {
        setEditingId(note._id);
        setEditData({
            title: note.title,
            date: note.date,
            category: note.category ?? '',
        });
    };

    const handleSaveNote = (id: string) => {
        editNote(id, {
            date:new Date(editData.date) ,
            title: editData.title,
            category: editData.category,
        });
        setEditData({
            title: '',
            date:'',
            category: '',
        });
        setEditingId(null);
    };

    const handleCancelEdit = () => {
        setEditData({
            title: '',
            date:'',
            category: '',
        });
        setEditingId(null);
    };

    const [loading,setLoading] = useState(true)
    const [skeleton, setSkeleton] = useState(true)


    const itemsToDisplay = displayNote && displayNote.length >= 0 ? displayNote : note

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSkeleton(true)
        setLoading(true)
        const timer = setTimeout(() => {
            setLoading(false)
            setSkeleton(false)
        }, 1000)

        return () => clearTimeout(timer)
    }, [note.length])

    

    const [currentPage, setCurrentPage] = useState<number>(0)
    const itemsPerPage = 4

    const pageCount = Math.ceil(itemsToDisplay.length / itemsPerPage)
    const offSet = currentPage * itemsPerPage
    const currentItems = itemsToDisplay.slice(offSet, offSet + itemsPerPage)

    

    if (skeleton) {
        return (
            <div className="goal-skeleton-wrapper">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="goal-skeleton-card">
                        <div className="skeleton-line" style={{ width: '70%', height: '20px', marginBottom: '12px' }}></div>
                        <div className="skeleton-line" style={{ width: '40%', height: '16px', marginBottom: '8px' }}></div>
                        <div className="skeleton-line" style={{ width: '60%', height: '16px' }}></div>
                        <div className="skeleton-actions">
                            <div className="skeleton-btn" style={{ width: '80px' }}></div>
                            <div className="skeleton-btn" style={{ width: '80px' }}></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (loading) {
        return (
            <div className="loading-message">
                <ClipLoader color="#8e7cc3" size={50} />
                <p>Cargando notas rápidas...</p>
            </div>
        )
    } else if(!note.length){
        return (
            <div className="empty-state-goals">
                <PencilLine  size={64} />
                <h3>No hay notas rápidas escritas</h3>
                <p>Agrega tu primera nota rápida</p>
            </div>
        ) 
    }


    return (
        <div className={`task-row `}>

        <FilterNote note={note} setNoteFilter={setFilterNote}/>
        <div className="goals-list">
                {currentItems.map((met) => (
                    <div 
                        key={met._id} 
                        className={`goal-card-item ${met.completed ? 'completed-goal' : ''}`}
                        onMouseEnter={() => setGoalIndex(met._id)}
                        onMouseLeave={() => setGoalIndex(null)}
                    >
                        <div className="goal-card-content">
                            <div className="goal-main-row">
                                <input 
                                    type="checkbox" 
                                    className="goal-checkbox"
                                    checked={met.completed || false}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        if (toogleComplete) {
                                            toogleComplete(met._id);
                                        }
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                />

                            <div className="goal-info-section">

                                
                                <p className={`note-description ${met.completed ? 'completed' : ''}`}>
                                    {met.title}
                                </p>


                                {/* <h3 className={`goal-title-text ${met.completed ? 'completed' : ''}`}>
                                    {met.title}
                                </h3> */}
                                
                                <div className="priority-container">
                                    <span className="priority-label">Categoria:</span>
                                    <span className={`priority-badge priority-${met.category}`}>
                                        {met.category}
                                    </span>
                                </div>

                            </div>


                                {goalIndex === met._id && !met.completed && (
                                    <div className="inline-actions">
                                        <Tooltip title="Editar" arrow>
                                            <button 
                                                className="action-btn-inline edit-btn" 
                                                onClick={() => handleEditNote(met)}
                                            >
                                                <Pencil size={14} />
                                            </button>
                                        </Tooltip>
                                        <Tooltip title="Eliminar" arrow>
                                            <button 
                                                className="action-btn-inline delete-btn" 
                                                onClick={() => openDeleteModal(
                                                    () => deleteNote(met._id),
                                                    "Confirmar borrado",
                                                    "¿Estás seguro que deseas eliminar esta meta?",
                                                    "Eliminar"
                                                )}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </Tooltip>
                                    </div>
                                )}
                            </div>

                            <div className="goal-details-section">
                                <div className="goal-date-info">
                                    <Calendar size={14} />
                                    <span>Creada: {formateDate(met.date)}</span>
                                </div>
                    
                            </div>

                            {met.completed && (
                                <div className="completed-badge-goal">
                                    <CheckCircle2 size={16} />
                                    ¡Logrado!
                                </div>
                            )}
                        </div>
                    </div>
                ))}
        </div>
        

        {editingId !== null && (
            <div className="modal-overlay-inline" onClick={handleCancelEdit}>
                <div className="modal-content-inline" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header-inline">
                        <h3>Editar Nota Rapida</h3>
                        <button 
                            className="modal-close-btn" 
                            onClick={handleCancelEdit}
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="modal-body-inline">


                    <div className="form-group-inline">
                            <label>Descripción</label>
                            <input 
                                type="date"
                                className="modal-input"
                                placeholder="Descripción "
                                value={editData.date}
                                onChange={(e) => setEditData({
                                    ...editData,
                                    date: e.target.value
                                })}
                                autoFocus
                            />
                        </div>

                        <div className="form-group-inline">
                            <label>Título</label>
                            <input 
                                type="text"
                                className="modal-input"
                                placeholder="Título de la meta"
                                value={editData.title}
                                onChange={(e) => setEditData({
                                    ...editData,
                                    title: e.target.value
                                })}
                                autoFocus
                            />
                        </div>



                        <div className="form-group-inline">
                            <label>Categoria</label>
                            <select 
                                className="modal-select"
                                value={editData.category}
                                onChange={(e) => setEditData({
                                    ...editData,
                                    category: e.target.value
                                })}
                            >
                                <option value="alta">Alta</option>
                                <option value="media">Media</option>
                                <option value="baja">Baja</option>
                            </select>
                        </div>

   

                        <div className="modal-actions-inline">
                            <button 
                                className="modal-btn modal-btn-primary" 
                                onClick={() => handleSaveNote(editingId)}
                            >
                                <Save size={16} />
                                Guardar
                            </button>
                            <button 
                                className="modal-btn modal-btn-secondary" 
                                onClick={handleCancelEdit}
                            >
                                <X size={16} />
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {showModal && ModalConfirm && (
            <ModalConfirm
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={confirmModal}
                title={modalConfig.title}
                message={modalConfig.message}
                confirmText={modalConfig.confirmText}
                cancelText="Cancelar"
            />
        )}

        {
            pageCount > 1 && (
                <PaginationComponent
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalItems={note.length}
                    offset={offSet}
                    pageCount={pageCount} 
                    itemsPerPage={0} 
                    />
            )
        }

        <Toaster />
    </div>
    );
};