import { CheckCircle2, Clock, ListTodo, ChevronDown, ChevronUp } from "lucide-react"
import { useTasks } from "../context/taskContex"
import { useCalendars } from "../context/calendarContext"
import { useState, useEffect } from "react"
import "../style/dashboard.css"
import { CardLoader } from "../components/layout/cardLoader"
import { ClipLoader } from "react-spinners"

export const Dashboard = () => {
    
    const [showPending, setShowPending] = useState(false)
    const [showCompleted, setShowCompleted] = useState(false)
    const [showFailed, setShowFailed] = useState(false)

    const [showNotesToday, setShowToday] = useState(false)
    const [showNotesWeek, setShowWeek] = useState(false)
    const [showNotesMonth, setNotesMonth] = useState(false)

    // Estado de carga
    const [isLoading, setIsLoading] = useState(true)

    const {
        getCompletedSubtasks,
        getCompletedTask,
        getPendigTask,
        getPendingSubtasks,
        getTotalTaskCompleted,
        getTotalTaskIncompleted,
        getTotalTasksDay,
        getFailTask,
    } = useTasks()

    const totalTasks = getTotalTasksDay()
    const completedTasks = getTotalTaskCompleted()
    const incompletedTasks = getTotalTaskIncompleted()
    const pendingMain = getPendigTask()
    const pendingSub = getPendingSubtasks()
    const completedMain = getCompletedTask()
    const completedSub = getCompletedSubtasks()
    const failTask = getFailTask()

    const { getNotesDay, getNotesOfWeek, getNotesImportant } = useCalendars()

    const notesDay = getNotesDay()
    const notesWeek = getNotesOfWeek()
    const notesMonth = getNotesImportant()

    // Simular carga de datos
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 800);

        return () => clearTimeout(timer)
    }, [])




    return (
        <div className="task-table-container">
            <div className="table-header">
                <h2 className="table-title">Dashboard</h2>
            </div>

            {/* Cards de tareas */}
            <div className="dashboard-cards">
                
                {isLoading ? (
                    <>
                        <CardLoader />
                        <CardLoader />
                        <CardLoader />
                        <CardLoader />
                        <CardLoader />
                        <CardLoader />
                    </>
                ) : (
                    <>
                        {/* Tareas pendientes */}
                        <div className="dashboard-card card-purple">
                            <div className="card-main-content">
                                <div className="card-icon">
                                    <Clock size={42} />
                                </div>
                                
                                <div className="card-info-text">
                                    <h3 className="card-number">{incompletedTasks}</h3>
                                    <p className="card-label">Tareas pendientes</p>
                                </div>
                            </div>
                            
                            {/* Sección colapsable dentro de la card */}
                            <div className="tasks-section-inline">
                                <button 
                                    className="collapse-button-inline"
                                    onClick={() => setShowPending(!showPending)}
                                    aria-expanded={showPending}
                                >
                                    <span>Ver detalles</span>
                                    {showPending ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </button>

                                {showPending && (
                                    <div className="section-content-inline">
                                        {pendingMain.length === 0 && pendingSub.length === 0 ? (
                                            <p className="empty-message">No hay tareas pendientes</p>
                                        ) : (
                                            <>
                                                {pendingMain.length > 0 && (
                                                    <ul className="task-list-inline">
                                                        {pendingMain.map(task => (
                                                            <li key={task._id} className="task-item-inline pending">
                                                                <span className="task-title-inline">{task.title}</span>
                                                                <span className={`task-priority-inline priority-${task.priority.toLowerCase()}`}>
                                                                    {task.priority}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}

                                                {pendingSub.length > 0 && (
                                                    <ul className="task-list-inline">
                                                        {pendingSub.map((subtask, idx) => (
                                                            <li key={idx} className="task-item-inline pending">
                                                                <span className="task-title-inline">{subtask.title}</span>
                                                                <span className={`task-priority-inline priority-${subtask.priority.toLowerCase()}`}>
                                                                    {subtask.priority}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Tareas completadas */}
                        <div className="dashboard-card card-green">
                            <div className="card-main-content">
                                <div className="card-icon">
                                    <CheckCircle2 size={48} />
                                </div>

                                <div className="card-info-text">
                                    <h3 className="card-number">{completedTasks}</h3>
                                    <p className="card-label">Tareas completadas</p>
                                </div>
                            </div>
                            
                            {/* Sección colapsable dentro de la card */}
                            <div className="tasks-section-inline">
                                <button 
                                    className="collapse-button-inline"
                                    onClick={() => setShowCompleted(!showCompleted)}
                                    aria-expanded={showCompleted}
                                >
                                    <span>Ver detalles</span>
                                    {showCompleted ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </button>

                                {showCompleted && (
                                    <div className="section-content-inline">
                                        {completedMain.length === 0 && completedSub.length === 0 ? (
                                            <p className="empty-message">No hay tareas completadas</p>
                                        ) : (
                                            <>
                                                {completedMain.length > 0 && (
                                                    <ul className="task-list-inline">
                                                        {completedMain.map(task => (
                                                            <li key={task._id} className="task-item-inline completed">
                                                                <span className="task-title-inline">{task.title}</span>
                                                                <span className={`task-priority-inline priority-${task.priority.toLowerCase()}`}>
                                                                    {task.priority}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}

                                                {completedSub.length > 0 && (
                                                    <ul className="task-list-inline">
                                                        {completedSub.map((subtask, idx) => (
                                                            <li key={idx} className="task-item-inline completed">
                                                                <span className="task-title-inline">{subtask.title}</span>
                                                                <span className={`task-priority-inline priority-${subtask.priority.toLowerCase()}`}>
                                                                    {subtask.priority}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Total de tareas del día */}
                        <div className="dashboard-card card-orange">
                            <div className="card-main-content">
                                <div className="card-icon">
                                    <ListTodo size={48} />
                                </div>

                                <div className="card-info-text">
                                    <h3 className="card-number">{totalTasks}</h3>
                                    <p className="card-label">Total del día</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            
            {isLoading ? (
                <div className="loading-message" style={{ marginTop: '2rem' }}>
                    <ClipLoader color="#8e7cc3" size={50} />
                    <p>Cargando información del calendario...</p>
                </div>
            ) : (
                <>
                    {/* Secciones de calendario */}
                    <div className="calendar-notes-container">

                        {/* Asuntos del día */}
                        <div className="calendar-notes-section">
                            <button 
                                className="collapse-button"
                                onClick={() => setShowToday(!showNotesToday)}
                                aria-expanded={showNotesToday}
                            >
                                <h3 className="notes-section-title">Asuntos del día ({notesDay.length})</h3>
                                {showNotesToday ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                            
                            {showNotesToday && (
                                notesDay.length === 0 ? (
                                    <p className="empty-message">No hay asuntos este día</p>
                                ) : (
                                    <div className="notes-grid">
                                        {notesDay.map(note => (
                                            <div key={note._id} className="note-card">
                                                <h4 className="note-title">{note.title}</h4>
                                                <div className="note-header">
                                                    <span className={`note-priority priority-${note.priority}`}>
                                                        {note.priority.toUpperCase()}
                                                    </span>
                                                    <span className="note-hour">{note.hour} hs</span>
                                                </div>
                                                <span className={`note-category category-${note.category}`}>
                                                    {note.category}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )
                            )}
                        </div>
                                    
                        {/* Asuntos de la semana */}
                        <div className="calendar-notes-section">
                            <button
                                className="collapse-button"
                                onClick={() => setShowWeek(!showNotesWeek)}
                                aria-expanded={showNotesWeek}
                            >
                                <h3 className="notes-section-title">Asuntos de la semana ({notesWeek.length})</h3>
                                {showNotesWeek ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                            
                            {showNotesWeek && (
                                notesWeek.length === 0 ? (
                                    <p className="empty-message">No hay asuntos para la próxima semana</p>
                                ) : (
                                    <div className="notes-grid">
                                        {notesWeek.map(note => (
                                            <div key={note._id} className="note-card">
                                                <h4 className="note-title">{note.title}</h4>
                                                <div className="note-header">
                                                    <span className={`note-priority priority-${note.priority}`}>
                                                        {note.priority.toUpperCase()}
                                                    </span>
                                                    <span className="note-hour">{note.hour} hs</span>
                                                </div>
                                                <span className={`note-category category-${note.category}`}>
                                                    {note.category}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )
                            )}
                        </div>

                        {/* Asuntos importantes del mes */}
                        <div className="calendar-notes-section">
                            <button
                                className="collapse-button"
                                onClick={() => setNotesMonth(!showNotesMonth)}
                                aria-expanded={showNotesMonth}
                            >
                                <h3 className="notes-section-title">Asuntos importantes del mes ({notesMonth.length})</h3>
                                {showNotesMonth ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                            
                            {showNotesMonth && (
                                notesMonth.length === 0 ? (
                                    <p className="empty-message">No hay asuntos importantes del mes</p>
                                ) : (
                                    <div className="notes-grid">
                                        {notesMonth.map(note => (
                                            <div key={note._id} className="note-card">
                                                <h4 className="note-title">{note.title}</h4>
                                                <div className="note-header">
                                                    <span className={`note-priority priority-${note.priority}`}>
                                                        {note.priority.toUpperCase()}
                                                    </span>
                                                    <span className="note-hour">{note.hour} hs</span>
                                                </div>
                                                <span className={`note-category category-${note.category}`}>
                                                    {note.category}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    <div className="tasks-section failed-section">
                        <button 
                            className="collapse-button" 
                            onClick={() => setShowFailed(!showFailed)}
                            aria-expanded={showFailed}
                        >
                            <div className="section-title">
                                <Clock size={20} className="priority-alta" />
                                <span>Tareas Incompletas ({failTask.length})</span>
                            </div>
                            {showFailed ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>

                        {showFailed && (
                            <div className="section-content">
                                {failTask.length === 0 ? (
                                    <p className="empty-message">No hay tareas incompletas</p>
                                ) : (
                                    <ul className="task-list">
                                        {failTask.map((subtask, idx) => (
                                            <li key={idx} className="task-item failed">
                                                <div className="task-info">
                                                    <span className="task-title">{subtask.title}</span>
                                                    <span className="task-priority-inline priority-alta">No finalizada</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
 