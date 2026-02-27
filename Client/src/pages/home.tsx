import { Route, Routes } from "react-router-dom"
import { TaskPage } from "./taskPage"
import { GoalPage } from "./goalPage"
import { CalendarPage } from "./calendarPage"
import { Dashboard } from "./dashboard"
import { RegisterPage } from "./auth/registerPage"
import LoginPage from "./auth/loginPage"



export const Home = () => {
  return (
    <>
    <Routes>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/calendar" element={<CalendarPage/>}/>
        <Route path="/task" element={<TaskPage/>} />
        <Route path="/goals" element={<GoalPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
    </Routes>
    </>
    
  )
}
