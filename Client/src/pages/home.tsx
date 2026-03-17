import { Navigate, Route, Routes } from "react-router-dom"
import { TaskPage } from "./taskPage"
import { GoalPage } from "./goalPage"
import { CalendarPage } from "./calendarPage"
import { Dashboard } from "./dashboard"
import { RegisterPage } from "./auth/registerPage"
import LoginPage from "./auth/loginPage"
import type { AuthenticatedProps } from "../App"
import { ChangeUserName } from "../components/auth/changeuserName"
import { ResetPasswordPage } from "../components/auth/resetPassword"
import { ConfigPage } from "./auth/configPage"
import { ResumeChart } from "./resumePage"




export const Home = ({isAuthenticated,setIsAuthenticated}:AuthenticatedProps) => {

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }



  return (
    <>
    <Routes>
        <Route path='/' element={isAuthenticated ? <Navigate to="/dashboard" replace/> : <LoginPage setIsAuthenticated={setIsAuthenticated} isAuthenticated={null} />} />
        <Route path="/register" element={isAuthenticated ? <RegisterPage  setIsAuthenticated={setIsAuthenticated} isAuthenticated={null} /> : <Navigate to='/' replace />}/>
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard/> : <Navigate to='/' replace />}/>
        <Route path="/calendar" element={isAuthenticated ? <CalendarPage/> : <Navigate to='/' replace/>}/>
        <Route path="/task" element={isAuthenticated ? <TaskPage/> : <Navigate to="/" replace/>} />
        <Route path="/goals" element={isAuthenticated ? <GoalPage/> : <Navigate to="/" replace/>}/>
        <Route path="/resume" element={isAuthenticated ? <ResumeChart/> : <Navigate to="/" replace/>}/>
        <Route path="/change-name" element={isAuthenticated ? <ChangeUserName setIsAuthenticated={setIsAuthenticated}/> : <Navigate to="/" replace/>}/>
        <Route path="/change-password" element={isAuthenticated ? <ResetPasswordPage setIsAuthenticated={setIsAuthenticated}/> : <Navigate to="/" replace/>}/>
        <Route path="/settings" element={isAuthenticated ? <ConfigPage setIsAuthenticated={setIsAuthenticated}/> : <Navigate to="/" replace/>}/>
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace/>}/>
    </Routes>
    </>
    
  )
}
