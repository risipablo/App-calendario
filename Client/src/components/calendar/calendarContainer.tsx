import { ChevronLeft, ChevronRight, Trash2, Pencil, Save, X, Clock } from "lucide-react"
import { useState, useMemo } from "react"
import { Tooltip } from '@mui/material';
import "../../style/calender.css"
import "../../style/task.css"
import type { CalendarContainerProps, ICalendar } from "../../interfaces/type.calendar"
import { ModalConfirm } from "../layout/modalConfirm";
import  { Toaster } from "react-hot-toast";

export const CalendarContainer = ({
  notes,
  editNote,
  deleteNote
}: CalendarContainerProps) => {

  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showDayModal, setShowDayModal] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<string>('')

  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
  const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  
  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      if (!note.date) return false

      const taskDate = note.date.split('T')[0]
      const parts = taskDate.split('-')
      if (parts.length < 2) return false

      const [noteYear, noteMonth] = parts

      
      if (selectedYear && noteYear !== selectedYear) return false

      
      if (selectedMonth && noteMonth !== selectedMonth) return false

      return true
    })
  }, [notes, selectedMonth, selectedYear]) 

  const getMonthDays = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDay = firstDay.getDay()

    const days: { day: number; isCurrentMonth: boolean; date: Date }[] = []

    for (let i = startDay - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push({ day: prevDate.getDate(), isCurrentMonth: false, date: prevDate })
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ day: i, isCurrentMonth: true, date: new Date(year, month, i) })
    }

    const cells = 42
    for (let i = 1; days.length < cells; i++) {
      const nextDate = new Date(year, month + 1, i)
      days.push({ day: i, isCurrentMonth: false, date: nextDate })
    }

    return days
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    return selectedDate?.toDateString() === date.toDateString()
  }

  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
      setSelectedMonth(String(newDate.getMonth() + 1).padStart(2, '0'))
      setSelectedYear(String(newDate.getFullYear()))
      return newDate
    })
  }

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
      setSelectedMonth(String(newDate.getMonth() + 1).padStart(2, '0'))
      setSelectedYear(String(newDate.getFullYear()))
      return newDate
    })
  }

  const handleMonthFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = e.target.value
    setSelectedMonth(month)
    if (month) {
      const year = selectedYear ? parseInt(selectedYear) : currentDate.getFullYear()
      setCurrentDate(new Date(year, parseInt(month) - 1, 1))
    }
  }

  
  const handleYearFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = e.target.value
    setSelectedYear(year)
    if (year) {
      const month = selectedMonth ? parseInt(selectedMonth) - 1 : currentDate.getMonth()
      setCurrentDate(new Date(parseInt(year), month, 1))
    }
  }

  const handleDayClick = (dayData: { day: number; isCurrentMonth: boolean; date: Date }) => {
    setSelectedDate(dayData.date);
    if (!dayData.isCurrentMonth) {
      setCurrentDate(new Date(dayData.date.getFullYear(), dayData.date.getMonth(), 1));
    }
    setShowDayModal(true);
  };

  const days = getMonthDays(currentDate)

  const formatDateForCompare = (date: Date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, "0")
    const d = String(date.getDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
  }

  const getNotesForDay = (dayDate: Date) => {
    const dateStr = formatDateForCompare(dayDate)
    return filteredNotes.filter((note) => note.date && note.date.split("T")[0] === dateStr)
  }

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    title: '',
    priority: '',
    category: '',
    date: '',
    hour: ''
  });

  const handleEditNotes = (note: ICalendar) => {
    setShowDayModal(false)
    setEditingId(note._id)
    setEditData({
      title: note.title,
      priority: note.priority,
      category: note.category,
      date: note.date,
      hour: note.hour,
    })
  }

  const handleSaveNotes = (id: string) => {
    editNote?.(id, {
      title: editData.title,
      priority: editData.priority,
      category: editData.category,
      date: editData.date,
      hour: editData.hour
    })
    setEditingId(null);
  }

  const handleCancelEdit = () => {
    setEditData({
      title: '',
      priority: '',
      category: '',
      date: '',
      hour: ''
    });
    setEditingId(null);
  };

  
  const handleClearFilter = () => {
    const today = new Date()
    setSelectedMonth('')
    setSelectedYear('')
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1))
  }

  const hasActiveFilter = selectedMonth || selectedYear

  const [showModal, setShowModal] = useState(false);
  const [deleteAction, setDeleteAction] = useState<(() => void) | null>(null);
  const [modalConfig, setModalConfig] = useState({
      title: "",
      message: "",
      confirmText: ""
  });

  const openDeleteModal = (
    action: () => void,
    title: string,
    message: string,
    confirmText: string
  ) => {
    setDeleteAction(() => action)
    setModalConfig({title, message, confirmText})
    setShowModal(true)
  }

  const confirmModal = () => {
    if (deleteAction) {
        deleteAction();
        setShowModal(false);
        setDeleteAction(null);
    }
};


  return (
    <div className="calendar-container">
      <div className="filter-buttons-group" 
     >
        <select
          value={selectedMonth}
          onChange={handleMonthFilterChange}
          className="month-select"
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
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

        <select
          value={selectedYear}
          onChange={handleYearFilterChange}
          className="month-select"
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          <option value="">Año</option>
          <option value="2026">2026</option>
          <option value="2027">2027</option>
          <option value="2028">2028</option>
          <option value="2029">2029</option>
          <option value="2030">2030</option>
          <option value="2031">2031</option>
          <option value="2032">2032</option>
        </select>

        
        {hasActiveFilter && (
          <button
            className="clear-filter-btn"
            onClick={handleClearFilter}
            style={{ padding: '8px 12px', cursor: 'pointer'  }}
          >
            Limpiar filtro
          </button>
        )}
      </div>

      <div className="calendar-card">
        <div className="calendar-month-header">
          <h2>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
          <div className="calendar-navigation">
            <button className="btn-nav" onClick={handlePrevMonth}>
              <ChevronLeft size={20} />
            </button>
            <button className="btn-nav" onClick={handleNextMonth}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="calendar-grid">
          {weekDays.map(day => (
            <div key={day} className="calendar-day-name">{day}</div>
          ))}

          {days.map((dayData, index) => {
            const today = isToday(dayData.date);
            const selected = isSelected(dayData.date);
            const dayNotes = getNotesForDay(dayData.date);

            return (
              <div
                key={index}
                className={`calendar-day 
                  ${today ? "today" : ""} 
                  ${!dayData.isCurrentMonth ? "other-month" : ""} 
                  ${selected ? "selected" : ""}`}
                onClick={() => handleDayClick(dayData)}
              >
                <div className="day-number">{dayData.day}</div>
                <div className="event-indicators">
                  {dayNotes.slice(0, 3).map((note) => (
                    <div
                      key={note._id}
                      className="event-row"
                      title={`${note.title} (${note.category}) (${note.hour})`}
                    >
                      <div className={`event-dot priority-${note.priority}`} />
                      <span className={`calendar-note calendar-note-${note.priority}`}>
                        {note.title}
                      </span>
                    </div>
                  ))}
                  {dayNotes.length > 3 && (
                    <div className="event-more">+{dayNotes.length - 3}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de día */}
      {showDayModal && selectedDate && (
        <div className="modal-overlay-calendar" onClick={() => setShowDayModal(false)}>
          <div className="modal-content-calendar" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-calendar">
              <h3>{formatDateDisplay(selectedDate)}</h3>
              <button className="modal-close-btn" onClick={() => setShowDayModal(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body-calendar">
              {getNotesForDay(selectedDate).length === 0 ? (
                <div className="empty-day-notes">
                  <p>No hay eventos para este día</p>
                </div>
              ) : (
                <div className="day-notes-list">
                  {getNotesForDay(selectedDate)
                    .sort((a, b) => a.hour.localeCompare(b.hour))
                    .map((note) => (
                      <div key={note._id} className="day-note-item">
                        <div className="note-time">
                          <Clock size={16} />
                          <span>{note.hour}</span>
                        </div>

                        <div className="note-content">
                          <h4>{note.title}</h4>
                          <div className="note-tags">
                            <span className={`priority-badge priority-${note.priority}`}>
                              {note.priority}
                            </span>
                            <span className="category-badge">
                              {note.category}
                            </span>
                          </div>
                        </div>

                        <div className="note-actions">
                          <Tooltip title="Editar" arrow>
                            <button
                              className="action-btn-note edit-btn"
                              onClick={() => handleEditNotes(note)}
                            >
                              <Pencil size={16} />
                            </button>
                          </Tooltip>
                          <Tooltip title="Eliminar" arrow>
                            <button
                              className="action-btn-inline delete-btn" 
                              onClick={() => openDeleteModal(
                                () => deleteNote(note._id),
                                "Confirmar borrado",
                                "¿Estás seguro que deseas eliminar esta meta?",
                                "Eliminar"
                              )}
                            >
                              <Trash2 size={16} />
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de edición */}
      {editingId !== null && (
        <div className="modal-overlay-inline" onClick={handleCancelEdit}>
          <div className="modal-content-inline" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-inline">
              <h3>Editar Evento</h3>
              <button className="modal-close-btn" onClick={handleCancelEdit}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body-inline">
              <div className="form-group-inline">
                <label>Fecha</label>
                <input
                  type="date"
                  className="modal-input"
                  value={editData.date.split('T')[0]}
                  onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                />
              </div>

              <div className="form-group-inline">
                <label>Hora</label>
                <input
                  type="time"
                  className="modal-input"
                  value={editData.hour}
                  onChange={(e) => setEditData({ ...editData, hour: e.target.value })}
                />
              </div>

              <div className="form-group-inline">
                <label>Título</label>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="Título del evento"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  autoFocus
                />
              </div>

              <div className="form-group-inline">
                <label>Prioridad</label>
                <select
                  className="modal-select"
                  value={editData.priority}
                  onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                >
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </div>

              <div className="form-group-inline">
                <label>Categoría</label>
                <select
                  className="modal-select"
                  value={editData.category}
                  onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                >
                  <option value="">Selecciona una categoría</option>
                  <option value="salud">Salud</option>
                  <option value="finanzas">Finanzas</option>
                  <option value="deporte">Deporte</option>
                  <option value="trabajo">Trabajo</option>
                  <option value="estudio">Estudio</option>
                  <option value="personal">Personal</option>
                  <option value="ocio">Ocio</option>
                  <option value="familia">Familia</option>
                  <option value="otros">Otros</option>
                </select>
              </div>

              <div className="modal-actions-inline">
                <button
                  className="modal-btn modal-btn-primary"
                  onClick={() => handleSaveNotes(editingId)}
                >
                  <Save size={16} />
                  Guardar
                </button>
                <button
                  className="modal-btn modal-btn-secondary"
                  onClick={handleCancelEdit}
                >
                  <X size={16} />
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && ModalConfirm && (
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

        <Toaster/>
    </div>
  );
}