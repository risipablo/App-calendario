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
        const {date} = req.query

        if(!date){
            return res.status(400).json({message: 'Fecha requerida'})
        }

        const startDate = new Date(date + "T00:00:00.000Z")
        const endDate = new Date(date + "T23:59:59.999Z")

        const events = await CalenderModel.find({
            date: {$gte: startDate, $lte:endDate}
        }).sort({priority: 1})

        res.json(events)
    } catch(err) {
        res.status(500).json({error: err.message})
    }
}

exports.addCalender = async (req,res) => {
    const {title,hour, date, category, priority } = req.body

    if(!title ||!hour|| ! date || !category || !priority){
        return res.status(400).json({message: 'completar todos los campos'})
    }

    try{
        const newNote = new CalenderModel({
            title,hour,date: new Date(date),category,priority
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
    const {title, priority,category,date,hour} = req.body

    if(!title || !category || !priority || !date || !hour){
        return res.status(400).json({message: 'completar todos los campos'})
    }

    try{
        const saveNote = await CalenderModel.findByIdAndUpdate(
            id,
            { title, priority, category, date, hour },
            { new: true }
        )
        res.json(saveNote)
    } catch(err){
        res.status(500).json({error:err.message})
    }
}

exports.deleteAllNotes = async (req,res) => {
    try{
        const result = await CalenderModel.deleteMany({})
        res.json(result)
    } catch(err){
        res.status(500).json({error: err.message})
    }
}