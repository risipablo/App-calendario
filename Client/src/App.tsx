 import { BrowserRouter } from 'react-router-dom'
import { Navbar } from './components/layout/navbar'
import { Home } from './pages/home'
import { TaskProvider } from './context/taskContex'
// import { CalendarPage } from './pages/calendarPage'


function App() {
  return(
    <TaskProvider>
        <BrowserRouter>
      <Navbar/>
      <Home/>
    </BrowserRouter>
    </TaskProvider>
  )
}

export default App
