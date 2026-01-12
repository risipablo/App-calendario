 import { BrowserRouter } from 'react-router-dom'
import { Navbar } from './components/layout/navbar'
import { Home } from './pages/home'
// import { CalendarPage } from './pages/calendarPage'


function App() {
  return(
    <BrowserRouter>
      <Navbar/>
      <Home/>
    </BrowserRouter>
  )
}

export default App
