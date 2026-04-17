
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

export const CallbackPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const error = params.get('error');

        if (error) {
            navigate('/login', { state: { error: 'Error al iniciar sesión con Google' } });
        } else if (token) {
            localStorage.setItem('token', token);
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    }, [location, navigate]);

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '100vh' 
        }}>
            <ClipLoader color="#667eea" size={60} />
            <p style={{ marginTop: '20px', color: '#667eea' }}>Iniciando sesión...</p>
        </div>
    );
};