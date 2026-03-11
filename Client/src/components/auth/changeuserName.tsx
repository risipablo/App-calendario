import { useState, type ChangeEvent, type FormEvent } from "react";

import type { ChangeUserNameProps, IChangeUserName } from "../../interfaces/type.user";
import { UseAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";




export function ChangeUserName({ setIsAuthenticated }: ChangeUserNameProps){
    const [formData, setFormData] = useState<IChangeUserName>({
        email:'',
        newName: ''
    })
    const [showSucces,setShowSucces] = useState(false)

    const {userChange, loading, error, success }= UseAuth()
    const navigate = useNavigate()

    const handleChangeName = (e: ChangeEvent<HTMLInputElement>): void => {
        const {name, value} = e.target
        setFormData(prev => ({...prev, [name]: value}))
    };
    

    const handleSubmitChangeName = async(e: FormEvent<HTMLElement>): Promise<void> => {
        e.preventDefault()
        try{

            await userChange(formData)
            setShowSucces(true)

            setTimeout(() => {
                setIsAuthenticated(true)
                navigate('/dashboard')
                
            },3000)
            
        } catch(err){
            console.error('Error cambiando nombre de usuario:', err)
        }
    }
    
    return(
        <div className="task-table-container">
        

        <div>
            <h3><strong>Ingrese su nuevo nombre de usuario</strong></h3>

            <form onSubmit={handleSubmitChangeName}>
                <input 
                          id="newName"
                          type="text"
                          name="newName"
                          placeholder="Nuevo nombre de usuario"
                          value={formData.newName}
                          onChange={handleChangeName}
                          required
                          disabled={loading || showSucces}
                          className="form-input"
                />
                <button type="submit" disabled={loading || showSucces}>
                    {loading ? "Procesando..." : "Confirmar"}
                </button>
            </form>
            
            <AnimatePresence>
                    {showSucces && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="success-container"
                        >
                            <div className="success-icon">✓</div>
                            <p className="message success">
                                {success || "¡Cambio de usuario exitoso!"}
                            </p>
                            <p className="redirect-message">
                                Serás redirigido al dashboard en 2 segundos...
                            </p>
                            <div className="progress-bar">
                                <motion.div 
                                    className="progress-fill"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 2, ease: "linear" }}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mensaje de error */}
                <AnimatePresence>
                    {error && !showSucces && (
                        <motion.p 
                            className="message error"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                        >
                            {error}
                        </motion.p>
                    )}
                </AnimatePresence>
                {loading && !showSucces && (
                    <motion.div 
                        className="loading-container"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <p>Procesando cambio de nombre...</p>
                    </motion.div>
                )}
        </div>
    </div>
    )
}