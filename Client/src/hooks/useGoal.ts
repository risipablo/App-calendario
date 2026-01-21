import { useEffect, useState } from "react"
import type { IGoal } from "../types/interface"
import {config} from "../config/index"
import axios from "axios"
import toast from "react-hot-toast"

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

    const deleteGoal = (id:string) => {
        axios.delete(`${serverFront}/api/goal/${id}`)
        .then(() => {
            const updateGoal = goal.filter((prod) => prod._id !== id)
            setGoal(updateGoal)
        })
        .catch(err => console.log(err))
    }

    const allDeleteGoal = () => {
        axios.delete(`${serverFront}/api/goal`)
        .then(response => {
            setGoal([])
            console.debug(response.data)
        })
        .catch(err => console.error(err))
    } 

    const editGoal = (id:string, editData:{title:string, priority:string, start_date:string}) => {
        axios.patch(`${serverFront}/api/goal/${id}`,editData)
        .then(response => {
            const updateGoal = goal.map(goa => {
                if(goa._id === id)
                    return response.data
                return goa
            })
            setGoal(updateGoal)
        })
        .catch(err => console.log(err)) 
    }

    const toogleComplete = (id:string) => {
        axios.patch(`${serverFront}/api/goal/${id}/completedGoal`)
        .then(response => {
            setGoal(prev => prev.map(goa => goa._id === id ? response.data : goa))

            const goal = response.data
            const message = goal.completed ? 'Goal Completed' : 'Goal Incomplete'

            toast.success(message,{
                position:'top-center',
                duration:1000
            })
        })
        .catch(err => {
            console.error(err)
            toast.error("Error update goals")
        })

    }

    return{ goal, addGoal, deleteGoal, editGoal, toogleComplete, allDeleteGoal}
}