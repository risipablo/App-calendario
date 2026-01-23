

import { useEffect, useState } from "react";
import { Save, X, Pencil, Trash2, Calendar, CheckCircle2, Target } from 'lucide-react';
import {Tooltip } from '@mui/material';
import type { GoalContainerProps, IGoal } from "../../interfaces/type.goal";
import { Toaster } from "react-hot-toast";
import { ModalConfirm } from "../layout/modalConfirm";
import "../../style/goal.css";
import { PaginationComponent } from "../layout/pagination";
import { ClipLoader } from "react-spinners";


export const GoalContainer = ({
    goal,
    deleteGoal,
    editGoal,
    toogleComplete,
    
}: GoalContainerProps) => {

    const [goalIndex, setGoalIndex] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editData, setEditData] = useState({
        title: '',
        priority: '',
        startDate: ''
    });

    const [showModal, setShowModal] = useState(false);
    const [deleteAction, setDeleteAction] = useState<(() => void) | null>(null);
    const [modalConfig, setModalConfig] = useState({
        title: "",
        message: "",
        confirmText: ""
    });

    const formateDate = (date: string) => {
        const cleanDate = date.split('T')[0];
        const [year, month, day] = cleanDate.split('-');
        return `${day}/${month}/${year}`;
    };

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

    const handleEditProduct = (goal: IGoal) => {
        setEditingId(goal._id);
        setEditData({
            title: goal.title,
            priority: goal.priority,
            startDate: goal.start_date
        });
    };

    const handleSaveGoal = (id: string) => {
        editGoal(id, {
            title: editData.title,
            priority: editData.priority,
            start_date: editData.startDate
        });
        setEditData({
            title: '',
            priority: '',
            startDate: ''
        });
        setEditingId(null);
    };

    const handleCancelEdit = () => {
        setEditData({
            title: '',
            priority: '',
            startDate: ''
        });
        setEditingId(null);
    };


    const [loading,setLoading] = useState(true)
    // Skeleton
    const [skeleton, setSkeleton] = useState(true)

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        setCurrentPage(0)

        setSkeleton(true)
        const timer = setTimeout(() => {
            setLoading(false)
            setSkeleton(false)
        }, 1000);

        return () => clearTimeout(timer)
    },[goal.length])


    // Paginate 
    const [currentPage, setCurrentPage] = useState<number>(0)
    const itemsPerPage = 3

    const pageCount = Math.ceil(goal.length / itemsPerPage)
    const offSet = currentPage * itemsPerPage
    const currentItems = goal.slice(offSet, offSet + itemsPerPage)



    
    // Skeleton
    if (skeleton) {
        return (
            <div className="goal-skeleton-wrapper">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="goal-skeleton-card">
                        {/* Línea del título */}
                        <div className="skeleton-line" style={{ width: '70%', height: '20px', marginBottom: '12px' }}></div>
                        
                        {/* Líneas de contenido */}
                        <div className="skeleton-line" style={{ width: '40%', height: '16px', marginBottom: '8px' }}></div>
                        <div className="skeleton-line" style={{ width: '60%', height: '16px' }}></div>
                        
                        {/* Botones */}
                        <div className="skeleton-actions">
                            <div className="skeleton-btn" style={{ width: '80px' }}></div>
                            <div className="skeleton-btn" style={{ width: '80px' }}></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Loading
    if (loading) {
        return (
            <div className="loading-message">
                <ClipLoader color="#8e7cc3" size={50} />
                <p>Cargando metas...</p>
            </div>
        )
    } else if(!goal.length){
        return (
            <div className="empty-state-goals">
                <Target size={64} />
                <h3>No hay metas establecidas</h3>
                <p>Agrega tu primer objetivo</p>
            </div>
        ) 
    }

    return (
        <>
            <div className="goal-container">
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
                                            <h3 className={`goal-title-text ${met.completed ? 'completed' : ''}`}>
                                                {met.title}
                                            </h3>
                                            <div className="priority-container">
                                                <span className="priority-label">Prioridad:</span>
                                                <span className={`priority-badge priority-${met.priority}`}>
                                                    {met.priority}
                                                </span>
                                            </div>
                                        </div>

                                        {goalIndex === met._id && !met.completed && (
                                            <div className="inline-actions">
                                                <Tooltip title="Editar" arrow>
                                                    <button 
                                                        className="action-btn-inline edit-btn" 
                                                        onClick={() => handleEditProduct(met)}
                                                    >
                                                        <Pencil size={14} />
                                                    </button>
                                                </Tooltip>
                                                <Tooltip title="Eliminar" arrow>
                                                    <button 
                                                        className="action-btn-inline delete-btn" 
                                                        onClick={() => openDeleteModal(
                                                            () => deleteGoal(met._id),
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
                                            <span>Creada: {formateDate(met.start_date)}</span>
                                        </div>
                                        {met.completed && met.completed_at && (
                                            <div className="goal-date-info completed-date-info">
                                                <CheckCircle2 size={14} />
                                                <span>Completada: {formateDate(met.completed_at)}</span>
                                            </div>
                                        )}
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
            </div>

            {editingId !== null && (
                <div className="modal-overlay-inline" onClick={handleCancelEdit}>
                    <div className="modal-content-inline" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-inline">
                            <h3>Editar Meta</h3>
                            <button 
                                className="modal-close-btn" 
                                onClick={handleCancelEdit}
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
                                <label>Prioridad</label>
                                <select 
                                    className="modal-select"
                                    value={editData.priority}
                                    onChange={(e) => setEditData({
                                        ...editData,
                                        priority: e.target.value
                                    })}
                                >
                                    <option value="alta">Alta</option>
                                    <option value="media">Media</option>
                                    <option value="baja">Baja</option>
                                </select>
                            </div>

                            <div className="form-group-inline">
                                <label>Fecha límite</label>
                                <input 
                                    type="date"
                                    className="modal-input"
                                    value={editData.startDate.split('T')[0]}
                                    onChange={(e) => setEditData({
                                        ...editData,
                                        startDate: e.target.value
                                    })}
                                />
                            </div>

                            <div className="modal-actions-inline">
                                <button 
                                    className="modal-btn modal-btn-primary" 
                                    onClick={() => handleSaveGoal(editingId)}
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
                        totalItems={goal.length}
                        offSet={offSet}
                        pageCount={pageCount}
                    />
                )
            }

            <Toaster />
        </>
    );
};