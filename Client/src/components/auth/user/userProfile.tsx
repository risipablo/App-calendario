import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, Trash2 } from 'lucide-react';
import { useUser } from '../../../hooks/useUser';
import toast from 'react-hot-toast';
import axios from 'axios';
import axiosInstance from '../../../utils/axiosIntance';
import { UseAuth } from '../../../hooks/useAuth';
import "../../../style/imageUser.css"
import "../../../style/task.css"
import { Helmet } from 'react-helmet';


const ChangeImageUser = () => {
    const { user, fetchUserData } = useUser();
    const { loading, setLoading } = UseAuth();
    const [previewUrl, setPreviewUrl] = useState<string | null>(user?.avatarUrl || null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Formato no permitido. Usa JPEG, PNG o WEBP');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error('La imagen no debe superar los 2MB');
            return;
        }

        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error('Selecciona una imagen primero');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('avatar', selectedFile);

        try {
            const response = await axiosInstance.post('/api/images/upload-avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                toast.success('Imagen de perfil actualizada');
                await fetchUserData();
                setSelectedFile(null);
            }
        } catch (error: unknown) {
            console.error('Error subiendo imagen:', error);
            const errorMessage = axios.isAxiosError<{ error?: string }>(error)
                ? (error.response?.data?.error ?? 'Error al subir la imagen')
                : 'Error al subir la imagen';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!user?.avatarUrl) {
            toast.error('No hay imagen para eliminar');
            return;
        }

        setLoading(true);
        try {
            const response = await axiosInstance.delete('/api/images/delete-avatar');
            if (response.status === 200) {
                toast.success('Imagen eliminada');
                setPreviewUrl(null);
                setSelectedFile(null);
                await fetchUserData();
            }
        } catch (error: unknown) {
            console.error('Error eliminando imagen:', error);
            const errorMessage = axios.isAxiosError<{ error?: string }>(error)
                ? (error.response?.data?.error ?? 'Error al eliminar la imagen')
                : 'Error al eliminar la imagen';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="task-table-container">
            <Helmet> <title> Perfil usuario </title> </Helmet>
            <motion.div 
            className="profile-image-card"
            initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}>
                <h2 className="profile-title">Foto de Perfil</h2>
                <p className="profile-subtitle">Sube una imagen para personalizar tu perfil</p>

                <div className="avatar-section">
                    <motion.div
                        className="avatar-wrapper"
                        whileHover={{ scale: 1.02 }}
                    >
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="Avatar"
                                className="avatar-image"
                            />
                        ) : (
                            <div className="avatar-placeholder">
                                <Camera size={48} />
                                <span>Sin foto</span>
                            </div>
                        )}
                        
                        <button
                            className="avatar-edit-btn"
                            onClick={triggerFileInput}
                            disabled={loading}
                        >
                            <Camera size={20} />
                        </button>
                    </motion.div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/jpeg,image/png,image/jpg,image/webp"
                        style={{ display: 'none' }}
                    />
                </div>

                {selectedFile && (
                    <div className="file-info">
                        <p>Archivo seleccionado: {selectedFile.name}</p>
                        <p>{(selectedFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                )}

                <div className="action-buttons">
                    <motion.button
                        className="btn-upload"
                        onClick={handleUpload}
                        disabled={loading || !selectedFile}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Upload size={18} />
                        {loading ? 'Subiendo...' : 'Subir Imagen'}
                    </motion.button>

                    {user?.avatarUrl && (
                        <motion.button
                            className="btn-delete"
                            onClick={handleDelete}
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Trash2 size={18} />
                            Eliminar
                        </motion.button>
                    )}
                </div>

                <div className="info-note">
                    <p>Formatos permitidos: JPG, PNG, WEBP</p>
                    <p>Tamaño máximo: 2MB</p>
                </div>
            </motion.div>
        </div>
    );
};

export default ChangeImageUser