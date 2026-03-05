import { useEffect } from "react"
import { ClipLoader } from 'react-spinners';
import type { LoaderProps } from "../../App";



export const Loader = ({ setLoading, onComplete }: LoaderProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
            if (onComplete) onComplete()
        }, 3000)

        return () => clearTimeout(timer) 
    },[setLoading, onComplete])

    return(
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <ClipLoader
                color="rgb(157, 10, 236)"
                loading={true}
                size={80}
                aria-label="loading-spinner"
            />
            <h2>Espere un momento, por favor</h2>
        </div>
    )
}