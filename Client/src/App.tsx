 import { BrowserRouter } from 'react-router-dom'
import { Navbar } from './components/layout/navbar'
import { Home } from './pages/home'
import { TaskProvider } from './context/taskContex'
import { CalendarProvider } from './context/calendarContext'
import { UserProvider } from './context/userProvider'
// import { Loader } from './components/layout/loader'
import { useState, type Dispatch, type SetStateAction, useEffect } from 'react'
import axios from 'axios'
import { config } from './config/index'

const serverFront = config.Api


export interface LoaderProps {
  setLoading: Dispatch<SetStateAction<boolean>>;
  onComplete?: () => void;
}

export interface AuthenticatedProps{
  isAuthenticated: boolean | null  // Cambia aquí
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>  // Y aquí
}


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [loading,setLoading] = useState<boolean>(true)

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token')
      console.log('Token:', token)

      if(!token){
        setIsAuthenticated(false)
        setLoading(false)
        return
      }

      try{
        await axios.get(`${serverFront}/api/auth/validate-token`,{
          headers:{
            Authorization:`Bearer ${token}`
          },
          withCredentials: true
        })
        setIsAuthenticated(true)
        setLoading(false)
      } catch(error){
        localStorage.removeItem('token')
        setIsAuthenticated(false)
        console.error(error)
      }
    }
    validateToken()
  },[])

  if(isAuthenticated === null || loading){
    return <p>Cargando...</p>
  }

  // if(isAuthenticated === null || loading){
  //   return(
  //     <Loader
  //       setLoading={setLoading}
  //       onComplete={() => {}}
  //     />
  //     // <p> Cargando </p>
  //   )
  // }
  
  return(
    <BrowserRouter>
    <UserProvider>
      <CalendarProvider isAuthenticated={isAuthenticated}>
        {isAuthenticated ? (
          <TaskProvider isAuthenticated={isAuthenticated}>
            <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
            <Home isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>
          </TaskProvider>
        ) : (
          
          <Home isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>
          
        )}
      </CalendarProvider>
    </UserProvider>
  </BrowserRouter>
  )
}

export default App
