 import { BrowserRouter } from 'react-router-dom'
import { Navbar } from './components/layout/navbar'
import { Home } from './pages/home'
import { TaskProvider } from './context/taskContex'
import { CalendarProvider } from './context/calendarContext'
// import { CalendarPage } from './pages/calendarPage'


function App() {
  return(
    <CalendarProvider>
    <TaskProvider>
        <BrowserRouter>
      <Navbar/>
      <Home/>
    </BrowserRouter>
    </TaskProvider>
    </CalendarProvider>
  )
}

export default App
