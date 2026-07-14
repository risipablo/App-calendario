const GoalModel = require("../models/goalModel")

exports.getGoal = async (req,res) => {
    try{
        const goal = await GoalModel.find({userId: req.user.id})
        res.json(goal)
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}

exports.addGoal = async (req,res) => {
    const {start_date, title, description,priority} = req.body

    if(!start_date || !title || !description || !priority){
        return res.status(400).json({ message: "Completar todos los campos"})
    }

    try{
        const newGoal = new GoalModel({
            title,start_date,description,priority, userId:req.user.id
        })
        const result = await newGoal.save()
        res.json(result)
    } catch (err) {
        res.status(500).json({ error: err.message})
    }
}

exports.deleteGoal = async (req,res) => {
    const {id} = req.params

    try{
        const goal = await GoalModel.findOneAndDelete({_id:id, userId: req.user.id})

        if(!goal){
            return res.status(404).json({error: "Error delete goal"})
        }

        res.json(goal)
    } catch(err){
        res.status(500).json({error:err.message})
    }
}

exports.deleteAllGoal = async (req,res) => {
    try{
        const result = await GoalModel.deleteMany({userId: req.user.id})
        res.json(result)
    } catch (err){
        res.status(500).json({error: err.message})
    }
}

exports.deleteGoalFilter = async (req, res) => {
    const userId = req.user.id
    const { filterType, month, year } = req.query
    
    try {
        if (!filterType) {
            return res.status(400).json({ error: 'Se requiere filterType' })
        }
        
        let filter = { userId }
        
        if (['alta', 'media', 'baja'].includes(filterType)) {
            filter.priority = filterType
        } else if (filterType === 'completadas') {
            filter.completed = true
        } else if (filterType === 'pendientes') {
            filter.completed = false
        } else if (filterType === 'fechas') {
            if (!month && !year) {
                return res.status(400).json({ error: 'Se requiere mes o año' })
            }

            if (month && year) {
                const startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
                const endDate = new Date(parseInt(year), parseInt(month), 1)
                filter.start_date = { $gte: startDate, $lt: endDate }
            } else if (year) {
                const startDate = new Date(parseInt(year), 0, 1)
                const endDate = new Date(parseInt(year) + 1, 0, 1)
                filter.start_date = { $gte: startDate, $lt: endDate }
            } else if (month) {
                filter.$expr = { $eq: [{ $month: '$start_date' }, parseInt(month)] }
            }
        } else {
            return res.status(400).json({ error: 'filtro no válido' })
        }
        
        const result = await GoalModel.deleteMany(filter)
        
        res.json({
            message: `${result.deletedCount} metas eliminadas`,
            deletedCount: result.deletedCount
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
}

exports.saveGoal = async (req,res) => {
    const {id} = req.params
    const { title, description,priority, target_date, start_date} = req.body

    if(!title){
        return res.status(400).json({error: "El título es requerido"})
    }

    try{
        const goalSave = await GoalModel.findOneAndUpdate(
            {_id: id, userId: req.user.id},
            {target_date,description,title,priority,start_date},
            {new:true}
        )

        if(!goalSave){
            return res.status(404).json({error: "Goal not found"})
        }

        res.json(goalSave)
    } catch(err){
        res.status(500).json({error:err.message})
    }
}

exports.completedGoal = async (req,res) => {
    const {id} = req.params

    try{
        const goal = await GoalModel.findOne({_id: id, userId: req.user.id},)

        if(!goal){
            return res.status(404).json({error: "goal not found"})
        }

        const wasCompleted = goal.completed
        goal.completed = !goal.completed

        if( goal.completed && !wasCompleted){
            goal.complete_note = new Date()
            
        }

        if(!goal.completed && wasCompleted){
            goal.complete_note = null
            
        }

        await goal.save()

        const updatedGoal = await GoalModel.findById(id);

        res.json(updatedGoal)
    
    }catch (err) {
        console.error(err.message)
    } 
}


