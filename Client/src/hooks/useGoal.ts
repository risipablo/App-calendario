import { useEffect, useState } from "react"
import type { IGoal } from "../interfaces/type.goal"
import toast from "react-hot-toast"
import axiosInstance from "../utils/axiosIntance"

const TOAST_CONFIG = {
    position: 'top-center' as const,
    duration: 1500
}

export const useGoals = () => {

    const [goal,setGoal] = useState<IGoal[]>([])
    const [loading,setLoading] = useState(true)
    
    useEffect(() => {
        const token = localStorage.getItem('token')
        
        if(!token){
            console.error('No token')
            // setLoading(false) 
            return
        }

        axiosInstance.get(`/api/goal`)
        .then(response => {
            setGoal(response.data)
            setLoading(false)
        })
        .catch(error => console.log(error))
    },[])

    const addGoal = async (title:string,description:string, priority:string,  start_date?:string) => {

        if(!title.trim()){
            alert('Titulo obligatorio')
        }

        try{
            const response = await axiosInstance.post(`/api/goal`,{
                title:title.trim(),
                description:description.trim(),
                priority:priority || 'media',
                start_date:start_date || null,
              
            })

            setGoal(prev => [...prev,response.data])
            toast.success('Task saved successfully.', TOAST_CONFIG)
            return response.data
        } catch(err){
            toast.error('Error add goal.', TOAST_CONFIG)
            console.error(err)
        }
    }

    const deleteGoal = (id:string) => {
        axiosInstance.delete(`/api/goal/${id}`)
        .then(() => {
            const updateGoal = goal.filter((prod) => prod._id !== id)
            setGoal(updateGoal)
            toast.success('Goal deleted.', TOAST_CONFIG)
        })
        .catch(err => console.log(err))
        toast.error('Error goal deleted.', TOAST_CONFIG)
    }

    const allDeleteGoal = () => {
        axiosInstance.delete(`/api/goal`)
        .then(response => {
            setGoal([])
            toast.success('All goal deleted.', TOAST_CONFIG)
            console.debug(response.data)
        })
        .catch(err => console.error(err))
        toast.error("Error delete error", TOAST_CONFIG)
    } 

    const editGoal = (id:string, editData:{title:string,description:string ,priority:string, start_date:string}) => {
        axiosInstance.patch(`/api/goal/${id}`,editData)
        .then(response => {
            const updateGoal = goal.map(goa => {
                if(goa._id === id)
                    return response.data
                return goa
            })
            setGoal(updateGoal)
            toast.success('Save goal.', TOAST_CONFIG)
        })
        .catch(err => console.log(err))
        toast.error("Error update goal")
    }

    const toogleComplete = (id:string) => {
        axiosInstance.patch(`/api/goal/${id}/completedGoal`)
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

    return{ goal,loading, addGoal, deleteGoal, editGoal, toogleComplete, allDeleteGoal}
}