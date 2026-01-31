
import { CalendarForm } from "./calendarForm"
import { useState } from "react"
import { CalendarContainer } from "./calendarContainer"
import { useCalendar } from "../../hooks/useCalendar"
import { ModalConfirm } from "../layout/modalConfirm"
import { Trash2 } from "lucide-react"
import { Tooltip } from "@mui/material"


export const CalendarMaster = () => {
    
    const{addNote,notes,deleteEvents,editEvents,deleteAllNotes} = useCalendar()

    const [title,setTitle] = useState<string>("")
    const [category,setCategory] = useState<string>("")
    const [priority,setPriority] = useState<string>("")
    const [date,setDate] = useState<string>("")
    const [hour,setHour] = useState<string>("")


    const handleAddNote = () => {
        if(title.trim() && category && date && priority && hour){
            addNote(title,date,category,priority,hour)
            setCategory("")
            setDate("")
            setPriority("")
            setTitle("")
            setHour("")
        }
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
        <div className="calendar-table-container">
            <div className="table-header">


                <h2 className="calendar-title">
                    Mi Calendario
                </h2>

                <div className="header-actions">
                    <CalendarForm 
                        onAdd={handleAddNote} 
                        title={title}
                        hour={hour}
                        category={category}
                        priority={priority}
                        date={date}
                        setCategory={setCategory}
                        setDate={setDate}
                        setHour={setHour}
                        setPriority={setPriority}
                        setTitle={setTitle}
                    />

                    
                    <Tooltip title="Eliminar todas las tareas" arrow>
                        <button className="delete-all-btn" onClick={() => openDeleteModal(
                            deleteAllNotes,
                            "Confirmar borrado",
                            `¿Estás seguro que deseas eliminar todas las metas (${notes.length})?`,
                            "Eliminar Todas"
                        )}>
                            <Trash2 size={18} />
                            Eliminar Todas ({notes.length})
                        </button>
                    </Tooltip>
                </div>
            </div>

            <CalendarContainer 
                notes={notes}
                addNote={addNote}
                deleteNote={deleteEvents}
                editNote={editEvents}
                onAddNote={handleAddNote}
                allDeleteNote={deleteAllNotes}
            />


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
        </div>
    )
}