import { useNavigate } from "react-router-dom"
import type { AuthenticatedProps } from "../../App"
import { UseAuth } from "../../hooks/useAuth"



export const LogOutComponent = ({setIsAuthenticated}:AuthenticatedProps) => {
    const navigate = useNavigate()
    const{logout} = UseAuth()

    const handleLogout = async() => {
        try{
            setIsAuthenticated(false)
            await logout()
            navigate('/login')
        } catch (error) {
            console.error('Error en logout:', error)
            setIsAuthenticated(false)
            localStorage.removeItem('token')
            navigate('/login')
        }
    }

    return(
        <button onClick={handleLogout} className="logout-btn">
                                    Cerrar Sesión
        </button>
    )


}