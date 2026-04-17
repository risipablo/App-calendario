import type React from "react"
import type { ITodo } from "../../../interfaces/type.task"
import { useCallback, useEffect, useMemo, useState } from "react"
import { X, Calendar, Filter, RotateCcw } from "lucide-react"
import "../../../style/filter-button.css"



type Props = {
    task: ITodo[]
    setFilterTask: React.Dispatch<React.SetStateAction<ITodo[]>>
    onFilterChange?:(filters:{dateFilter:string; monthFilter:string; yearFilter:string}) => void
}

export const FilterPerDay = ({
    task,
    setFilterTask,
    onFilterChange
}: Props) => {

    const [showToday, setShowToday] = useState(false);
    const [dateFilter, setDateFilter] = useState<string>('')
    const [monthFilter, setMonthFilter] = useState<string>('')
    const [yearFilter, setYearFilter] = useState<string>('') 
    const [pendingDate, setPendingDate] = useState<string>('')
    const [addModal, setAddModal] = useState(false)
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

    const filteredTasks = useMemo(() =>{
        let filtered = [...task]


        if (showToday) {
            const todayStr = normalDate(new Date());
            return filtered.filter(t => normalDate(t.date) === todayStr);
        }

        if(dateFilter){
            filtered = filtered.filter(t => 
                normalDate(t.date) === dateFilter
            )
        }

        if (monthFilter || yearFilter) {
            filtered = filtered.filter(t => {
                const normalized = normalDate(t.date); 
                const [year, month] = normalized.split('-');
                
                const matchMonth = monthFilter ? month === monthFilter : true;
                const matchYear = yearFilter ? year === yearFilter : true;
                
                return matchMonth && matchYear;
            })
        }


        return filtered
    },[task, showToday, dateFilter, monthFilter, yearFilter, task, normalDate])

    

    useEffect(() => {
        setFilterTask(filteredTasks)


        if(onFilterChange){
            onFilterChange({dateFilter, monthFilter, yearFilter})
        }

        

    }, [filteredTasks, monthFilter, yearFilter, task, normalDate, setFilterTask,onFilterChange])

    const handleApplyDate = () => {
        setDateFilter(pendingDate)
        setShowToday(false)
        setAddModal(false)
    }

    const handleApplyFilters = () => {
        setFilterModal(false)
    }

    const resetAllFilters = () => {
        setDateFilter('')
        setMonthFilter("")
        setYearFilter("")
        setPendingDate("")
        setShowToday(false)
        setAddModal(false)
        setFilterModal(false)
    }

    const hasActiveFilters = dateFilter || monthFilter || yearFilter || showToday

    return (
        <>
            <div className="filter-buttons-group">

            <button     
                    className={`btn-toggle-view ${showToday ? 'active' : ''}`}
                    onClick={() => {
                        setShowToday(!showToday);
                        
                        if (!showToday) {
                            setDateFilter('');
                            setMonthFilter('');
                            setYearFilter('');
                        }
                    }}
                    
                >
                    <Calendar size={18} />
                    {showToday ? 'Ver Todas' : 'Ver Hoy'}
                </button>

                <button 
                    onClick={() => setAddModal(true)} 
                    className={`btn-toggle-view ${dateFilter ? 'active' : ''}`}
                >
                    <Calendar size={18} />
                    Filtrar por fecha
                   
                </button>
                
                <button 
                    onClick={() => setFilterModal(true)}  
                    className={`btn-toggle-view ${monthFilter || yearFilter ? 'active' : ''}`}
                >
                    <Filter size={18} />
                    {monthFilter || yearFilter ? 
                        `Filtros: ${monthFilter ? `Mes ${monthFilter}` : ''}${yearFilter ? ` ${yearFilter}` : ''}` 
                        : 'Filtros mes/año'}
                </button>

                {hasActiveFilters && (
                    <button 
                        onClick={resetAllFilters}  
                        className="btn-toggle-view btn-reset"
                    >
                        <RotateCcw size={18} />
                        Limpiar filtros
                    </button>
                )}
            </div>

            
            {addModal && (
                <div className="task-modal-overlay" onClick={() => setAddModal(false)}>
                    <div className="task-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="task-modal-header">
                            <h3>Filtrar por fecha específica</h3>
                            <button className="task-modal-close" onClick={() => setAddModal(false)}>
                                <X size={22} />
                            </button>
                        </div>
                        
                        <div className="task-modal-body">
                            <div className="task-form-group">
                                <label>Seleccionar fecha</label>
                                <input
                                    type="date"
                                    className="task-input" 
                                    value={pendingDate}
                                    onChange={(e) => setPendingDate(e.target.value)}
                                    placeholder="YYYY-MM-DD"
                                />
                            </div>

                            <div className="task-modal-actions">
                                <button 
                                    className="task-btn task-btn-primary"
                                    onClick={handleApplyDate}
                                    disabled={!pendingDate}
                                >
                                    Aplicar filtro
                                </button>
                                {dateFilter && (
                                    <button className="task-btn task-btn-secondary" onClick={() => {
                                        setDateFilter('')
                                        setPendingDate('')
                                        setAddModal(false)
                                    }}>
                                        Limpiar
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para filtros de mes y año */}
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
                                    value={monthFilter}
                                    onChange={(e) => setMonthFilter(e.target.value)}
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
                                    value={yearFilter}
                                    onChange={(e) => setYearFilter(e.target.value)}
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
        </>
    )
}