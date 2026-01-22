export const config = {
    Api: import.meta.env.VITE_API_URL || 
         (import.meta.env.DEV ? 'http://localhost:3001' : 'https://app-calendario.onrender.com')
};
    
    