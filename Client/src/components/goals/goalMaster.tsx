import { useState } from "react"
import { useGoals } from "../../hooks/useGoal"
import { GoalForm } from "./goalForm"
import { GoalContainer } from "./goalContainer"
import {  FilterX, Trash2 } from "lucide-react"
import { Tooltip } from "@mui/material"
import { ModalConfirm } from "../layout/modalConfirm"
import { FilterGoal } from "../layout/filter/filterGoal";
import type { IGoal } from "../../interfaces/type.goal";
import axiosInstance from "../../utils/axiosIntance";


export const GoalMaster = () => {

    const {goal,setGoal,addGoal,allDeleteGoal,deleteGoal,deleteFilteredGoals,editGoal,toogleComplete} = useGoals()

    const[title,setTitle] = useState<string>("")
    const[description,setDescription] = useState<string>("")
    const[priority,setPriority] = useState<string>("")
    const[startDate,setStartDate] = useState<string>("")
    const[filteredGoal, setFilteredGoal] = useState<IGoal[]>([])


    const handleAddGoal = () => {
        addGoal(title,description,priority,startDate)
        setTitle("")
        setDescription("")
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

    
    const [activeFilter, setFilterActive] = useState<string>('')
    const [showModalFilter,setShowModalFilter] = useState(false)
    const [monthFilter, setMonthFilter] = useState<string>('')
    const [yearFilter, setYearFilter] = useState<string>('')

    const getFilterDescription = () => {
        if (activeFilter === 'fechas'){
            const monthNames: Record<string,string> = {
                '01': 'Enero', '02': 'Febrero', '03': 'Marzo', '04': 'Abril',
                '05': 'Mayo', '06': 'Junio', '07': 'Julio', '08': 'Agosto',
                '09': 'Septiembre', '10': 'Octubre', '11': 'Noviembre', '12': 'Diciembre'
            }
            if (monthFilter && yearFilter) return `${monthNames[monthFilter]} ${yearFilter}`
            if (monthFilter) return `mes ${monthNames[monthFilter]}`
            if (yearFilter) return `año ${yearFilter}`
        }
        return activeFilter
    }

    const handleDeleteFiltered = async () => {
        if (!activeFilter) return
        
        await deleteFilteredGoals({
            filterType: activeFilter,
            ...(activeFilter === 'fechas' && { month: monthFilter, year: yearFilter })
        })
        setShowModalFilter(false)
        setFilterActive('') 
        
        const response = await axiosInstance.get('/api/goal')
        setFilteredGoal(response.data)
        setGoal(response.data)
    }
 
    

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
                        description={description}
                        start_date={startDate}
                        priority={priority}
                        setPriority={setPriority}
                        setStartDate={setStartDate}
                        setTitle={setTitle}
                        setDescription={setDescription}
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

                    {activeFilter && filteredGoal.length > 0 && (
                        <Tooltip title={`Eliminar solo las metas de: ${getFilterDescription()}`} arrow>
                            <button 
                                className="delete-all-btn" 
                                onClick={() => setShowModalFilter(true)}
                            >
                                <Trash2 size={18} />
                                <FilterX size={14} />
                                <span>Eliminar Filtradas ({filteredGoal.length})</span>
                            </button>
                        </Tooltip>
                    )}

                </div>
            </div>

            <FilterGoal 
                goal={goal} 
                setGoalFilter={setFilteredGoal} 
                setFilterActive={setFilterActive}
                onFilterChange={({monthFilter,yearFilter}) => {
                    setMonthFilter(monthFilter)
                    setYearFilter(yearFilter)
                }}
            />
            <GoalContainer            
                goal={goal}
                filteredGoal={filteredGoal}
                setFilteredGoal={setFilteredGoal}
                activeFilter={activeFilter}
            
                addGoal={addGoal}
                deleteGoal={deleteGoal}
                editGoal={editGoal}
                toogleComplete={toogleComplete}
                allDeleteGoal={allDeleteGoal}
                onAddGoal={handleAddGoal}
                onDeleteFiltered={() => setShowModalFilter(true)}
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

            {showModalFilter &&  (
                <ModalConfirm
                    isOpen={showModalFilter}
                    onClose={() => setShowModalFilter(false)}
                    onConfirm={handleDeleteFiltered}
                    title="⚠️ Eliminar metas filtradas"
                    message={`¿Estás seguro que deseas eliminar todas las metas de "${getFilterDescription()}" (${filteredGoal.length} metas)?`}
                    confirmText={`Eliminar ${filteredGoal.length} metas`}
                    cancelText="Cancelar"
                />
            )}

        </div>
    )
}
