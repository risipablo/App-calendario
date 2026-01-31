import { useState } from "react"
import { useGoals } from "../../hooks/useGoal"
import { GoalForm } from "./goalForm"
import { GoalContainer } from "./goalContainer"
import {  Trash2 } from "lucide-react"
import { Tooltip } from "@mui/material"
import { ModalConfirm } from "../layout/modalConfirm"

export const GoalMaster = () => {

    const {goal,addGoal,allDeleteGoal,deleteGoal,editGoal,toogleComplete} = useGoals()

    const[title,setTitle] = useState<string>("")
    const[priority,setPriority] = useState<string>("")
    const[startDate,setStartDate] = useState<string>("")

    const handleAddGoal = () => {
        addGoal(title,priority,startDate)
        setTitle("")
        setPriority("")
        setStartDate("")
    }

    const [showModal,setShowModal] = useState(false)
    const [deleteAction, setDeleteAction] = useState<(() => void) | null>(null)
    const [modalConfig, setModalConfig] = useState({
        title: "",
        message: "",
        confirmText: ""
    });

    const openDeleteModal = (
        action:() => void,
        title:string,
        message:string,
        confirmText:string
    ) => {
        setDeleteAction(() => action)
        setModalConfig({title,message,confirmText})
        setShowModal(true)
    }

    const confirmModal = () => {
        if (deleteAction) {
            deleteAction();
            setShowModal(false);
            setDeleteAction(null);
        }
    };


    

    return(
        <div className="task-table-container">
            <div className="table-header">
                <h2 className="table-title">
                     Mis Objetivos
                </h2>

                <div className="header-actions">
                    <GoalForm
                        onAdd={handleAddGoal}
                        title={title}
                        start_date={startDate}
                        priority={priority}
                        setPriority={setPriority}
                        setStartDate={setStartDate}
                        setTitle={setTitle}
                    />

                    <Tooltip title="Eliminar todas las tareas" arrow>
                        <button className="delete-all-btn" onClick={() => openDeleteModal(
                            allDeleteGoal,
                            "Confirmar borrado",
                            `¿Estás seguro que deseas eliminar todas las metas (${goal.length})?`,
                            "Eliminar Todas"
                        )}>
                            <Trash2 size={18} />
                            Eliminar Todas ({goal.length})
                        </button>
                    </Tooltip>

                </div>
            </div>

            <GoalContainer            
                goal={goal}
                addGoal={addGoal}
                deleteGoal={deleteGoal}
                editGoal={editGoal}
                toogleComplete={toogleComplete}
                allDeleteGoal={allDeleteGoal}
                onAddGoal={handleAddGoal}
                
            />
            

            {showModal && (
                <ModalConfirm   
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={confirmModal}
                title={modalConfig.title}
                message={modalConfig.message}
                confirmText={modalConfig.confirmText}
                cancelText="Cancelar" />
            )}

        </div>
    )
}
