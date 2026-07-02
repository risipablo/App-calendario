import type React from "react";
import type { IGoal } from "../../../interfaces/type.goal";
import "../../../style/filter-button.css"
import { useCallback, useEffect, useMemo, useState } from "react";
import { Filter, RotateCcw, X } from "lucide-react";

type Props = {
    goal: IGoal[]
    setGoalFilter: React.Dispatch<React.SetStateAction<IGoal[]>>
    setFilterActive: React.Dispatch<React.SetStateAction<string>>
    onFilterChange?:(filters:{ monthFilter:string; yearFilter:string}) => void
}

export const FilterGoal = ({goal,setFilterActive,setGoalFilter,onFilterChange}:Props) => {
    
    const [priorityFilter,setPriorityFilter] = useState<string>('')
    const [monthFilter, setMonthFilter] = useState<string>('')
    const [yearFilter, setYearFilter] = useState<string>('')

    const [tempMonth, setTempMonth] = useState<string>('')
    const [tempYear, setTempYear] = useState<string>('')
    const [completeFilter,setCompleteFilter] = useState<string>('')


    const [filterModal, setFilterModal] = useState(false)


    const normalDate = useCallback((dateInput: string | Date): string => {
        if (!dateInput) return '';
    
        // Transformar el date a string
        const dateStr = typeof dateInput === 'object' ? dateInput.toISOString() : dateInput;
        
        // Extre la fecha de caracteres e ignora el horario
        if (dateStr.includes("T")) {
            return dateStr.split("T")[0];
        }
    
        // Se devuelve el formato fecha
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            return dateStr;
        }
    
        return dateStr;
        }, []);

    
    const filteredGoals = useMemo(() => {
        let filtered = [...goal]

        if(priorityFilter){
            filtered = filtered.filter(g => normalDate(g.priority) === priorityFilter)
        }

        

        if(monthFilter || yearFilter){
            filtered = filtered.filter(t => {
                const normalized = normalDate(t.start_date)
                const [year,month] = normalized.split('-')

                const matchMonth = monthFilter ? month === monthFilter : true;
                const matchYear = yearFilter ? year === yearFilter : true;
                
                return matchMonth && matchYear;
            })
        }

        if(completeFilter){
            filtered = filtered.filter(g =>{
                if (completeFilter === 'completadas') return g.completed === true
                if (completeFilter === 'pendientes') return g.completed === false
                return true 
            })
        }


        return filtered
    },[goal, monthFilter, yearFilter, normalDate,priorityFilter,completeFilter,setFilterActive])


    useEffect(() => {

        setGoalFilter(filteredGoals)

        if(onFilterChange){
            onFilterChange({monthFilter, yearFilter})
        }


    },[setGoalFilter,setFilterActive,onFilterChange,filteredGoals])


    const handleOpenFilterModal = () => {
        setTempMonth(monthFilter)
        setTempYear(yearFilter)
        setFilterModal(true)
    }
    const handleApplyFilters = () => {
        setMonthFilter(tempMonth)
        setYearFilter(tempYear)
        setFilterModal(false)
    }

    const handleReset = () => {
        setPriorityFilter('')
        setMonthFilter("")
        setYearFilter("")
        setTempMonth('')
        setTempYear('')
        setCompleteFilter('')
        setGoalFilter([...goal])
        setFilterActive('')
    }

    const hasActiveFilters = priorityFilter || monthFilter || yearFilter || completeFilter

    return(
        <div className="filter-buttons-group">
            <select
                className={`btn-toggle-view ${priorityFilter ? 'active' : ''}`}
                value={priorityFilter} 
                onChange={(e) => setPriorityFilter(e.target.value)} 
            >
                <option value="">Selecciona una prioridad</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
            </select>


            <button 
                    onClick={handleOpenFilterModal}  
                    className={`btn-toggle-view ${monthFilter || yearFilter ? 'active' : ''}`}
                >
                    <Filter size={18} />
                    {monthFilter || yearFilter ? 
                        `Filtros: ${monthFilter ? `Mes ${monthFilter}` : ''}${yearFilter ? ` ${yearFilter}` : ''}` 
                        : 'Filtros mes/año'}
            </button>


            <select 
                className={`btn-toggle-view ${completeFilter ? 'active' : ''}`}
                value={completeFilter} 
                onChange={(e) => setCompleteFilter(e.target.value)}
            >
                <option value="todos">Todos</option>
                <option value="completadas">Logrado</option> 
                <option value="pendientes">Pendientes</option>
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

            {filterModal && (
                <div className="task-modal-overlay" onClick={() => setFilterModal(false)}>
                    <div className="task-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="task-modal-header">
                            <h3>Filtrar por mes y año</h3>
                            <button className="task-modal-close" onClick={() => setFilterModal(false)}>
                                <X size={22} />
                            </button>
                        </div>
                        
                        <div className="task-modal-body">
                            <div className="task-form-group">
                                <label>Seleccionar mes</label>
                                <select 
                                    value={tempMonth}
                                    onChange={(e) => setTempMonth(e.target.value)}
                                    className="task-select"
                                >
                                    <option value="">Todos los meses</option>
                                    <option value="01">Enero</option>
                                    <option value="02">Febrero</option>
                                    <option value="03">Marzo</option>
                                    <option value="04">Abril</option>
                                    <option value="05">Mayo</option>
                                    <option value="06">Junio</option>
                                    <option value="07">Julio</option>
                                    <option value="08">Agosto</option>
                                    <option value="09">Septiembre</option>
                                    <option value="10">Octubre</option>
                                    <option value="11">Noviembre</option>
                                    <option value="12">Diciembre</option>
                                </select>
                            </div>

                            <div className="task-form-group">
                                <label>Seleccionar año</label>
                                <select 
                                    value={tempYear}
                                    onChange={(e) => setTempYear(e.target.value)}
                                    className="task-select"
                                >
                                    <option value="">Todos los años</option>
                                    <option value="2024">2024</option>
                                    <option value="2025">2025</option>
                                    <option value="2026">2026</option>
                                    <option value="2027">2027</option>
                                    <option value="2028">2028</option>
                                    <option value="2029">2029</option>
                                    <option value="2030">2030</option>
                                </select>
                            </div>

                            <div className="task-modal-actions">
                                <button 
                                    className="task-btn task-btn-primary"
                                    onClick={handleApplyFilters}
                                >
                                    Aplicar filtros
                                </button>
                                {(monthFilter || yearFilter) && (
                                    <button className="task-btn task-btn-secondary" onClick={() => {
                                        setMonthFilter("")
                                        setYearFilter("")
                                    }}>
                                        Limpiar
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    )
}