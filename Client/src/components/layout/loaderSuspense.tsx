import { ClipLoader } from 'react-spinners';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface SuspenseLoaderProps {
  fullScreen?: boolean;
}

export const SuspenseLoader = ({ fullScreen = false }: SuspenseLoaderProps) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  const phrases = [
    "La paciencia es la virtud de los fuertes",
    "Preparando tu experiencia...",
    "Sincronizando datos...",
    "Un momento, estamos listos",
    "Cargando contenido especial...",
    "La calidad toma su tiempo",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 3000); 

    return () => clearInterval(interval);
  }, []);

  const containerStyle = fullScreen
    ? {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2c1a0f 0%, #1a0f08 100%)',
      }
    : {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '60px 20px',
        minHeight: '400px',
      };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={containerStyle}
      className="task-table-container"
    >
      <ClipLoader
        color="#b87c4f"
        loading={true}
        size={60}
        aria-label="loading-spinner"
      />
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          color: '#d4c9a6',
          fontFamily: 'Georgia, serif',
          fontSize: '1.2rem',
          marginTop: '1rem',
        }}
      >
        Cargando...
      </motion.h2>
      <motion.p
        key={currentPhraseIndex}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{
          color: '#b87c4f',
          fontFamily: 'Georgia, serif',
          fontSize: '0.9rem',
          fontStyle: 'italic',
          minHeight: '24px',
          textAlign: 'center',
          maxWidth: '300px',
        }}
      >
        "{phrases[currentPhraseIndex]}"
      </motion.p>
    </motion.div>
  );
};