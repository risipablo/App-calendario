
import { useEffect, useState } from "react";
import { Save, X, Pencil, Trash2, Plus, ChevronUp, ChevronDown, Check, SquareDashed, ShieldX, MoreVertical} from 'lucide-react';
import { Accordion, AccordionDetails, AccordionSummary, Skeleton, Tooltip } from '@mui/material';
import type { TaskRowProps } from "../../interfaces/type.task";
import "../../style/task.css"
import { ModalConfirm } from "../layout/modalConfirm";
import { Toaster } from "react-hot-toast";



export const TaskRow = ({
    tas,
    deleteTask,
    deleteSubTask,
    editSubTask,
    toogleAllTask,
    completedTask,
    completedSubTasks,
    incompletedSubtask,
    addNewTask,
    saveTask
}: TaskRowProps) => {
    

    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(true);
    


    useEffect(() => {
        setIsAddingSubtask(false);
        setNewSubtask({ title: '', priority: 'media' });
        setEditingSubtaskIndex(null);
        setEditedSubtask({ title: '', priority: '' });
        setIsEditingDate(false);
        setEditedTaskData({
            date: tas.date,
            title: tas.title,
            priority: tas.priority
        });
        
        setIsLoadingSkeleton(true);
        
        const timer = setTimeout(() => {
            setIsLoadingSkeleton(false);

        }, 100);

        return () => clearTimeout(timer);
    }, [tas._id, tas.date, tas.title, tas.priority]);

    const formatDate = (dateString: string) => {
        // return dateString.split('T')[0]; 
        const [year, month, day] = dateString.split('T')[0].split('-');
        return `${day}/${month}/${year}`;
    };

    const [isAddingSubtask, setIsAddingSubtask] = useState(false);
    const [newSubtask, setNewSubtask] = useState({
        title: '',
        priority: 'media'
    });

    const handleAddSubtask = () => {
        if (newSubtask.title.trim() && newSubtask.priority.trim()) {
            addNewTask(tas._id, newSubtask.title, newSubtask.priority);
            setNewSubtask({ title: "", priority: "media" });
            setIsAddingSubtask(false);
        }
    };

    
    // Edit task
    const [isEditingDate, setIsEditingDate] = useState(false);
    const [editedTaskData, setEditedTaskData] = useState({
        date: tas.date,
        title: tas.title,
        priority: tas.priority
    });

    const handleSaveTask = () => {
        if(saveTask){
            saveTask(tas._id,{
                date: new Date(editedTaskData.date),
                title: editedTaskData.title,
                priority: editedTaskData.priority
            });
        }
        setIsEditingDate(false);
    };

    const [editingSubtaskIndex, setEditingSubtaskIndex] = useState<number | null>(null);
    const [editedSubtask, setEditedSubtask] = useState({
        title: '',
        priority: ''
    });
 
    const [hoveredSubtaskIndex, setHoveredSubtaskIndex] = useState<number | null>(null);
    const [mobileActionsIndex, setMobileActionsIndex] = useState<number | null>(null);


    const startEditSubtask = (index: number) => {
        if (tas.subtaskTitles && tas.subtaskTitles[index]) {
            setEditingSubtaskIndex(index);
            setEditedSubtask({
                title: tas.subtaskTitles[index],
                priority: tas.subtaskPriorities?.[index] || 'media'
            });
        }
    };

    const handleSaveSubtask = (index: number) => {
        if (editSubTask) 
            editSubTask(tas._id, index, editedSubtask);
        setEditingSubtaskIndex(null);
    };

    const [showModal, setShowModal] = useState(false);
    const [deleteAction, setDeleteAction] = useState<(() => void) | null>(null);
    const [modalConfig, setModalConfig] = useState({
        title:"",
        message:"",
        confirmText:""
    });

    const openDeleteModal = (
        action: () => void,
        title: string,
        message: string,
        confirmText: string
    ) => {
        setDeleteAction(() => action);
        setModalConfig({title,message, confirmText});
        setShowModal(true);
    };

    const confirmModal = () => {
        if(deleteAction){
            deleteAction();
            setShowModal(false);
            setDeleteAction(null);
        }
    };

    const calculateProgress = () => {
        let totalItems = 1
        let completedCount = tas.completed ? 1 : 0;

        if(tas.subtaskTitles?.length){
            tas.subtaskTitles.forEach((_,index) => {
                const isIncompleted = tas.incompletedSubtask?.[index]

                    totalItems++

                    if(tas.subtaskCompleted?.[index] && !isIncompleted){
                        completedCount ++
                    
                }
            })
        }

        if (completedCount === 0) return 0
        if(completedCount === totalItems) return 100
        return Math.round((completedCount/totalItems)*100)
    };

    const getProgressLabel = () => {
        let totalItems = 1
        let completedCount = tas.completed ? 1 : 0;

        if(tas.subtaskTitles?.length){
            tas.subtaskTitles.forEach((_,index) => {
                const isIncompleted = tas.incompletedSubtask?.[index]

                    totalItems++

                    if(tas.subtaskCompleted?.[index] && !isIncompleted){
                        completedCount ++
                    
                }
            })
        }
        
        return `${completedCount}/${totalItems} completados`;
    };

    // Loader
    if (isLoadingSkeleton) {
        return (
            <tr className="task-row">
                <td className="task-date">
                    <Skeleton variant="text" width={80} height={20} />
                </td>
                <td className="task-content">
                    <Skeleton variant="rectangular" width="100%" height={50} sx={{ borderRadius: '8px', marginBottom: '8px' }} />
                    <Skeleton variant="rectangular" width="100%" height={30} sx={{ borderRadius: '8px', marginBottom: '4px' }} />
                    <Skeleton variant="rectangular" width="100%" height={30} sx={{ borderRadius: '8px' }} />
                </td>
                <td className="task-progress">
                    <Skeleton variant="rectangular" width="100%" height={24} sx={{ borderRadius: '12px', marginBottom: '8px' }} />
                    <Skeleton variant="text" width={100} height={16} />
                </td>
                <td className="task-actions">
                    <Skeleton variant="circular" width={32} height={32} sx={{ marginBottom: '8px' }} />
                    <Skeleton variant="circular" width={32} height={32} />
                </td>
            </tr>
        );
    }



    // 
    return (
        <>
            <tr className={`task-row `}>
                
                <td className="task-date">
                    <div className="date-display">
                        {formatDate(tas.date)}
                        
                         {/* {tas.date} */}
                    </div>
                </td>
        
                <td className="task-content">
                    <Accordion 
                        expanded={isExpanded} 
                        onChange={() => setIsExpanded(!isExpanded)}
                        sx={{
                            boxShadow: 'none',
                            '&:before': { display: 'none' },
                            backgroundColor: 'transparent',
                            margin: '0 !important'
                        }}
                    >

                        {/* Buton Accordion */}
                        <AccordionSummary
                            sx={{
                                padding: 0,
                                minHeight: 'unset !important',
                                '& .MuiAccordionSummary-content': {
                                    margin: '0 !important',
                                    width: '100%',
                                    alignItems: 'center'
                                }
                            }}
                        >
                            <div className="main-task-row" style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                                {tas.subtaskTitles && tas.subtaskTitles.length > 0 && (
                                    <button 
                                        className="accordion-toggle-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsExpanded(!isExpanded);
                                        }}
                                    >
                                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                )}

                                <input 
                                    type="checkbox" 
                                    className="subtask-checkbox"
                                    checked={tas.completed || false} 
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        if (completedTask) {
                                            completedTask(tas._id);
                                        }
                                    }} 
                                    onClick={(e) => e.stopPropagation()}
                                />

                                <span className={`main-task-title ${tas.completed ? 'completed' : ''}`}>
                                    {tas.title}
                                </span>
                                
                                <span className={`priority-badge priority-${tas.priority}`}>
                                    {tas.priority}
                                </span>
                            </div>
                        </AccordionSummary>

                        <AccordionDetails sx={{ padding: 0, paddingTop: '8px' }} >
                            {tas.subtaskTitles && tas.subtaskTitles.length > 0 && (
                                <ul className="subtasks-list">
                                    {tas.subtaskTitles.map((subtaskTitle, index) => {
                                        const isCompleted = tas.subtaskCompleted?.[index] || false;
                                        const notCompleted = tas.incompletedSubtask?.[index] || false;
                                        const subtaskPriority = tas.subtaskPriorities?.[index] || 'media';
                                        
                                        return (
                                            <li
    key={`${tas._id}-subtask-${index}`}
    className={`subtask-item ${notCompleted ? 'incompleted-item' : ''}`}
    onMouseEnter={() => {
        // Solo activar hover en desktop
        if (window.innerWidth > 767) {
            setHoveredSubtaskIndex(index);
        }
    }}
    onMouseLeave={() => {
        // Solo desactivar hover en desktop
        if (window.innerWidth > 767) {
            setHoveredSubtaskIndex(null);
        }
    }}
>
    <div className="subtask-display">
        <input 
            type="checkbox" 
            className="subtask-checkbox"
            checked={isCompleted} 
            onChange={() => completedSubTasks?.(tas._id, index)} 
            disabled={notCompleted}
        />
        
        <span className={`subtask-text ${isCompleted ? 'completed' : ''} ${notCompleted ? 'not-completed' : ''}`}>
            {subtaskTitle}
        </span>
        
        <span className={`priority-badge priority-${subtaskPriority}`}>
            {subtaskPriority}
        </span>

        <div className="mobile-actions">
            <button
                className="action-btn-inline menu-btn"
                onClick={(e) => {
                    e.stopPropagation();
                    // Cerrar si ya está abierto, abrir si está cerrado
                    setMobileActionsIndex(mobileActionsIndex === index ? null : index);
                }}
            >
                {mobileActionsIndex === index ? <X size={16} /> : <MoreVertical size={16} />}
            </button>
        </div>
                                            
        {(hoveredSubtaskIndex === index || mobileActionsIndex === index) && (
            <div 
                className={`hover-actions ${mobileActionsIndex === index ? 'active' : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    className="mobile-close-btn"
                    onClick={() => setMobileActionsIndex(null)}
                >
                    <X size={16} />
                </button>
                <div className="inline-actions">
                    <Tooltip title="Editar" arrow>
                        <button 
                            className="action-btn-inline edit-btn" 
                            onClick={() => {
                                startEditSubtask(index);
                                setMobileActionsIndex(null);
                            }}
                        >
                            <Pencil size={14} />
                            <span className="mobile-label">Editar</span>
                        </button>
                    </Tooltip>
                    <Tooltip title="Eliminar" arrow>
                        <button 
                            className="action-btn-inline delete-btn" 
                            onClick={() => {
                                openDeleteModal(
                                    () => deleteSubTask?.(tas._id, index),
                                    "Confirmar borrado",
                                    "¿Estás seguro que deseas eliminar esta tarea?",
                                    "Eliminar"
                                );
                                setMobileActionsIndex(null);
                            }}
                        >
                            <Trash2 size={14} />
                            <span className="mobile-label">Eliminar</span>
                        </button>
                    </Tooltip>
                    <Tooltip title={notCompleted ? "Desmarcar como incompleto" : "Marcar como incompleto"} arrow>
                        <button
                            className={`action-btn-inline ${notCompleted ? 'incompleted-active' : 'incompleted-btn'}`}
                            type="button"
                            onClick={() => {
                                incompletedSubtask?.(tas._id, index);
                                setMobileActionsIndex(null);
                            }}
                        >
                            <ShieldX size={14} />
                            <span className="mobile-label">
                                {notCompleted ? "Desmarcar incompleto" : "Marcar incompleto"}
                            </span>
                        </button>
                    </Tooltip>
                </div>
            </div>
        )}
    </div>
</li>

                                        );
                                    })}
                                </ul>
                            )}

                            {/*Toogle completed all task*/}
                            {(tas.subtaskTitles && tas.subtaskTitles.length > 0) && (
                                <div className="complete-all-button-container" style={{ marginTop: '8px' }}>
                                    <Tooltip title="Completar todas las tareas de esta fila" arrow>
                                        <button 
                                            className="btn-complete-all"
                                            onClick={() => {
                                                if (toogleAllTask) {
                                                    toogleAllTask(tas._id);
                                                }
                                            }}
                                        >
                                            
                                            {calculateProgress() === 100 ?  <Check size={14}/> : <SquareDashed  size={14}/>  }
                                            
                                            <span>
                                                {calculateProgress() === 100 ? 'Todas las tareas completadas' : 'Completar todas las tareas'}
                                            </span>
                                        </button>
                                    </Tooltip>
                                </div>
                            )}
                        </AccordionDetails>
                    </Accordion>

                    {/* add Subtask */}
                    <div className="add-subtask-button-container" style={{ marginTop: '10px' }}>
                        <button 
                            className="btn-add-subtask"
                            onClick={() => setIsAddingSubtask(true)}
                        >
                            <Plus size={14} />
                            <span>Agregar subtarea</span>
                        </button>
                    </div>

                    

                </td>
        
                <td className="task-progress">
                    <div className="progress-container">
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{
                                    width: `${calculateProgress()}%`,
                                    backgroundColor: calculateProgress() === 100 ? '#34a853' : '#8e7cc3'
                                }}
                            >
                                <span className="progress-text">{calculateProgress()}%</span>
                            </div>
                        </div>
                        <div className="progress-label">
                            {getProgressLabel()}
                        </div>
                    </div>
                </td>
        
                <td className="task-actions">
                    <div className="actions-container">
                        <Tooltip title="Editar tarea principal" arrow>
                            <button 
                                className="action-btn edit-btn" 
                                onClick={() => {
                                    setEditedTaskData({
                                        title: tas.title,
                                        date: tas.date,
                                        priority: tas.priority
                                    });
                                    setIsEditingDate(true);
                                }}
                            >
                                <Pencil size={16} />
                            </button>
                        </Tooltip>

                        <Tooltip title="Eliminar tarea completa" arrow>
                            <button 
                                className="action-btn delete-btn" 
                                onClick={() => openDeleteModal(
                                    () => deleteTask?.(tas._id),
                                    "Confirmar borrado",
                                    "¿Estás seguro que deseas eliminar esta tarea?",
                                    "Eliminar"
                                )}
                            >
                                <Trash2 size={16} />
                            </button>
                        </Tooltip>
                    </div>
                </td>
            </tr>

            {/* Modals */}
            {isEditingDate && (
                <tr className="modal-row">
                    <td colSpan={4} className="modal-cell">
                        <div className="modal-overlay-inline" onClick={() => setIsEditingDate(false)}>
                            <div className="modal-content-inline" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header-inline">
                                    <h3>Editar Tarea Principal</h3>
                                    <button 
                                        className="modal-close-btn" 
                                        onClick={() => setIsEditingDate(false)}
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="modal-body-inline">
                                    <div className="form-group-inline">
                                        <label>Título</label>
                                        <input 
                                            type="text" 
                                            className="modal-input"
                                            placeholder="Título de la tarea" 
                                            value={editedTaskData.title}
                                            onChange={(e) => setEditedTaskData({
                                                ...editedTaskData, 
                                                title: e.target.value
                                            })}
                                            autoFocus
                                        />
                                    </div>
                                    <div className="form-group-inline">
                                        <label>Fecha</label>
                                        <input 
                                            type="date" 
                                            className="modal-input"
                                            value={editedTaskData.date.split('T')[0]}
                                            onChange={(e) => setEditedTaskData({
                                                ...editedTaskData, 
                                                date: e.target.value
                                            })}
                                        />
                                    </div>
                                    <div className="form-group-inline">
                                        <label>Prioridad</label>
                                        <select
                                            className="modal-select"
                                            value={editedTaskData.priority}
                                            onChange={(e) => setEditedTaskData({
                                                ...editedTaskData,
                                                priority: e.target.value
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
                                            onClick={handleSaveTask}
                                        >
                                            <Save size={16} />
                                            Guardar
                                        </button>
                                        <button 
                                            className="modal-btn modal-btn-secondary" 
                                            onClick={() => setIsEditingDate(false)}
                                        >
                                            <X size={16} />
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            )}

            {isAddingSubtask && (
                <tr className="modal-row">
                    <td colSpan={4} className="modal-cell">
                        <div className="modal-overlay-inline" onClick={() => setIsAddingSubtask(false)}>
                            <div className="modal-content-inline" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header-inline">
                                    <h3>Agregar Subtarea</h3>
                                    <button 
                                        className="modal-close-btn" 
                                        onClick={() => setIsAddingSubtask(false)}
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="modal-body-inline">
                                    <div className="form-group-inline">
                                        <label>Título</label>
                                        <input 
                                            type="text" 
                                            className="modal-input"
                                            placeholder="Título de la subtarea" 
                                            value={newSubtask.title}
                                            onChange={(e) => setNewSubtask({...newSubtask, title: e.target.value})}
                                            autoFocus
                                        />
                                    </div>
                                    <div className="form-group-inline">
                                        <label>Prioridad</label>
                                        <select
                                            className="modal-select"
                                            value={newSubtask.priority}
                                            onChange={(e) => setNewSubtask({ ...newSubtask, priority: e.target.value })}
                                        >
                                            <option value="alta">Alta</option>
                                            <option value="media">Media</option>
                                            <option value="baja">Baja</option>
                                        </select>
                                    </div>
                                    <div className="modal-actions-inline">
                                        <button 
                                            className="modal-btn modal-btn-primary" 
                                            onClick={handleAddSubtask}
                                        >
                                            <Save size={16} />
                                            Guardar
                                        </button>
                                        <button 
                                            className="modal-btn modal-btn-secondary" 
                                            onClick={() => setIsAddingSubtask(false)}
                                        >
                                            <X size={16} />
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            )}

            {editingSubtaskIndex !== null && (
                <tr className="modal-row">
                    <td colSpan={4} className="modal-cell">
                        <div className="modal-overlay-inline" onClick={() => setEditingSubtaskIndex(null)}>
                            <div className="modal-content-inline" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header-inline">
                                    <h3>Editar Subtarea</h3>
                                    <button 
                                        className="modal-close-btn" 
                                        onClick={() => setEditingSubtaskIndex(null)}
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="modal-body-inline">
                                    <div className="form-group-inline">
                                        <label>Título</label>
                                        <input 
                                            type="text"
                                            className="modal-input"
                                            placeholder="Título de la subtarea"
                                            value={editedSubtask.title} 
                                            onChange={(e) => setEditedSubtask({
                                                ...editedSubtask, 
                                                title: e.target.value
                                            })}
                                            autoFocus
                                        />
                                    </div>
                                    <div className="form-group-inline">
                                        <label>Prioridad</label>
                                        <select
                                            className="modal-select"
                                            value={editedSubtask.priority}
                                            onChange={(e) => setEditedSubtask({
                                                ...editedSubtask,
                                                priority: e.target.value
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
                                            onClick={() => handleSaveSubtask(editingSubtaskIndex)}
                                        >
                                            <Save size={16} />
                                            Guardar
                                        </button>
                                        <button 
                                            className="modal-btn modal-btn-secondary" 
                                            onClick={() => setEditingSubtaskIndex(null)}
                                        >
                                            <X size={16} />
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            )}

            {showModal && (
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

            <Toaster/>        
        </>
    );
};



