import { useEffect, useState } from "react"
import type { IGoal } from "../types/interface"
import {config} from "../config/index"
import axios from "axios"

const serverFront = config.Api


export const useGoals = () => {

    const [goal,setGoal] = useState<IGoal[]>([])
    

    useEffect(() => {
        axios.get(`${serverFront}/api/goal`)
        .then(response => {
            setGoal(response.data)
        })
        .catch(error => console.log(error))
    },[])

    const addGoal = async (title:string , priority:string,  start_date?:string) => {

        if(!title.trim()){
            alert('Titulo obligatorio')
        }

        try{
            const response = await axios.post(`${serverFront}/api/goal`,{
                title:title.trim(),
                priority:priority || 'media',
                start_date:start_date || null,
              
            })

            setGoal(prev => [...prev,response.data])
            return response.data
        } catch(err){
            console.error(err)
        }
    }


    return{ goal, addGoal}
}