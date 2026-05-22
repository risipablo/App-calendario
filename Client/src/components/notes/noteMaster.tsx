import { useEffect, useState } from "react";
import { useNotes } from "../../hooks/useNote";
import { NoteForm } from "./noteForm";
import { NoteContainer } from "./noteContainer";
import { ModalConfirm } from "../layout/modalConfirm";
import { Tooltip } from "@mui/material";
import { FilterX, Trash2 } from "lucide-react";
import type { INote, NoteCategory } from "../../interfaces/type.notes";
import "../../style/task.css"
import "../../style/goal.css"

import axiosInstance from "../../utils/axiosIntance";
import { FilterNote } from "../layout/filter/filterNoteFast";



export const NoteMaster = () => {

    const {note,setNote,addNote,editNote,deleteNote,allDeleteNote,toogleComplete, deleteFilteredNote} = useNotes()

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

    const [activeFilter, setFilterActive] = useState<string>('')
    const [showModalFilter,setShowModalFilter] = useState(false)

    const handleDeleteFiltered = async () => {
        if (!activeFilter) return
        
        await deleteFilteredNote({ filterType: activeFilter as NoteCategory })
        setShowModalFilter(false)
        setFilterActive('') 
        
        const response = await axiosInstance.get('/api/note')
        setFilteredNotes(response.data)
        setNote(response.data)
    }


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

                    {activeFilter && filteredNotes.length > 0 && (
                        <Tooltip title={`Eliminar solo las notas de: ${activeFilter} `} arrow>
                            <button 
                                className="delete-all-btn" 
                                onClick={() => setShowModalFilter(true)}
                            >
                                <Trash2 size={18} />
                                <FilterX size={14} />
                                <span>Eliminar Filtradas ({filteredNotes.length})</span>
                            </button>
                        </Tooltip>
                    )}

                </div>
            </div>

            

            
            <FilterNote note={note} setNoteFilter={setFilteredNotes} setFilterActive={setFilterActive}/>
            <NoteContainer
                note={note}
                filteredNotes={filteredNotes}
                setFilterNote={setFilteredNotes}
                addNote={addNote}
                ondAddNote={handleAddNote}
                deleteNote={deleteNote}
                editNote={editNote}
                allDeleteNote={allDeleteNote}
                toogleComplete={toogleComplete}
                activeFilter={activeFilter}
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

                  
                {/* Modal para eliminar filtradas */}
                {showModalFilter &&  (
                    <ModalConfirm
                        isOpen={showModalFilter}
                        onClose={() => setShowModalFilter(false)}
                        onConfirm={handleDeleteFiltered}
                        title="⚠️ Eliminar notas filtradas"
                        message={`¿Estás seguro que deseas eliminar todas las notas de categoría "${activeFilter}" (${filteredNotes.length} notas)?`}
                        confirmText={`Eliminar ${filteredNotes.length} notas`}
                        cancelText="Cancelar"
                    />
                )}

            </div>
        )
    }