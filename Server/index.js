const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const DB = require('./src/config/database')
const todoRouter = require("./src/routes/taskRoute")
const goalRouter = require("./src/routes/goalRoute")
const calenderRouter = require('./src/routes/calenderRoute')
const authRouter = require('./src/routes/authRoutes')
const validateRouter = require('./src/routes/validateRoutes')
const imageRouter = require('./src/routes/imageRoute')

require('dotenv').config()

const app = express()

// Validar variables de entorno requeridas
if (!process.env.RESEND_API_KEY || !process.env.EMAIL_USER) {
    console.error('Error: Faltan variables de entorno RESEND_API_KEY o EMAIL_USER');
    process.exit(1);
}

app.use(express.json())
app.use(bodyParser.json())

const corsOptions = {
    origin: ['http://localhost:5173','https://app-calendario.onrender.com','https://app-calendario-rust.vercel.app'],
    optionsSuccessStatus: 200,
    methods: 'GET,POST,DELETE,PUT,PATCH',
    credentials: true,
};


app.use(cors(corsOptions))

app.use('/api', todoRouter)
app.use('/api', goalRouter)
app.use('/api', calenderRouter)
app.use('/api/images', imageRouter)
app.use('/api/auth', authRouter)
app.use('/api/auth', validateRouter)

DB()

const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`)
    console.log(`📧 Emails se enviarán a: ${process.env.EMAIL_USER}`);
})