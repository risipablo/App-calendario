// src/components/auth/Login.tsx
import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import type { LoginData } from '../../interfaces/type.user';
import { PasswordInput } from '../../components/auth/passwordInput';
import { AuthLayout } from '../../components/auth/common/authLayout';
import { AuthButton } from '../../components/auth/common/authButton';
import { UseAuth } from '../../hooks/useAuth';


const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: ''
  });
  const { login, loading, error } = UseAuth();

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type } = e.target;
    
    if (type === 'email') {
      setFormData({ ...formData, email: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    await login(formData)
  };

  return (
    <AuthLayout title="Iniciar Sesión">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.input
          type="email"
          name="email"
          placeholder="Ingrese Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
          whileFocus={{ scale: 1.05 }}
        />

        <PasswordInput
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Ingrese Contraseña"
          delay={0.2}
        />

        <AuthButton loading={loading} text="Iniciar Sesión" />

        {error && (
          <motion.p 
            className="message error"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            {error}
          </motion.p>
        )}
      </motion.form>

      <motion.div 
        className="count"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <NavLink to="/register">
          <p>¿No tienes cuenta? Regístrate</p>
        </NavLink>
        <NavLink to="/forgot-password">
          <p>¿Olvidaste tu contraseña?</p>
        </NavLink>
      </motion.div>
    </AuthLayout>
  );
};

export default LoginPage;

