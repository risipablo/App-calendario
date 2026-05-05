import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Navbar } from './components/layout/navbar'
import { TaskProvider } from './context/taskContex'
import { CalendarProvider } from './context/calendarContext'
import { UserProvider } from './context/userProvider'
import { useState, useEffect, lazy, Suspense } from 'react'
import axios from 'axios'
import { config } from './config/index'
import "../src/style/authStyle.css"
import { SuspenseLoader } from './components/layout/loaderSuspense'
import CallbackPage from './pages/auth/callbackPage';


const serverFront = config.Api


const Home = lazy(() => import('./pages/home'))
const LoginPage = lazy(() => import('./pages/auth/loginPage'))
const RegisterPage = lazy(() => import('./pages/auth/registerPage'))
const ForgotPasswordPage = lazy(() => import('./pages/auth/forgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('./components/auth/user/resetPassword'))

export interface AuthenticatedProps{
  isAuthenticated?: boolean | null  
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>  
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const isCallbackPath = window.location.pathname === '/auth/callback';

  useEffect(() => {
    const token = localStorage.getItem('token')
    
    if (window.location.pathname === '/auth/callback') {
      console.log('⏳ En callback, esperando...');
      setLoading(false)
      return;
  }

    if(!token){
      setIsAuthenticated(false)
      setLoading(false)
      return
    }
    
    const validateToken = async () => {
      try{
        await axios.get(`${serverFront}/api/auth/validate-token`,{
          headers:{
            Authorization:`Bearer ${token}`
          },
          withCredentials: true
        })
        setIsAuthenticated(true)
        
      } catch(error){
        console.error(error)
        localStorage.removeItem('token')
        setIsAuthenticated(false)
        
         
      } finally{
        setLoading(false)
      }
    }
    validateToken()
  },[isCallbackPath])

  if ((isAuthenticated === null || loading) && !isCallbackPath) {
    return <SuspenseLoader fullScreen={true} />
  }
  
  return(
    <BrowserRouter>
      <UserProvider isAuthenticated={isAuthenticated}>
        {isAuthenticated ? (
          <CalendarProvider isAuthenticated={isAuthenticated}>
            <TaskProvider isAuthenticated={isAuthenticated}>
              <Navbar />
              <Suspense fallback={<SuspenseLoader fullScreen={false} />}>
                <Home isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>
              </Suspense>
            </TaskProvider>
          </CalendarProvider>
          
        ) : (
          <Suspense fallback={<SuspenseLoader fullScreen={true} />}>
            <Routes>
              <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} isAuthenticated={null} />} />
              <Route path="/register" element={<RegisterPage setIsAuthenticated={setIsAuthenticated} isAuthenticated={null}/>} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/auth/callback" element={<CallbackPage setIsAuthenticated={setIsAuthenticated} />}/>
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        )}
      </UserProvider>
    </BrowserRouter>
  )
}

export default App