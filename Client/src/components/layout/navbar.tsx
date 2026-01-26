

import { Task } from "@mui/icons-material"
import { Calendar, Goal, House} from "lucide-react"
import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import "../../style/navbar.css"

export function Navbar(){

    const [isopen, setIsOpen] = useState(false)

    const toggleMenu = () => {
        setIsOpen(!isopen)
        if (!isopen) {
            document.body.classList.add('sidebar-open-mobile')
        } else {
            document.body.classList.remove('sidebar-open-mobile')
        }
    }

    const closeToggle = () => {
        setIsOpen(false) 
        document.body.classList.remove('sidebar-open-mobile')
    }

    // Cerrar sidebar al cambiar tamaño de pantalla a desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 850) {
                setIsOpen(false)
                document.body.classList.remove('sidebar-open-mobile')
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return(
        <>
            
            {isopen && <div className="navbar-overlay" onClick={closeToggle}></div>}

            <nav>
                <div className="container-navbar">
                    <div className="navbar">
                        
                        
                        <div onClick={toggleMenu} className={`menu-icon ${isopen ? 'open' : ''}`}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>

                        
                        <div className={`menu ${isopen ? 'open' : ''}`}>
                            
                        
                            <div className="menu-header">
                                <div>
                                    <h1>MyCalendar</h1>
                                    <p>Organiza tu vida</p>
                                </div>
                                <button className="close-btn-mobile" onClick={closeToggle}>
                                    {/* <X size={24} /> */}
                                </button>
                            </div>

                            
                            <div className="menu-links">
                                <NavLink to="/" onClick={closeToggle} className={({ isActive }) => isActive ? 'active' : ''}>
                                    <House size={20} /> 
                                    <span>Inicio</span>
                                </NavLink>
                            
                                <NavLink to="/calendar" onClick={closeToggle} className={({ isActive }) => isActive ? 'active' : ''}>
                                    <Calendar size={20} /> 
                                    <span>Calendario</span>
                                </NavLink>
                                
                                <NavLink to="/task" onClick={closeToggle} className={({ isActive }) => isActive ? 'active' : ''}>
                                    <Task /> 
                                    <span>Tareas</span>
                                </NavLink>
                                
                                <NavLink to="/goals" onClick={closeToggle} className={({ isActive }) => isActive ? 'active' : ''}>
                                    <Goal size={20} /> 
                                    <span>Metas</span>
                                </NavLink>
                            </div>

                            
                            <div className="menu-footer">
                                <div className="user-info">
                                    <div className="user-avatar">U</div>
                                    <div className="user-details">
                                        <p className="user-name">Usuario</p>
                                        <p className="user-email">user@example.com</p>
                                    </div>
                                </div>
                                <NavLink to="/logout" onClick={closeToggle} className="logout-btn">
                                    Cerrar Sesión
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}