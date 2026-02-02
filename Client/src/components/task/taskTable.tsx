

import { useEffect, useMemo, useState } from "react";
import { Tooltip } from '@mui/material';
import { Calendar, Trash2 } from 'lucide-react';
import type { TaskTableProps } from "../../interfaces/type.task";
import { TaskRow } from "./taskRow";
import "../../style/task.css";
import { ModalConfirm as DefaultModalConfirm } from '../layout/modalConfirm';
import { TaskForm } from "./taskForm";
import { ClipLoader } from "react-spinners";
import { PaginationComponent } from "../layout/pagination";





export const TaskTable = ({
    task,
    addTask,
    addNewTask,
    toogleAllTask,
    completedTask,
    completedSubTasks,
    deleteSubTask,
    editSubTask,
    onDelete,
    onDeleteAll,
    deletePrincipalTask,
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
    const [showToday, setShowToday] = useState(false);


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



    const filteredTasks = useMemo(() => {
        if (!showToday) return task;
        
        const todayStr = new Date().toISOString().split('T')[0]; // "2024-01-16"
        
        return task.filter(tas => {
            const taskDateStr = new Date(tas.date).toISOString().split('T')[0];
            return taskDateStr === todayStr;
        });
    }, [task, showToday]);

    // Paginate task      
      const [currentPage, setCurrentPage] = useState<number>(0)
      const itemsPerPage = 3;
      
      
      const pageCount = Math.ceil(filteredTasks.length / itemsPerPage);
      const offset = currentPage * itemsPerPage;
      const currentItems = filteredTasks.slice(offset, offset + itemsPerPage);

      
      

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
                            
                            Eliminar Todas ({showToday ? `${filteredTasks.length}` : `${task.length}`})
                        </button>
                    </Tooltip>
                </div>
                                    
            </div>

            <div className="toogle-view">
                <button     
                        className="btn-toggle-view"
                        onClick={() => setShowToday(!showToday)}
                    >
                        <Calendar size={18} />
                        {showToday ? 'Ver Todas' : 'Ver Hoy'}
                </button>
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
                                                    deletePrincipalTask={deletePrincipalTask}
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
        </div>
    );
};