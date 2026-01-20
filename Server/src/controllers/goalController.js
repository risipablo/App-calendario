const GoalModel = require("../models/goalModel")

exports.getGoal = async (req,res) => {
    try{
        const goal = await GoalModel.find()
        res.json(goal)
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}

exports.addGoal = async (req,res) => {
    const {start_date, title, priority} = req.body

    if(!start_date || !title || !priority){
        return res.status(400).json({ message: "Completar todos los campos"})
    }

    try{
        const newGoal = new GoalModel({
            title,start_date,priority
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
        const goal = await GoalModel.findByIdAndDelete(id)

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
        const result = await GoalModel.deleteMany({})
        res.json(result)
    } catch (err){
        res.status(500).json({error: err.message})
    }
}

exports.saveGoal = async (req,res) => {
    const {id} = req.params
    const { title, priority, target_date, start_date} = req.body

    if(!title){
        return res.status(400).json({error: "El título es requerido"})
    }

    try{
        const goalSave = await GoalModel.findByIdAndUpdate(
            id, 
            {target_date,title,priority,start_date},
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
        const goal = await GoalModel.findById(id)

        if(!goal){
            return res.status(404).json({error: "goal not found"})
        }

        goal.completed = !goal.completed
        goal.completed = newCompletedState
        goal.complete_note = newCompletedState ? new Date() : null


        await goal.save()
        res.json(goal)
    
    }catch (err) {
        console.error(err.message)
    } 
}


