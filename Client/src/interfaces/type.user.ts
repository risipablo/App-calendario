

export interface RegisterData{
    email:string
    password:string
    name:string
}

export interface LoginData {
    email: string;
    password: string;
  }
  
  export interface ForgotPasswordData {
    email: string;
  }
  
  export interface ResetPasswordData {
    password: string;
    confirmPassword: string;
    token: string;
  }
  
  export interface AuthResponse {
    message: string;
    token?: string;
    user?: {
      id: string;
      email: string;
      name: string;
    };
  }
  
  export interface ApiError {
    error: string;
    response?: {
      data?: {
        error?: string;
      };
    };
    request?: unknown;
    message?: string;
}


// Interface for register user

export interface AuthLayoutProps{
    children: React.ReactNode
    title:string
}

export interface PasswordInputProps{
    value:string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder:string
    required?: boolean
    delay?: number
    name?:string
}

export interface AuthButtonProps{
    loading: boolean
    text: string
    type?: 'button' | 'submit' | 'reset';
}

export interface PasswordRequirementsProps{
    show:boolean
    onToggle: () => void
}