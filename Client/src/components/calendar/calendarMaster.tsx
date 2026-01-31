import { Calendar } from "lucide-react"
import { CalendarForm } from "./calendarForm"
import { useState } from "react"
import { CalendarContainer } from "./calendarContainer"
import { useCalendar } from "../../hooks/useCalendar"


export const CalendarMaster = () => {
    
        const{addNote,notes,deleteEvents,editEvents} = useCalendar()

        const [title,setTitle] = useState<string>("")
        const [category,setCategory] = useState<string>("")
        const [priority,setPriority] = useState<string>("")
        const [date,setDate] = useState<string>("")
        const [hour,setHour] = useState<string>("")

        


        const handleAddNote = () => {
            if(title.trim() && category && date && priority && hour){
                addNote(title,date,category,priority,hour)
                setCategory("")
                setDate("")
                setPriority("")
                setTitle("")
                setHour("")
            }
          }
    
    return(
        <div className="task-table-container">
            <div className="table-header">
                <h2 className="table-title">
                    <Calendar/> Mi Calendario
                </h2>

                <div className="header-actions">
                    <CalendarForm 
                        onAdd={handleAddNote} 
                        title={title}
                        hour={hour}
                        category={category}
                        priority={priority}
                        date={date}
                        setCategory={setCategory}
                        setDate={setDate}
                        setHour={setHour}
                        setPriority={setPriority}
                        setTitle={setTitle}
                    />
                </div>
            </div>

            <CalendarContainer 
                notes={notes}
                addNote={addNote}
                deleteNote={deleteEvents}
                editNote={editEvents}
                onAddNote={handleAddNote}
            />
        </div>
    )
}