const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    date:{
        type:Date,
        default: Date.now
    },
    title:{
        type:String,
        required:false
    },
    category:{
        type:String,
        required:false
    },
    completed: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const NoteModel = mongoose.model('Note',noteSchema)
module.exports = NoteModel