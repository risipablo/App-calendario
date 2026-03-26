import { useState } from "react"
import { UseAuth } from "../../hooks/useAuth"
import { AuthLayout } from "../../components/auth/common/authLayout"
import { NavLink } from "react-router-dom"
import { motion } from "framer-motion"
import { Helmet } from "react-helmet"

export const ForgotPasswordPage = () => {
    const [email,setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const{forgotPassword,loading,error}= UseAuth()
    
    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault()

        try{
            await forgotPassword({email})
            setSubmitted(true)
        } catch(err){
            console.error(err)
        }
    }

    return(
        <AuthLayout title="Recuperar Contraseña">
            <Helmet><title>Recuperar contraseña</title></Helmet>
    {!submitted ? (
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="instruction-text">
                        Ingresa tu correo electrónico y te enviaremos instrucciones 
                        para recuperar tu contraseña.
                    </p>

                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                        {loading ? "Enviando..." : "Enviar instrucciones"}
                    </button>

                    {error && (
                        <motion.p 
                            className="message error"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {error}
                        </motion.p>
                    )}

                    <div className="auth-links">
                        <NavLink to="/login">
                            Volver al inicio de sesión
                        </NavLink>
                    </div>
                </motion.form>
            ) : (
                <motion.div 
                    className="success-container"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="success-icon">✓</div>
                    <h3>¡Correo enviado!</h3>
                    <p>
                        Si existe una cuenta con <strong>{email}</strong>, 
                        recibirás instrucciones para recuperar tu contraseña.
                    </p>
                    <p className="info-text">
                        Revisa tu bandeja de entrada y sigue el enlace proporcionado.
                        El enlace expirará en 15 minutos.
                    </p>
                    <div className="auth-links">
                        <NavLink to="/login">
                            Volver al inicio de sesión
                        </NavLink>
                    </div>
                </motion.div>
            )}
        </AuthLayout>
    )
}