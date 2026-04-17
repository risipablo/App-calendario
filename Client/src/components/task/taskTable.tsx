

import { useEffect, useState } from "react";
import { Tooltip } from '@mui/material';
import { FilterX, Trash2 } from 'lucide-react';
import type { TaskTableProps } from "../../interfaces/type.task";
import { TaskRow } from "./taskRow";
import "../../style/task.css";
import { ModalConfirm as DefaultModalConfirm } from '../layout/modalConfirm';
import { TaskForm } from "./taskForm";
import { ClipLoader } from "react-spinners";
import { PaginationComponent } from "../layout/pagination";
import { FilterPerDay } from "../layout/filter/filterPerDay";
import toast from "react-hot-toast";




export const TaskTable = ({
    task,
    filterTask,
    setFilterTask,
    addTask,
    addNewTask,
    toogleAllTask,
    completedTask,
    completedSubTasks,
    deleteSubTask,
    editSubTask,
    onDelete,
    onDeleteAll,
    saveTask,
    incompletedSubtask,
    ModalConfirm
}: TaskTableProps) => {
    
    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        setCurrentPage(0)
        const timer = setTimeout(() => {
            // eslint-disable-next-line react-hooks/immutability
            setLoading(false)
        }, 100);
        return () => clearTimeout(timer)
    },[task.length])


    const [date, setDate] = useState<string>("")
    const [title,setTitle] = useState<string>("")
    const [priority,setPriority] = useState<string>("")
    const [loading ,setLoading] = useState(true)

    

    const handleAddTask = () => {
        if(date && title.trim() && priority){
            addTask(new Date(date), title, priority)
            setDate("")
            setTitle("")
            setPriority("")
        }

    }

    

    const [showModal, setShowModal] = useState(false);
    const [deleteAction, setDeleteAction] = useState<(() => void) | null>(null);
    const [modalConfig, setModalConfig] = useState({
        title: "",
        message: "",
        confirmText: ""
    });

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

    const ModalComponent = ModalConfirm || DefaultModalConfirm;

    const [showToday, setShowToday] = useState(false);
    const [dateFilter, setDateFilter] = useState<string>('')
    const [monthFilter, setMonthFilter] = useState<string>('')
    const [yearFilter, setYearFilter] = useState<string>('')
    
    const handleFiltersChange = (filters: {dateFilter:string; monthFilter:string; yearFilter:string, showToday?: boolean}) => {
        setDateFilter(filters.dateFilter)
        setMonthFilter(filters.monthFilter)
        setYearFilter(filters.yearFilter)
        if (filters.showToday !== undefined) setShowToday(filters.showToday);
        setCurrentPage(0);
    }

    const [showDeleteFilteredModal, setShowDeleteFilteredModal] = useState(false)

    const getFilterDescription = () => {
        if (showToday) return "de hoy"
        if (dateFilter) return `del día ${dateFilter}`
        if (monthFilter && yearFilter) {
            const monthNames: Record<string, string> = {
                '01': 'Enero', '02': 'Febrero', '03': 'Marzo', '04': 'Abril',
                '05': 'Mayo', '06': 'Junio', '07': 'Julio', '08': 'Agosto',
                '09': 'Septiembre', '10': 'Octubre', '11': 'Noviembre', '12': 'Diciembre'
            }
            return `de ${monthNames[monthFilter]} ${yearFilter}`
        }
        if (yearFilter) return `del año ${yearFilter}`
        return "filtradas"
    }

    const deleteFilteredTasks = () => {
        const tasksToDelete = [...filterTask];

        let deletedCount = 0
        let errorCount = 0

        tasksToDelete.forEach(async (t) => {
            try{
                await onDelete?.(t._id)
                deletedCount++
            } catch (error){
                errorCount++
                console.error(error)
            }
        })
        setTimeout(() => {
            if (errorCount === 0) {
                toast.success(` Se eliminaron ${deletedCount} tareas ${getFilterDescription()}`)
            } else {
                toast.error(` Se eliminaron ${deletedCount} tareas, ${errorCount} errores`)
            }
        }, 500)

        setShowDeleteFilteredModal(false)
    }

    const hasActiveFilters = showToday || dateFilter || monthFilter || yearFilter

    // Paginate task      
      const [currentPage, setCurrentPage] = useState<number>(0)
      const itemsPerPage = 3;
      
      
      const pageCount = Math.ceil(filterTask.length / itemsPerPage);
      const offset = currentPage * itemsPerPage;
      const currentItems = filterTask.slice(offset, offset + itemsPerPage);

      
      

    return (
        <div className="task-table-container">


            <div className="table-header">
                <h2 className="table-title">  Mis Tareas</h2>

     
                <div className="header-actions">
                    <TaskForm 
                        date={date}
                        title={title} 
                        priority={priority} 
                        setDate={setDate} 
                        setPriority={setPriority} 
                        setTitle={setTitle} 
                        onAdd={handleAddTask}    
                    />
    
                    <Tooltip title="Eliminar todas las tareas" arrow>
                        <button className="delete-all-btn" onClick={() => openDeleteModal(
                            onDeleteAll,
                            "Confirmar borrado",
                            `¿Estás seguro que deseas eliminar todas las tareas (${task.length})?`,
                            "Eliminar Todas"
                        )}>
                            <Trash2 size={18} />
                            
                            Eliminar Todas ({showToday ? `${filterTask.length}` : `${task.length}`})
                        </button>
                    </Tooltip>

                    {hasActiveFilters && filterTask.length > 0 && (
                        <Tooltip title={`Eliminar solo las tareas ${getFilterDescription()}`} arrow>
                            <button 
                                className="delete-all-btn" 
                                onClick={() => setShowDeleteFilteredModal(true)}
                            >
                                <Trash2 size={18} />
                                <FilterX size={14} />
                                <span>Eliminar Filtradas ({filterTask.length})</span>
                            </button>
                        </Tooltip>
                    )}
                    
                </div>
            </div>

            <div className="toogle-view">
  
                <FilterPerDay task={task} setFilterTask={setFilterTask} onFilterChange={handleFiltersChange}/>
            </div>
            
            {
                loading ? (
                    <div className="loading-message">
                        <ClipLoader color="#8e7cc3" size={50} />
                        <p>Cargando tareas...</p>
                    </div>
                ) : !task.length  ? (
                    <div className="empty-state-goals">
            
                        <h3>No hay tareas establecidas</h3>
                        <p>Agrega tu primera tarea</p>
                    </div>
                ) : filterTask.length === 0 ? (
                    <div className="empty-state-goals">
                        <h3>No se encontraron tareas</h3>
                        <p>
                            {showToday 
                                ? "No hay tareas programadas para hoy" 
                                : dateFilter || monthFilter || yearFilter
                                    ? "No hay tareas que coincidan con los filtros seleccionados"
                                    : "No hay tareas establecidas"}
                        </p>
                        <p className="empty-state-hint">
                            {showToday 
                                ? "Prueba a crear una nueva tarea para hoy" 
                                : dateFilter || monthFilter || yearFilter
                                    ? "Intenta con otros filtros o limpia los filtros actuales"
                                    : "Agrega tu primera tarea usando el formulario"}
                        </p>
                        {(dateFilter || monthFilter || yearFilter) && (
                            <button 
                                className="btn-toggle-view" 
                                onClick={() => {
                                    // Limpiar todos los filtros
                                    setFilterTask([])
                                    setShowToday(false)
                                }}
                                style={{ marginTop: '16px' }}
                            >
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="table-wrapper">
                        
                        <table className="tasks-table">
                            
                                    <>
                                    <thead>
                                        <tr>
                                            <th>Fecha</th>
                                            <th>Tarea</th>
                                            <th>Progreso</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems.map(tas => (
                                                <TaskRow 
                                                    key={tas._id}
                                                    tas={tas}
                                                    addTask={addTask}
                                                    deleteTask={onDelete}
                                                    deleteSubTask={deleteSubTask}
                                                    editSubTask={editSubTask}
                                                    toogleAllTask={toogleAllTask}
                                                    completedTask={completedTask}
                                                    completedSubTasks={completedSubTasks}
                                                    incompletedSubtask={incompletedSubtask}
                                                    addNewTask={addNewTask}
                                                    saveTask={saveTask}
                                                    ModalConfirm={ModalConfirm}
                                                />
                                            ))}
                                    </tbody>
                                </>
                                    
                            

                        </table>
                    </div>
                )
            }

            {
                pageCount > 1 && (
                    <PaginationComponent
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalItems={task.length}
                    itemsPerPage={itemsPerPage}
                    offset={offset}
                    pageCount={pageCount}

                />
                )
            }
                    

            {showModal && (
                <ModalComponent
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={confirmModal}
                    title={modalConfig.title}
                    message={modalConfig.message}
                    confirmText={modalConfig.confirmText}
                    cancelText="Cancelar"
                />
            )}

        {showDeleteFilteredModal && (
                <ModalComponent
                    isOpen={showDeleteFilteredModal}
                    onClose={() => setShowDeleteFilteredModal(false)}
                    onConfirm={deleteFilteredTasks}
                    title="⚠️ Eliminar tareas filtradas"
                    message={`¿Estás seguro que deseas eliminar las ${filterTask.length} tareas ${getFilterDescription()}? Esta acción no se puede deshacer.`}
                    confirmText={`Eliminar ${filterTask.length} tareas`}
                    cancelText="Cancelar"
                />
            )}
        </div>
    );
};