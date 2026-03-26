import { Helmet } from "react-helmet"
import { CalendarMaster } from "../components/calendar/calendarMaster"



export const CalendarPage = () => {

    return(
        <div className="container-pages">
        <Helmet>
            <title> Calendario </title>
            
        </Helmet>
        
        <CalendarMaster/>
        </div>
        
    )
}