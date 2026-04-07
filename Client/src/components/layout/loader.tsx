
import { useEffect } from "react"
import { ClipLoader } from 'react-spinners';
import { motion } from 'framer-motion';
import type { LoaderProps } from "../../interfaces/type";


export const Loader = ({ setLoading, onComplete }: LoaderProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
            if (onComplete) onComplete()
        }, 3000)

        return () => clearTimeout(timer)
    }, [setLoading, onComplete])

    return (
        <motion.div
            className="task-table-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                minHeight: "100vh",
                background: "linear-gradient(135deg, #2c1a0f 0%, #1a0f08 100%)"
            }}
        >
            <ClipLoader
                color="#b87c4f"
                loading={true}
                size={80}
                aria-label="loading-spinner"
            />
            <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{
                    color: "#d4c9a6",
                    fontFamily: "Georgia, serif",
                    fontSize: "1.5rem"
                }}
            >
                Espere un momento, por favor
            </motion.h2>
            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                    color: "#b87c4f",
                    fontFamily: "Georgia, serif",
                    fontStyle: "italic"
                }}
            >
                Cargando...
            </motion.p>
        </motion.div>
    )
}

export default Loader