import { motion } from "framer-motion"
import type { AuthButtonProps } from "../../../interfaces/type.user"



export const AuthButton = ({
loading,
text,
type = 'submit'   
}:AuthButtonProps) => {

    return (
        <motion.button 
          type={type}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ 
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Cargando...' : text}
        </motion.button>
    )
}
