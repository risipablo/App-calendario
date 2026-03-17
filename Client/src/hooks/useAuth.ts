import { useState } from "react";

import { useNavigate } from "react-router-dom";
import type { ForgotPasswordData, IChangeUserName, LoginData, RegisterData, ResetPasswordData, VerifyEmailData } from "../interfaces/type.user";
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

    const userChange = async(credentials: IChangeUserName) : Promise<void> => {
        setLoading(true)
        setError('')

        try{
            const data = await authService.changeName(credentials)
            setSuccess(data.message || 'Cambio de nombre del usuario exitoso')
            navigate('/dashboard')
            
            

            } catch (err){
                setError((err as Error).message)
                throw err
            } finally {
                setLoading(false)
            }
        
    }

    const changePassword = async(credentials: ResetPasswordData) : Promise<void> => {
        setLoading(true)
        setError('')

        
        try{
            const data = await authService.ChangePassword(credentials)
            setSuccess(data.message || 'Cambio de nombre de contraseña exitoso')

            localStorage.removeItem('token')
            navigate('/login')
        } catch (err){
            setError((err as Error).message)
            throw err
        } finally {
            setLoading(false)
        }
    
    }

    const verifyEmail = async(credentials: VerifyEmailData): Promise<void> => {
        setLoading(true)
        setError('')

        try{
            const data = await authService.VerifyEmail(credentials)
            setSuccess(data.message || 'Cambio de nombre de contraseña exitoso')
            
        } catch (err){
            setError((err as Error).message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const forgotPassword = async(credentials: ForgotPasswordData): Promise<void> => {
        setLoading(true)
        setError('')
        setSuccess('')

        try{
            const data = await authService.ForgotPassword(credentials)
            setSuccess(data.message || 'Instrucciones enviadas a tu correo');
        } catch (err) {
            setError((err as Error).message);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    const resetPassword = async (credentials: { token: string; newPassword: string }): Promise<void> => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const data = await authService.ResetPasswords(credentials);
            setSuccess(data.message || 'Contraseña actualizada exitosamente');
            
            localStorage.removeItem('token');
            setUser(null);
        } catch (err) {
            setError((err as Error).message);
            throw err;
        } finally {
            setLoading(false);
        }
    };


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
        userChange,
        changePassword,
        verifyEmail,
        forgotPassword,
        resetPassword,
        setError,
        setSuccess
    }

}