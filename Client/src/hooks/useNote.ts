import { useState, useEffect, useCallback } from 'react';

import toast from 'react-hot-toast';
import axiosInstance from '../utils/axiosIntance';
import type { INote } from '../interfaces/type.notes';

const TOAST_CONFIG = {
    position: 'top-center' as const,
    duration: 1500
};

export const useNotes = () => {
    const [note, setNote] = useState<INote[]>([]);
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('No token');
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLoading(false);
            return;
        }

        axiosInstance.get('/api/note')
            .then(response => {
                setNote(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
            });
    }, []);


    const addNote = useCallback(async (date: Date, title: string, category?: string) => {
        if (!title.trim() || !date) {
            toast.error('Completa todos los campos requeridos', TOAST_CONFIG);
            return;
        }

        try {
            const response = await axiosInstance.post('/api/note', {
                date: date || null,
                title: title.trim(),
                category: category || '',
                completed: false
            });

            setNote(prev => [...prev, response.data]);
            toast.success('Nota rápida agregada.', TOAST_CONFIG);
        } catch (err) {
            toast.error('Error al agregar nota.', TOAST_CONFIG);
            console.error(err);
        }
    }, []);


    const deleteNote = useCallback((id: string) => {
        axiosInstance.delete(`/api/note/${id}`)
            .then(() => {
                setNote(prev => prev.filter(prod => prod._id !== id));
                toast.success('Nota eliminada.', TOAST_CONFIG);
            })
            .catch(err => {
                console.log(err);
                toast.error('Error al eliminar nota.', TOAST_CONFIG);
            });
    }, []);

    
    const allDeleteNote = useCallback(() => {
        axiosInstance.delete('/api/note')
            .then(response => {
                setNote([]);
                toast.success('Todas las notas eliminadas.', TOAST_CONFIG);
                console.debug(response.data);
            })
            .catch(err => {
                console.error(err);
                toast.error('Error al eliminar notas.', TOAST_CONFIG);
            });
    }, []);

    
    const editNote = useCallback((id: string, editData: { date: Date; title: string; category: string }) => {
        axiosInstance.patch(`/api/note/${id}`, editData)
            .then(response => {
                setNote(prev => prev.map(goa => goa._id === id ? response.data : goa));
                toast.success('Nota guardada.', TOAST_CONFIG);
            })
            .catch(err => {
                console.log(err);
                toast.error('Error al guardar la nota', TOAST_CONFIG);
            });
    }, []);

    
    const toogleComplete = useCallback((id: string) => {
        axiosInstance.patch(`/api/note/${id}/completed`)
            .then(response => {
                setNote(prev => prev.map(goa => goa._id === id ? response.data : goa));

                const noteItem = response.data;
                const message = noteItem.completed ? 'Nota completada ✓' : 'Nota marcada como pendiente';
                
                toast.success(message, TOAST_CONFIG);
            })
            .catch(err => {
                console.error(err);
                toast.error('Error al actualizar nota', TOAST_CONFIG);
            });
    }, []);

    return {
        note,
        loading,
        addNote,
        deleteNote,
        allDeleteNote,
        editNote,
        toogleComplete
    };
};