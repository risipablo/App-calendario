import { useState } from "react";
import {Plus, ChevronLeft, ChevronRight, X} from 'lucide-react';
import "../../style/calender.css"

interface Event {
    id: number;
    title: string;
    date: string;
    time: string;
    type: 'medical' | 'work' | 'personal' | 'other';
    description?: string;
  }
  
  const Calendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 1)); // Diciembre 2025
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [events] = useState<Event[]>([
      { id: 1, title: 'Cita Médico', date: '2025-12-26', time: '10:00', type: 'medical', description:"Consulta medica" },
      { id: 3, title: 'Cita Médico', date: '2025-12-26', time: '12:00', type: 'medical' },
      { id: 2, title: 'Reunión trabajo', date: '2025-12-27', time: '14:00', type: 'work' },
    ]);
  
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
  
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  
    const getDaysInMonth = (date: Date): Date[] => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();
  
      const days: Date[] = [];
  
      // Días del mes anterior
      const prevMonthLastDay = new Date(year, month, 0).getDate();
      for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        days.push(new Date(year, month - 1, prevMonthLastDay - i));
      }
  
      // Días del mes actual
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i));
      }
  
      // Días del mes siguiente
      const remainingDays = 42 - days.length; // 6 semanas * 7 días
      for (let i = 1; i <= remainingDays; i++) {
        days.push(new Date(year, month + 1, i));
      }
  
      return days;
    };
  
    const isToday = (date: Date): boolean => {
      const today = new Date();
      return date.getDate() === today.getDate() &&
             date.getMonth() === today.getMonth() &&
             date.getFullYear() === today.getFullYear();
    };
  
    const isSameMonth = (date: Date): boolean => {
      return date.getMonth() === currentDate.getMonth();
    };
  
    const formatDateString = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
  
    const getEventsForDate = (date: Date): Event[] => {
      const dateString = formatDateString(date);
      return events.filter(event => event.date === dateString);
    };
  
    const previousMonth = () => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };
  
    const nextMonth = () => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };
  
    const handleDayClick = (date: Date) => {
      setSelectedDate(date);
    };
  
    const days = getDaysInMonth(currentDate);
  
    return (
      <div className="calendar-container">
        <div className="calendar-header">

          <button className="btn-new-event" onClick={() => setShowModal(true)}>
            <Plus size={20} />
            Nuevo Evento
          </button>
        </div>
  
        <div className="calendar-card">
          <div className="calendar-month-header">
            <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
            <div className="calendar-navigation">
              <button className="btn-nav" onClick={previousMonth}>
                <ChevronLeft size={16} />
              </button>
              <button className="btn-nav" onClick={nextMonth}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
  
          <div className="calendar-grid">
            {dayNames.map(day => (
              <div key={day} className="calendar-day-name">
                {day}
              </div>
            ))}
  
            {days.map((day, index) => {
              const dayEvents = getEventsForDate(day);
              const isCurrentMonth = isSameMonth(day);
              const isTodayDate = isToday(day);
              const isSelected = selectedDate && 
                                 day.getDate() === selectedDate.getDate() &&
                                 day.getMonth() === selectedDate.getMonth() &&
                                 day.getFullYear() === selectedDate.getFullYear();
  
              return (
                <div
                  key={index}
                  className={`calendar-day 
                    ${!isCurrentMonth ? 'other-month' : ''} 
                    ${isTodayDate ? 'today' : ''}
                    ${isSelected ? 'selected' : ''}
                  `}
                  onClick={() => handleDayClick(day)}
                >
                  <div className="day-number">{day.getDate()}</div>
                  {dayEvents.length > 0 && (
                    <div className="event-indicators">
                      {dayEvents.slice(0, 3).map(event => (
                        <div key={event.id} className={`event-dot ${event.type}`} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Eventos del dia */}
        <div className="calendar-card">
        {selectedDate && (
  <div className="calendar-card day-events-card">
    <h3 className="day-events-title">
      Eventos del {selectedDate.getDate()} de {monthNames[selectedDate.getMonth()]}
    </h3>
    <div className="day-events-list">
      {getEventsForDate(selectedDate).length > 0 ? (
        getEventsForDate(selectedDate).map((event) => (
          <div key={event.id} className="day-event-item">
            <div className={`event-type-indicator ${event.type}`}></div>
            <div className="event-content">
              <p className="event-title">{event.title}</p>
              <p className="event-time">{event.time}</p>
              {event.description && (
                <p className="event-description">{event.description}</p>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="no-events-message">No hay eventos para este día</p>
      )}
    </div>
  </div>
)}
        </div>
  
        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Nuevo Evento</h3>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  <X size={24} />
                </button>
              </div>
  
              <form onSubmit={(e) => {
                e.preventDefault();
                setShowModal(false);
              }}>
                <div className="form-group">
                  <label className="form-label">Título</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Nombre del evento"
                    required
                  />
                </div>
  
                <div className="form-group">
                  <label className="form-label">Fecha</label>
                  <input 
                    type="date" 
                    className="form-input"
                    required
                  />
                </div>
  
                <div className="form-group">
                  <label className="form-label">Hora</label>
                  <input 
                    type="time" 
                    className="form-input"
                    required
                  />
                </div>
  
                <div className="form-group">
                  <label className="form-label">Tipo</label>
                  <select className="form-select">
                    <option value="medical">Médico</option>
                    <option value="work">Trabajo</option>
                    <option value="personal">Personal</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
  
                <div className="form-group">
                  <label className="form-label">Descripción (opcional)</label>
                  <textarea 
                    className="form-textarea"
                    placeholder="Añade detalles sobre el evento..."
                  />
                </div>
  
                <button type="submit" className="btn-submit">
                  Guardar Evento
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default Calendar;