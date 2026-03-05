
import type { ReactNode } from "react"
import type { LoginData, RegisterData } from "./type.user"

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface UseAuthReturn{
    loading:boolean
    error:string
    success: string
    register: (useData : RegisterData) => Promise<void>
    login: (credentials: LoginData) => Promise<void>;
    setError: (error: string) => void;
    setSuccess: (success: string) => void;
}

export interface UserContextType{
    user: User | null
    setUser?: (user: User) => void
    fetchUserData: () => Promise<void>
    error:string
}

export interface UserProviderProps{
    children:ReactNode
}
