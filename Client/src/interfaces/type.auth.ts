import type { LoginData, RegisterData } from "./type.user"

export interface UseAuthReturn{
    loading:boolean
    error:string
    success: string
    register: (useData : RegisterData) => Promise<void>
    login: (credentials: LoginData) => Promise<void>;
    setError: (error: string) => void;
    setSuccess: (success: string) => void;
}