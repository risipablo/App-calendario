
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

 const CallbackPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const error = params.get('error');
    
        console.log('CallbackPage - Token recibido:', token ? 'Sí' : 'No');
    
        if (error) {
            localStorage.removeItem('token');
            navigate('/login', { state: { error: 'Error al iniciar sesión con Google' } });
        } else if (token) {
            
            
            localStorage.removeItem('token');
            localStorage.setItem('token', token);
            console.log('✅ Token guardado, redirigiendo a dashboard');
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

export default CallbackPage