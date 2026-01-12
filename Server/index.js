const express = require('express')
const cors = require('cors')
const DB = require('./src/config/database')
const todoRouter = require("./src/routes/taskRoute")

require('dotenv').config()

const app = express()

app.use(express.json())

const corsOptions = {
    origin: ['http://localhost:5173'],
    optionsSuccessStatus: 200,
    methods: 'GET,POST,DELETE,PUT,PATCH',
    credentials: true,
    
};

app.use(cors(corsOptions))

app.use('/api',todoRouter)

DB()

const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`)
})