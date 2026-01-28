const mongoose = require("mongoose")

const todoSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String, 
        required: true
    },
    priority: {
        type: String,
        enum: ['alta', 'media', 'baja'],
        default: 'media'
    },
    completed: {
        type: Boolean,
        default: false
    },
   
    subtaskTitles: {
        type: [String],
        default: []
    },
    subtaskPriorities: {
        type: [String],
        default: []
    },
    subtaskCompleted: {
        type: [Boolean],
        default: []
    },
    incompletedSubtask:{
        type:[Boolean],
        default:[]
    }
})

const TodoModel = mongoose.model('Task', todoSchema)
module.exports = TodoModel