const express = require('express')
const cors = require('cors')
const DB = require('./src/config/database')
const todoRouter = require("./src/routes/taskRoute")
const goalRouter = require("./src/routes/goalRoute")

require('dotenv').config()

const app = express()

app.use(express.json())

const corsOptions = {
    origin: ['http://localhost:5173','https://app-calendario.onrender.com','https://app-calendario-rust.vercel.app/'],
    optionsSuccessStatus: 200,
    methods: 'GET,POST,DELETE,PUT,PATCH',
    credentials: true,
    
};

app.use(cors(corsOptions))

app.use('/api', todoRouter)
app.use('/api', goalRouter)

DB()

const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`)
})