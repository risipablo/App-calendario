import { NavLink } from "react-router-dom";
import { LogOutComponent } from "../../components/auth/logout";
import { DoorOpen, Settings, User, Lock } from "lucide-react";
import { motion } from "framer-motion";
import type { ChangeUserNameProps } from "../../interfaces/type.user";
import "../../style/userSettings.css";
import { Helmet } from "react-helmet";

export function ConfigPage({ setIsAuthenticated }: ChangeUserNameProps) {

  const itemVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.3 }
    })
  };

  return (
    <div className="task-table-container">
      <Helmet><title>Configuraciones</title></Helmet>
      <motion.div
        className="settings-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Settings size={28} className="settings-icon" />
        <h1>Configuración de Cuenta</h1>
        <p className="settings-subtitle">Gestiona tu perfil y seguridad</p>
      </motion.div>

      <div className="config-links">
        <motion.div
          custom={0}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <NavLink to="/change-name" className="config-link change-name-link">
            <div className="link-icon user-icon">
              <span> <User /> </span>
            </div>
            <div className="link-content">
              <h3>Cambiar Nombre de Usuario</h3>
              <p>Actualiza tu nombre de perfil</p>
            </div>
            <span className="link-arrow">→</span>
          </NavLink>
        </motion.div>

        <motion.div
          custom={1}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <NavLink to="/change-password" className="config-link change-password-link">
            <div className="link-icon lock-icon">
              <span> <Lock /> </span>
            </div>
            <div className="link-content">
              <h3>Cambiar Contraseña</h3>
              <p>Actualiza tu contraseña de acceso</p>
            </div>
            <span className="link-arrow">→</span>
          </NavLink>
        </motion.div>

        <motion.div
          custom={2}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="config-link logout-link">
            <div className="link-icon logout-icon">
              <span><DoorOpen /></span>
            </div>
            <div className="link-content">
              <LogOutComponent setIsAuthenticated={setIsAuthenticated} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}