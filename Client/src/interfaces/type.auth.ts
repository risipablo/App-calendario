

import type { ReactNode } from "react"
import type { ForgotPasswordData, IChangeUserName, LoginData, RegisterData, ResetPasswordData, VerifyEmailData } from "./type.user"

export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string 
}

export interface UseAuthReturn{
    loading:boolean
    setLoading: (loading: boolean) => void
    error:string
    success: string
    register: (useData : RegisterData) => Promise<void>
    login: (credentials: LoginData) => Promise<void>;
    userChange: (credentials: IChangeUserName) => Promise<void>
    changePassword: (credentials: ResetPasswordData) => Promise<void>
    verifyEmail: (credentials: VerifyEmailData) => Promise<void>
    forgotPassword:(credentials:ForgotPasswordData) => Promise<void>
    resetPassword: (credentials: { token: string; newPassword: string }) => Promise<void>;
    logout: () => Promise<void>;
    setError: (error: string) => void;
    setSuccess: (success: string) => void;
}

export interface UserContextType{
    user: User | null
    setUser: (user: User | null) => void
    fetchUserData: () => Promise<void>
    error:string
}

export interface UserProviderProps{
    children:ReactNode 
    isAuthenticated: boolean | null;

}
