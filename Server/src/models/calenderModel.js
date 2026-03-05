
const mongoose = require('mongoose')

const calendarSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
    },
    hour:{
        type:String,
        required:true
    },
    date:{
        type: Date,
        default: Date.now
    },
    category:{
        type:String,
        enum: ['salud', 'deporte', 'trabajo', 'estudio', 'personal', 'ocio','finanzas', 'otros'],
        default:'personal'
    },
    priority: {
        type: String,
        enum: ['alta', 'media', 'baja'],
        default: 'media'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
     
})

const CalendarModel = mongoose.model('Calendar', calendarSchema)
module.exports = CalendarModel