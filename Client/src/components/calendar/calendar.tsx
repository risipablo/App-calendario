import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { useState } from "react"
import "../../style/calender.css"


export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
  const weekDays = ["Dom", "Lun" , "Mar", "Mié", "Jue", "Vie", "Sáb"]

  const getMonthDays = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDay = firstDay.getDay()

    const days: {day:number; isCurrentMonth: boolean; date:Date }[] = []

    // day before of month
    for (let i = startDay - 1; i >= 0; i--){
      const prevDate = new Date(year, month, -i)
      days.push({day:prevDate.getDate(), isCurrentMonth:false, date:prevDate})
    }

    // actual day of month
    for (let i=1; i <= lastDay.getDate(); i++){
      days.push({day: i, isCurrentMonth:true, date:new Date(year, month, i)})
    }

    // day after of month
    const cells = 42
    for (let i = 1; days.length < cells; i++){
      const nextDate = new Date(year, month + 1, i)
      days.push({day: i, isCurrentMonth: false, date:nextDate})

    }

    return days
  }

  const isToday = (date:Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date:Date) => {
    return selectedDate?.toDateString() === date.toDateString()
  }

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1 , 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1 ,1))
  }

  const handleDayClick = (dayData: { day: number; isCurrentMonth: boolean; date: Date }) => {
    setSelectedDate(dayData.date);
    if (!dayData.isCurrentMonth) {
      setCurrentDate(new Date(dayData.date.getFullYear(), dayData.date.getMonth(), 1));
    }
  };

  const days = getMonthDays(currentDate)


  return(
    <div className="calendar-container">
    <div className="calendar-header">
      <h1>Calendario</h1>
      <button className="btn-new-event">
        <Plus size={18} />
        New Event
      </button>
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
                {/* Indicadores de eventos aquí */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
  )
}