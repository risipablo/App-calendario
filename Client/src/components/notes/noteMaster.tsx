import { useEffect, useState } from "react";
import { useNotes } from "../../hooks/useNote";
import { NoteForm } from "./noteForm";
import { NoteContainer } from "./noteContainer";
import { ModalConfirm } from "../layout/modalConfirm";
import { Tooltip } from "@mui/material";
import { Trash2 } from "lucide-react";
import type { INote } from "../../interfaces/type.notes";
import "../../style/task.css"



export const NoteMaster = () => {

    const {note,addNote,editNote,deleteNote,allDeleteNote,toogleComplete} = useNotes()

    const [date,SetDate] = useState<string>('')
    const [title,setTitle] = useState<string>('')
    const [category,setCategory] = useState<string>('')
    const [filteredNotes, setFilteredNotes] = useState<INote[]>([]);

    const handleAddNote = () => {
        addNote(new Date(date),title,category || 'otro')
        SetDate("")
        setTitle("")
        setCategory("")
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

    useEffect(() => {
        setFilteredNotes(note)
    },[note])

    return(
        <div className="task-table-container">
            
            <div className="table-header">
                <h2 className="table-title">
                     Notas Rapidas
                </h2>

                <div className="header-actions">
                    <NoteForm
                        onAdd={handleAddNote}
                        title={title}
                        date={date}
                        category={category}
                        setDate={SetDate}
                        setTitle={setTitle}
                        setCategory={setCategory}
                    />



                    <Tooltip title="Eliminar todas las notas" arrow>
                        <button className="delete-all-btn" onClick={() => openDeleteModal(
                            allDeleteNote,
                            "Confirmar borrado",
                            `¿Estás seguro que deseas eliminar todas las notas (${note.length})?`,
                            "Eliminar Todas"
                        )}>
                            <Trash2 size={18} />
                            Eliminar Todas ({note.length})
                        </button>
                    </Tooltip>

                </div>
            </div>

            <NoteContainer
                note={note}
                displayNote={filteredNotes}
                setFilterNote={setFilteredNotes}
                addNote={addNote}
                ondAddNote={handleAddNote}
                deleteNote={deleteNote}
                editNote={editNote}
                allDeleteNote={allDeleteNote}
                toogleComplete={toogleComplete}
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