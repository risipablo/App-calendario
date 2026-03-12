import type { User, UserContextType, UserProviderProps } from './../interfaces/type.auth';

import React, { createContext, useEffect, useState } from "react";
import axiosInstance from '../utils/axiosIntance';



export const UserContext = createContext<UserContextType | undefined>(undefined)


export const UserProvider: React.FC<UserProviderProps> = ({children, isAuthenticated}) => {
    
    const [user, setUser] = useState<User | null>(null)
    const [error, setError] = useState<string>('')



    const fetchUserData = async () => {
        const token = localStorage.getItem('token')
        console.log('Token en fetchUserData:', token) 
        try{
            const response = await axiosInstance.get('/api/auth/name')
            
            setUser(response.data.user)
        } catch (err) {
            console.error(err)
            setError('Error to get data of the user')
        }
    }


    
    useEffect(() => {
        if(isAuthenticated){
            
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchUserData()
        } else {
            setUser(null)
        }
    },[isAuthenticated])

    const value: UserContextType = {
        fetchUserData,
        error,
        user,
        setUser
    }

    return React.createElement(
        UserContext.Provider,
        {value},
        children
    )

}