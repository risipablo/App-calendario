const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB)
        console.log("Conexion exitosa con la base de datos")
    } catch(err) {
        console.error("Conexion fallida" + err)
    }
}

module.exports = connectDB