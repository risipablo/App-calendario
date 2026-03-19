 import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Navbar } from './components/layout/navbar'
import { Home } from './pages/home'
import { TaskProvider } from './context/taskContex'
import { CalendarProvider } from './context/calendarContext'
import { UserProvider } from './context/userProvider'
import { Loader } from './components/layout/loader'
import { useState, type Dispatch, type SetStateAction, useEffect } from 'react'
import axios from 'axios'
import { config } from './config/index'
import "../src/style/authStyle.css"
import LoginPage from './pages/auth/loginPage'
import { RegisterPage } from './pages/auth/registerPage'
import { ResetPasswordPage } from './components/auth/resetPassword'
import { ForgotPasswordPage } from './pages/auth/forgotPasswordPage'


const serverFront = config.Api


export interface LoaderProps {
  setLoading: Dispatch<SetStateAction<boolean>>;
  onComplete?: () => void;
}

export interface AuthenticatedProps{
  isAuthenticated: boolean | null  
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>  
}


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [loading,setLoading] = useState<boolean>(true)

  useEffect(() => {

    const token = localStorage.getItem('token')

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
        
        localStorage.removeItem('token')
        setIsAuthenticated(false)
        console.error(error)
         
      } finally{
        setLoading(false)
      }
    }
    validateToken()
  },[])



  if(isAuthenticated === null || loading){
    return(
      <Loader
        setLoading={setLoading}
        onComplete={() => {}}
      />
      
    )
  }
  
  return(
    <BrowserRouter>
    
    <UserProvider isAuthenticated={isAuthenticated}>
        {isAuthenticated ? (
          
          <CalendarProvider isAuthenticated={isAuthenticated}>
          <TaskProvider isAuthenticated={isAuthenticated}>
            
            <Navbar  />
            <Home isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>
          </TaskProvider>
          </CalendarProvider>
          
          
        ) : (
         <Routes>
            <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} isAuthenticated={null} />} />
            <Route path="/register" element={<RegisterPage  setIsAuthenticated={setIsAuthenticated} isAuthenticated={null}/>} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
         </Routes>
          

          
        )}
    </UserProvider>
  </BrowserRouter>
  )
}

export default App
