
const mongoose = require("mongoose")

const goalSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    priority: {
        type: String,
        enum: ['alta', 'media', 'baja'],
        default: 'media'
    },
    start_date:{
        type: Date,
        default: Date.now
    },
    completed: {
        type: Boolean,
        default: false
    },
    complete_note:{
        type:Date,
        default:null
    }
})

const GoalModel = mongoose.model('Goal', goalSchema)
module.exports = GoalModel