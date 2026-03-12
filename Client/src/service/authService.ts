
import axios, { AxiosError }  from "axios";
import { config } from "../config/index";
import type { ApiError, AuthResponse, IChangeUserName, LoginData, RegisterData, ResetPasswordData, VerifyEmailData } from "../interfaces/type.user";


const serverFront = config.Api


class AuthService{
    
    
    async register(userData: RegisterData): Promise<AuthResponse>{
        try{
            const response = await axios.post<AuthResponse>(`${serverFront}/api/auth/register`, userData)
            return response.data
        
        } catch (err){
            this.handleError(err as AxiosError<ApiError>);
            
        }
    }

    async login(credentials: LoginData): Promise<AuthResponse>{
        try{
            const response = await axios.post<AuthResponse>(`${serverFront}/api/auth/login`, credentials)
            // console.log('Respuesta del login:', response.data)
        
            if(response.data.token){
                // console.log('Guardando token:', response.data.token) 
                localStorage.setItem('token', response.data.token)
                // console.log('Token guardado:', localStorage.getItem('token')) 
            }
            return response.data
            
        } catch(error){
            this.handleError(error as AxiosError<ApiError>);
            
        }
    }

    async changeName(credentials: IChangeUserName): Promise<AuthResponse>{
        try{

            const token = this.getToken()


            const response = await axios.patch<AuthResponse>(
                `${serverFront}/api/auth/change-user`, { newName: credentials.newName}
                ,{
                    headers: {
                        'Authorization': `Bearer ${token}`, 
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            )

            if(response.data.token){
                localStorage.setItem('token',response.data.token)
            }
            return response.data
        } catch(error){
            this.handleError(error as AxiosError<ApiError>)
        }
    }


    async ResetPassword(credentials: ResetPasswordData): Promise<AuthResponse>{
        try{
            const token = this.getToken()

            if (!token) {
                throw new Error('No hay token de autenticación');
            }


            const response = await axios.patch<AuthResponse>(
                `${serverFront}/api/auth/change-password`,
                {newPassword:credentials.newPassword, currentPasword: credentials.currentPassword}
                ,{
                    headers: {
                        'Authorization': `Bearer ${token}`, 
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            )

            
            if(response.data.token){
                localStorage.setItem('token',response.data.token)
            }

            return response.data
            
        }  catch(error){
            console.error('❌ Error en resetPassword:', error);
            this.handleError(error as AxiosError<ApiError>)
        }
    }

    async VerifyEmail(credentials: VerifyEmailData): Promise<AuthResponse>{
        try{
            const token = this.getToken()

            const response = await axios.post<AuthResponse>(`${serverFront}/api/auth/verify-email`,
                {email: credentials.email},
                {  
                    headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json'
                    },
                withCredentials: true}
            )
            if(response.data.token){
                localStorage.setItem('token',response.data.token)
            }
            
            return response.data
        } catch(error){
            this.handleError(error as AxiosError<ApiError>)
        }
    }

    async logout(): Promise<void>{
        try{
            const token = this.getToken()

            await axios.post(
                `${serverFront}/api/auth/logout`, 
                {},  
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true
                }
            )

            localStorage.removeItem('token')
        } catch(error){
            console.error('Error en logout del backend:', error)
            localStorage.removeItem('token')
        }
    } 

    getToken():string | null{
        return localStorage.getItem('token')
    }

    private handleError(error: AxiosError<ApiError>): never {
        if (error.response) {
          throw new Error(error.response.data?.error || 'Error en la solicitud');
        } else if (error.request) {
          throw new Error('El servidor no respondió. Intenta más tarde.');
        } else {
          throw new Error('Error al enviar la solicitud');
        }
      }
}

export default new AuthService()