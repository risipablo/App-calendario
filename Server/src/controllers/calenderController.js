const CalenderModel = require('../models/calenderModel')

exports.getCalender = async(req,res) => {
    try{
        const calender = await CalenderModel.find().sort({date:1})
        res.json(calender)
    } catch(err){
        res.status(500).json({error: err.message})
    }
}

// today envents
exports.getTodayEvents = async(req,res) => {
    try{
        const today = new Date()
        today.setHours(0,0,0,0)

        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const events = await CalenderModel.find({
            date: {$gte: today, $lt: tomorrow}
        }).sort({priority: 1})

        res.json(events)
    }catch (err){
        res.status(500).json({error:err.message})
    }
}

exports.addCalender = async (req,res) => {
    const {title, date, category, priority } = req.body

    if(!title || ! date || !category || !priority){
        return res.status(400).json({message: 'completar todos los campos'})
    }

    try{
        const newNote = new CalenderModel({
            title,date: new Date(date),category,priority
        })
        const result = await newNote.save()
        res.status(201).json(result)

    } catch(err){
        res.status(500).json({error:err.message})
    }
} 

exports.deleteCalender = async (req,res) => {
    const {id} = req.params

    try{
        const notes = await CalenderModel.findByIdAndDelete(id)

        if(!notes){
            return res.status(401).json({error:"Nota no encontrada"})
        }
        
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

exports.saveCalender = async (req,res) => {
    const {id} = req.params
    const {title, priority,category} = req.body

    if(!title || !category || !priority){
        return res.status(400).json({message: 'completar todos los campos'})
    }

    try{
        const saveNote = await CalenderModel.findByIdAndUpdate(id,{
            title,priority,category
        })
        res.json(saveNote)
    } catch(err){
        res.status(500).json({error:err.message})
    }
}