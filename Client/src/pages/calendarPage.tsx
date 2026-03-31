import { Helmet } from "react-helmet"
import { CalendarMaster } from "../components/calendar/calendarMaster"



 const CalendarPage = () => {

    return(
        <div>
        <Helmet>
            <title> Calendario </title>
            
        </Helmet>
        
        <CalendarMaster/>
        </div>
        
    )
}

export default CalendarPage