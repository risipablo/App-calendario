const express = require('express')
const passport = require('passport')
const cors = require('cors')
const bodyParser = require('body-parser')
const DB = require('./src/config/database')
const todoRouter = require("./src/routes/taskRoute")
const goalRouter = require("./src/routes/goalRoute")
const calenderRouter = require('./src/routes/calenderRoute')
const noteRouter = require('./src/routes/noteRoutes')
const authRouter = require('./src/routes/authRoutes')
const validateRouter = require('./src/routes/validateRoutes')
const imageRouter = require('./src/routes/imageRoute')
const healthRouter = require('./src/routes/healthRoute')

const {KeepSupabase} = require('./src/script/keepSupabase');


require('./src/config/passport')
require('dotenv').config()

const app = express()

// Validar variables de entorno requeridas
if (!process.env.RESEND_API_KEY || !process.env.EMAIL_USER) {
    console.error('Error: Faltan variables de entorno RESEND_API_KEY o EMAIL_USER');
    process.exit(1);
}

app.use(express.json())
app.use(bodyParser.json())
app.use(passport.initialize())

const corsOptions = {
    origin: ['http://localhost:5173','https://app-calendario.onrender.com','https://app-calendario-rust.vercel.app'],
    optionsSuccessStatus: 200,
    methods: 'GET,POST,DELETE,PUT,PATCH',
    credentials: true,
};


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors(corsOptions))

app.use('/api', healthRouter)
app.use('/api', todoRouter)
app.use('/api', goalRouter)
app.use('/api', calenderRouter)
app.use('/api', noteRouter)
app.use('/api/images', imageRouter)
app.use('/api/auth', authRouter)
app.use('/api/auth', validateRouter)


DB()

app.get('/api/health', (req,res) => {
    res.json({
        succes:true,
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString()
    })
})

app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        error: 'Ruta no encontrada' 
    });
});


const port = process.env.PORT || 3001

const server = app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`)
    console.log(`📧 Emails se enviarán a: ${process.env.EMAIL_USER}`);

    console.log('Iniciando mantenimiento de Supabase...')

    KeepSupabase()
    
    const INTERVAL_MS = 12 * 60 * 60 * 1000;
    setInterval(KeepSupabase, INTERVAL_MS);

    console.log(`Mantenimiento de Supabase programado cada 12 horas`);
})

process.on('SIGTERM', () => {
    console.log(' Recibido SIGTERM, cerrando servidor...');
    server.close(() => {
        console.log('Servidor cerrado');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log(' Recibido SIGINT, cerrando servidor...');
    server.close(() => {
        console.log('Servidor cerrado');
        process.exit(0);
    });
});