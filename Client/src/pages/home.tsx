import { Navigate, Route, Routes } from "react-router-dom"
import type { AuthenticatedProps } from "../App"
import { Suspense, lazy } from "react"
import { SuspenseLoader } from "../components/layout/loaderSuspense";

const DeleteAccountPage = lazy(() => import('./auth/deleteAccountPage'))
const NotePage = lazy(() => import("./components/notePage"))
const ChangeImageUser = lazy(() => import("../components/auth/user/userProfile"))
const RegisterPage = lazy(() => import('./auth/registerPage'))
const LoginPage = lazy(() => import('./auth/loginPage'))
const Dashboard = lazy(() => import('./components/dashboard'))
const CalendarPage = lazy(() => import('./components/calendarPage'))
const TaskPage = lazy(() => import('./components/taskPage'))
const GoalPage = lazy(() => import('./components/goalPage'))
const ResumeChart = lazy(()=> import('./components/resumePage'))
const ChangeUserName = lazy(() => import('../components/auth/user/changeuserName'))
const ResetPasswordPage = lazy(() => import('../components/auth/user/resetPassword'))
const ConfigPage = lazy(() => import('./auth/configPage'))
const SuggestionsComponent = lazy(() => import('./components/suggestionPage'))




 const Home = ({isAuthenticated,setIsAuthenticated}:AuthenticatedProps) => {

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }



  return (
    <Suspense fallback={<SuspenseLoader fullScreen={false} />}>
        <Routes>
            <Route path='/' element={isAuthenticated ? <Navigate to="/dashboard" replace/> : <LoginPage setIsAuthenticated={setIsAuthenticated} isAuthenticated={null} />} />
            <Route path="/register" element={isAuthenticated ? <RegisterPage  setIsAuthenticated={setIsAuthenticated} isAuthenticated={null} /> : <Navigate to='/' replace />}/>
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard/> : <Navigate to='/' replace />}/>
            <Route path="/calendar" element={isAuthenticated ? <CalendarPage/> : <Navigate to='/' replace/>}/>
            <Route path="/task" element={isAuthenticated ? <TaskPage/> : <Navigate to="/" replace/>} />
            <Route path="/note" element={isAuthenticated ? <NotePage/> : <Navigate to="/" replace/>}/>
            <Route path="/goals" element={isAuthenticated ? <GoalPage/> : <Navigate to="/" replace/>}/>
            <Route path="/resume" element={isAuthenticated ? <ResumeChart/> : <Navigate to="/" replace/>}/>
            <Route path="/settings" element={isAuthenticated ? <ConfigPage setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated} /> : <Navigate to="/" replace/>}/>
            <Route path="/change-image" element={isAuthenticated ? <ChangeImageUser /> : <Navigate to="/" replace/>}/>
            <Route path="/change-name" element={isAuthenticated ? <ChangeUserName setIsAuthenticated={setIsAuthenticated}/> : <Navigate to="/" replace/>}/>
            <Route path="/change-password" element={isAuthenticated ? <ResetPasswordPage setIsAuthenticated={setIsAuthenticated}/> : <Navigate to="/" replace/>}/>
            <Route path="/delete-account"  element={isAuthenticated ? <DeleteAccountPage setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated} /> : <Navigate to="/" replace/>}/>
            <Route path="/send-email" element={isAuthenticated ? <SuggestionsComponent /> : <Navigate to="/" replace/>}/>
            <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace/>}/>
        </Routes>
    </Suspense>
    
  )
}

export default Home