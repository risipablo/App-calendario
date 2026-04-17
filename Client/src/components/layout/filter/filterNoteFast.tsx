import type { INote } from "../../../interfaces/type.notes";
import { useState } from "react";
import "../../../style/filter-button.css"
import { RotateCcw } from "lucide-react";

type Props = {
    note: INote[]
    setNoteFilter: React.Dispatch<React.SetStateAction<INote[]>>
}

export const FIlterNote = ({ note, setNoteFilter }: Props) => {
    const [categoryFilter, setCategoryFilter] = useState<string>('')

    const handleCategoryChange = (value: string) => {
        setCategoryFilter(value)
        
        if (!value || value === '') {
            setNoteFilter([...note])
            return
        }
        
        const filtered = note.filter(n => n.category === value)
        setNoteFilter(filtered)
    }

    const handleReset = () => {
        setCategoryFilter('')
        setNoteFilter([...note])
    }

    // const hasActiveFilters = categoryFilter !== ''

    return (
        <div className="filter-buttons-group">
            <button 
                className={`btn-toggle-view ${categoryFilter ? 'active' : ''}`}
                onClick={() => {
                    const select = document.querySelector('.category-select') as HTMLSelectElement;
                    if (select) {
                        handleCategoryChange(select.value);
                    }
                }}
                style={{ display: 'none' }}
            >
                Filtrar por categoría
            </button>

            <select 
                className="btn-toggle-view category-select"
                value={categoryFilter} 
                onChange={(e) => handleCategoryChange(e.target.value)}
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

            
                <button 
                    onClick={handleReset}  
                    className="btn-toggle-view btn-reset"
                >
                    <RotateCcw size={18} />
                    Limpiar filtros
                </button>
            
        </div>
    )
}