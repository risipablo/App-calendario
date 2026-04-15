const NoteModel = require("../models/noteModel");
const TodoModel = require("../models/taskModel");

exports.getNote = async(req,res) => {
    try{
        const note = await NoteModel.find({userId:req.user.id})
        res.json(note)
    }  catch (err) {
        res.status(500).json({error: err.message})
    }
}

exports.addNote = async(req,res) => {
    const {date,note,title,category} = req.body

    const noteContent = note || title  

    if(!date || !noteContent){
        return res.status(400).json({messages: 'Completar todos los campos requeridos'})
    }

    
    try{
        const noteDate = new Date(date)

        const newNote = new NoteModel({
            date:noteDate,
            title:noteContent,
            category: category || '',
            userId:req.user.id
        })
        
        const result = await newNote.save()
        res.json(result)
    }catch (err) {
        res.status(500).json({error: err.message})
    }
}

exports.deleteNote = async (req,res) => {
    const {id} = req.params

    try{
        const note = await NoteModel.findOneAndDelete({_id:id, userId: req.user.id})
        if(!note){
            return res.status(401).json({error:" Tarea no encontrada "})
        }
        res.json(note)
    } catch(err){
        res.status(500).json({error:err.message})
    } 
}


exports.deleteAllNote = async(req,res) => {
    try{
        const result = await NoteModel.deleteMany({userId:req.user.id})
        res.json(result)
    } catch(err){
        res.status(500).json/{error:err.message}
    }
}

exports.saveTask = async(req,res) => {
    const {id} = req.params
    const {date, title,category} = req.body

    if(!date || !title){
        return res.status(400).json({error:"completed the sections"})
    }

    try{
        const saveNote = await NoteModel.findOneAndUpdate(
            {_id:id, userId:req.user.id},
            {date,title,category},
            {new:true}
        )
        res.json(saveNote)
    } catch(err){
        res.status(500).json({error:err.message})
    }
    
}

exports.completedNote = async(req,res) => {
    const {id} = req.params
    
    try{
        const note = await NoteModel.findOne({_id:id,userId:req.user.id})

        if(!note){
            return res.status(404).json({error: 'note not found'})
        }

        note.completed = !note.completed

        await note.save()
        res.json(note)
    } catch(err){
        console.error(err.message)
    }
}