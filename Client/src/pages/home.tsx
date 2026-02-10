import { Route, Routes } from "react-router-dom"
import { TaskPage } from "./taskPage"
import { GoalPage } from "./goalPage"
import { CalendarPage } from "./calendarPage"
import { Dashboard } from "./dashboard"



export const Home = () => {
  return (
    <>
    <Routes>
        <Route path="/" element={<Dashboard/>}/>
        <Route path="/calendar" element={<CalendarPage/>}/>
        <Route path="/task" element={<TaskPage/>} />
        <Route path="/goals" element={<GoalPage/>}/>
    </Routes>
    </>
    
  )
}
