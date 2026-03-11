import { useState, type FormEvent } from "react";

import type { ChangeUserNameProps, ResetPasswordData, VerifyEmailData } from "../../interfaces/type.user";
import { UseAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeClosed } from "lucide-react"


interface ShowState {
    current: boolean;
    new: boolean;
    confirm: boolean;
}

export function ResetPasswordPage({setIsAuthenticated}:ChangeUserNameProps){

    const [formData, setFormData] = useState<ResetPasswordData>({
        currentPassword:'',
        newPassword: '',
    })

    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const [emailData,setEmailData] = useState<VerifyEmailData>({
        email: ''
    }) 

    const [showSuccess, setShowSuccess] = useState(false);
    const [message, setMessage] = useState<string>('');

    const [show, setShow] = useState<ShowState>({
        current: false,
        new: false,
        confirm: false
    });

    const {resetPassword, verifyEmail,loading, error, success} = UseAuth()
    const navigate = useNavigate()



    const toggleShow = (field: keyof ShowState):void => {
        setShow(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleVerifyEmail = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        try{
            await verifyEmail(emailData)
            setShowSuccess(true)
            setIsAuthenticated(true)
            setMessage("Correo verificado correctamente. Ahora puedes cambiar tu contraseña.");
        } catch (err){
            console.error(err)
            setMessage("El correo no es correcta, verifiquelo e intente nuevamente");
        }

        

    }

    const handleChangePassword = async(e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()

        if(!emailData.email){
            setMessage("Por favor, verifica tu correo electrónico antes de cambiar la contraseña");
            return;
        }

        if(formData.newPassword !== confirmPassword){
            setMessage("Las contraseñas no coinciden")
            return
        }

        if(formData.newPassword === formData.currentPassword){
            setMessage("No puedes repetir la misma contraseña actual")
            return
        }

        if(formData.newPassword.length < 8) {
            setMessage('La nueva contraseña debe tener al menos 8 caracteres')
            return
        }

        try{
            await resetPassword(formData)
            setShowSuccess(true)

            setTimeout(() => {
                setIsAuthenticated(true)
                navigate('/dashboard')
                
            },3000)
        } catch(err){
            console.error('Error cambiando nombre de usuario:', err)
        }
    }


    return(
        <div>
            <div>
                <h2> Cambiar Contraseña</h2>
                {!emailData.email || !showSuccess ? (
                    <motion.form
                        onSubmit={handleVerifyEmail}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <h3> <strong> Primero debes confirmar tu correo electronico </strong></h3>

                        <div className="form-group">
                            <input
                                type="email"
                                placeholder="Correo electrónico"
                                value={emailData.email}
                                onChange={(e) => setEmailData({ email: e.target.value })}
                                required
                                disabled={loading}
                                className="auth-input"
                            />
                        </div>

                        
                        <button
                            type="submit"
                            disabled={loading}
                            className="auth-button"
                        >
                            {loading ? "Verificando..." : "Verificar Correo"}
                        </button>

                        
                        {message && !showSuccess && (
                            <p className="message info">{message}</p>
                        )}

                        {error && <p className="message error">{error}</p>}
                    </motion.form>
                ): (
                    
                    <motion.form
                        onSubmit={handleChangePassword}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h3 className="auth-subtitle">
                            <strong>Ingresa tu nueva contraseña</strong>
                        </h3>

                        {/* Contraseña actual */}
                        <motion.div
                            className="password-field"
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                        >
                            <input
                                type={show.current ? 'text' : 'password'}
                                placeholder="Contraseña actual"
                                value={formData.currentPassword}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    currentPassword: e.target.value
                                })}
                                required
                                disabled={loading}
                                className="auth-input"
                            />
                            <span
                                className="password-icon"
                                onClick={() => toggleShow('current')}
                            >
                                {show.current ? <Eye /> : <EyeClosed />}
                            </span>
                        </motion.div>

                        {/* Nueva contraseña */}
                        <motion.div
                            className="password-field"
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            <input
                                type={show.new ? 'text' : 'password'}
                                placeholder="Nueva contraseña"
                                value={formData.newPassword}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    newPassword: e.target.value
                                })}
                                required
                                minLength={8}
                                disabled={loading}
                                className="auth-input"
                            />
                            <span
                                className="password-icon"
                                onClick={() => toggleShow('new')}
                            >
                                {show.new ? <Eye /> : <EyeClosed />}
                            </span>
                        </motion.div>

                        {/* Confirmar nueva contraseña */}
                        <motion.div
                            className="password-field"
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            <input
                                type={show.confirm ? 'text' : 'password'}
                                placeholder="Confirmar nueva contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={8}
                                disabled={loading}
                                className="auth-input"
                            />
                            <span
                                className="password-icon"
                                onClick={() => toggleShow('confirm')}
                            >
                                {show.confirm ? <Eye /> : <EyeClosed />}
                            </span>
                        </motion.div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="auth-button"
                        >
                            {loading ? "Cambiando..." : "Cambiar Contraseña"}
                        </button>

                        {/* Mensajes */}
                        {message && (
                            <motion.p
                                className={`message ${showSuccess ? 'success' : 'info'}`}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                            >
                                {message}
                            </motion.p>
                        )}

                        {success && !message && (
                            <p className="message success">{success}</p>
                        )}

                        {error && !message && (
                            <p className="message error">{error}</p>
                        )}

                        {/* Barra de progreso para redirección */}
                        {showSuccess && (
                            <motion.div
                                className="progress-bar-container"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="progress-bar">
                                    <motion.div
                                        className="progress-fill"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 3, ease: "linear" }}
                                    />
                                </div>
                                <p className="redirect-message">
                                    Redirigiendo al dashboard...
                                </p>
                            </motion.div>
                        )}
                    </motion.form>
                )}
            </div>
        </div>
    )
}