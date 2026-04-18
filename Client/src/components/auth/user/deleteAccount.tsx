
import { useState } from 'react';
import { UseAuth } from '../../../hooks/useAuth';
import { ModalConfirm } from '../../layout/modalConfirm';
import "../../../style/modalDelete.css"
import "../../../style/userSettings.css"
import type { AuthenticatedProps } from '../../../App';
import { useNavigate } from 'react-router-dom';



export const DeleteAccountButton = ({setIsAuthenticated}:AuthenticatedProps) => {
    const { deleteAccount, loading } = UseAuth();
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            await deleteAccount();
            setShowModal(false);
            
            setTimeout(() => {
                setIsAuthenticated(false);  
                navigate('/login');
            }, 3000);
        } catch (err) {
            console.error('Error:', err);
        }
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                disabled={loading}
                className="logout-btn"
            >
                
                {loading ? 'Eliminando...' : 'Eliminar mi cuenta'}
            </button>

            {showModal && (
                <ModalConfirm
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={handleDelete}
                    title="⚠️ Eliminar cuenta"
                    message="¿Estás seguro? Esta acción eliminará permanentemente tu cuenta y todos tus datos. No se puede deshacer."
                    confirmText="Eliminar"
                    cancelText="Cancelar"
                />
            )}
        </>
    );
};
