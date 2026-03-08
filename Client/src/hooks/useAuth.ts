import { useState } from "react";

import { useNavigate } from "react-router-dom";
import type { LoginData, RegisterData } from "../interfaces/type.user";
import authService from "../service/authService";
import type { UseAuthReturn } from "../interfaces/type.auth";
import { useUser } from "./useUser";



export const UseAuth = ():UseAuthReturn => {
    
    const{fetchUserData, setUser} = useUser()
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
            await fetchUserData()
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

    const logout = async() :Promise<void> => {
        setLoading(true)

        try{
            await authService.logout()
            setUser(null)
            navigate('/login')
        } catch(err){
            console.error('error en logut', err)
            localStorage.removeItem('token')
            setUser(null)
            navigate('/login')
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
        logout,
        setError,
        setSuccess
    }

}