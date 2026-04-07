import { useNavigate } from "react-router-dom"
import { UseAuth } from "../../../hooks/useAuth"
import type { ChangeUserNameProps } from "../../../interfaces/type.user"
import { LogOut } from "lucide-react"
import { motion } from "framer-motion"
import "../../../style/userSettings.css"

export const LogOutComponent = ({ setIsAuthenticated }: ChangeUserNameProps) => {
  const navigate = useNavigate()
  const { logout } = UseAuth()

  const handleLogout = async () => {
    try {
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

  return (
    <motion.button
      onClick={handleLogout}
      className="logout-btn"
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <LogOut size={18} />
      <span>Cerrar Sesión</span>
    </motion.button>
  )
}