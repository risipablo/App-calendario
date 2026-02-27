import { useState } from "react";

import { useNavigate } from "react-router-dom";
import type { LoginData, RegisterData } from "../interfaces/type.user";
import authService from "../service/authService";

export interface UseAuthReturn{
    loading:boolean
    error:string
    success: string
    register: (useData : RegisterData) => Promise<void>
    login: (credentials: LoginData) => Promise<void>;
    setError: (error: string) => void;
    setSuccess: (success: string) => void;
}

export const UseAuth = ():UseAuthReturn => {

    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<string>('')
    const navigate = useNavigate()

    const register = async (userData : RegisterData): Promise<void> => {
        setLoading(true)
        setError('')
        setSuccess('')

        try{
            const data = await authService.register(userData)
            setSuccess(data.message || 'Registro exitoso. Por favor verifica tu email.');
            setTimeout(() => navigate('/login'),3000)

        }catch (err) {
            setError((err as Error).message);
            throw err;
        } finally {
            setLoading(false)
        }

    }


    const login = async(credentials: LoginData) : Promise<void> => {
        setLoading(true)
        setError('')

        try{
            const data = await authService.login(credentials)
            setSuccess(data.message || 'Login exitoso')
            setTimeout(() => {
               navigate('/dashboard') 
            }, 1000);
        } catch (err){
            setError((err as Error).message)
            throw err
        } finally {
            setLoading(false)
        }
    }
    
    return{
        login,
        loading,
        error,
        success,
        register,
        setError,
        setSuccess
    }

}