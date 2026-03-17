
import { useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthLayout } from "../../components/auth/common/authLayout";
import { UseAuth } from "../../hooks/useAuth";
import type { AuthenticatedProps } from "../../App";

export const ResetPasswordPage = ({setIsAuthenticated}:AuthenticatedProps) => {
    const { token } = useParams<{ token: string }>();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [resetDone, setResetDone] = useState(false);
    
    const { resetPassword, loading, error, success } = UseAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAuthenticated(true)
        // Validaciones
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        if (password.length < 8) {
            alert("La contraseña debe tener al menos 8 caracteres");
            return;
        }

        try {
            await resetPassword({ token: token!, newPassword: password });
            setResetDone(true);
            
            
            setTimeout(() => {
                navigate('/login', { 
                    state: { 
                        message: 'Contraseña actualizada exitosamente. Inicia sesión con tu nueva contraseña.' 
                    } 
                });
            }, 3000);
        } catch (err) {
            console.error(err)
        }
    };

    if (resetDone) {
        return (
            <AuthLayout title="¡Contraseña actualizada!">
                <motion.div 
                    className="success-container"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="success-icon">✓</div>
                    <p className="success-message">
                        {success || "Tu contraseña ha sido actualizada exitosamente."}
                    </p>
                    <p className="redirect-message">
                        Serás redirigido al login en 3 segundos...
                    </p>
                    <div className="progress-bar">
                        <motion.div 
                            className="progress-fill"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 3, ease: "linear" }}
                        />
                    </div>
                    <div className="auth-links">
                        <NavLink to="/login">
                            Ir al login ahora
                        </NavLink>
                    </div>
                </motion.div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout title="Nueva Contraseña">
            <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <p className="instruction-text">
                    Ingresa tu nueva contraseña. Debe tener al menos 8 caracteres.
                </p>

                {/* Nueva contraseña */}
                <motion.div 
                    className="password-field"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Nueva contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        disabled={loading}
                        className="auth-input"
                    />
                    <span 
                        className="password-icon"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {/* {showPassword ? < /> : <FaEye />} */}
                    </span>
                </motion.div>

                {/* Confirmar contraseña */}
                <motion.div 
                    className="password-field"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <input
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Confirmar contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={8}
                        disabled={loading}
                        className="auth-input"
                    />
                    <span 
                        className="password-icon"
                        onClick={() => setShowConfirm(!showConfirm)}
                    >
                        {/* {showConfirm ? <FaEyeSlash /> : <FaEye />} */}
                    </span>
                </motion.div>

                <motion.button 
                    type="submit" 
                    disabled={loading}
                    className="auth-button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {loading ? "Actualizando..." : "Restablecer contraseña"}
                </motion.button>

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
        </AuthLayout>
    );
};