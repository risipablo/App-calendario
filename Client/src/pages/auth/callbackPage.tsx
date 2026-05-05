// pages/auth/callbackPage.tsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import type { AuthenticatedProps } from '../../App';

const CallbackPage = ({ setIsAuthenticated }: AuthenticatedProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const error = params.get('error');

        

        if (error) {
        
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            navigate('/login', { state: { error: 'Error al iniciar sesión con Google' } });
            return;
        }

        if (token) {
        
            localStorage.setItem('token', token);
        
            setIsAuthenticated(true);
            console.log('✅ setIsAuthenticated(true)');
            
        
            navigate('/dashboard');
        } else {
        
            navigate('/login');
        }
    }, [location.search, navigate, setIsAuthenticated]);

    
    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '100vh' 
        }}>
            <ClipLoader color="#b87c4f" size={60} />
            <p style={{ marginTop: '20px', color: '#d4c9a6' }}>Procesando inicio de sesión...</p>
        </div>
    );
};

export default CallbackPage;