import type { INote } from "../../../interfaces/type.notes";
import { useEffect, useState } from "react";
import "../../../style/filter-button.css"
import { RotateCcw } from "lucide-react";

type Props = {
    note: INote[]
    setNoteFilter: React.Dispatch<React.SetStateAction<INote[]>>
}

export const FilterNote = ({ note, setNoteFilter }: Props) => {
    const [categoryFilter, setCategoryFilter] = useState<string>('')

    useEffect(() => {
        if (!categoryFilter) {
            setNoteFilter([...note])
            return
        }

        const filtered = note.filter(n => n.category === categoryFilter)
        setNoteFilter(filtered)
    }, [categoryFilter, note, setNoteFilter])

    

    const handleReset = () => {
        setCategoryFilter('')
        setNoteFilter([...note])
    }

    const hasActiveFilters = categoryFilter.trim().length > 0

    return (
        <div className="filter-buttons-group">
            <select 
                className={`btn-toggle-view ${categoryFilter ? 'active' : ''}`}
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
            >
                <option value="">Todas las categorías</option>
                <option value="trabajo">Trabajo</option>
                <option value="personal">Personal</option>
                <option value="estudio">Estudio</option>
                <option value="deporte">Deporte</option>
                <option value="idea">Idea</option>
                <option value="salud">Salud</option>
                <option value="otro">Otro</option>
            </select>

            {hasActiveFilters && (
                <button 
                    onClick={handleReset}  
                    className="btn-toggle-view btn-reset"
                >
                    <RotateCcw size={18} />
                    Limpiar filtros
                </button>
            )}
        </div>
    )
}