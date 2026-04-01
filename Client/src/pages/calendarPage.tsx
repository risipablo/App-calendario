import { Helmet } from "react-helmet"
import { CalendarMaster } from "../components/calendar/calendarMaster"

import "../style/task.css"

 const CalendarPage = () => {

    return(
        <div>
        <Helmet> <title> Calendario </title> </Helmet>
        
        <CalendarMaster/>
        </div>
        
    )
}

export default CalendarPage