const TodoModel = require("../models/taskModel")

// get task
exports.getTask = async (req,res) => {
    try{
        const task = await TodoModel.find()
        res.json(task)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

// add task
exports.addTask = async (req,res) => {
    const {date,title, priority} = req.body

    if(!date || !title || !priority) {
        return res.status(400).json({messages: 'Completar todos los campos requeridos'})
    }

    try{
        const taskDate = new Date(date)

        const newTask = new TodoModel({
            date:taskDate,title,priority
        })

        const result = await newTask.save()
        res.json(result)

    } catch (errr) {
        res.status(500).json({error: err.message})
    }
}

// add more task in the same day
exports.addMoreTask = async (req,res) => {
    const {id} = req.params
    const {title, priority} = req.body

    if(!title, !priority){
        return res.status(400).json({error: "Faltan datos"})
    }

    try{
        const task = await TodoModel.findById(id)

        if(!task){
            return res.status(404).json({error: "Tarea no encontrada"})
        }


        task.subtaskTitles.push(title)
        task.subtaskPriorities.push(priority)
        // task.subtaskCompleted.push(false) 

        const updateTask = await task.save()
        res.json(updateTask)

    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

// delete complete task
exports.deleteTask = async (req,res) => {
    const {id} = req.params

    try{
        const task = await TodoModel.findByIdAndDelete(id)
        if(!task){
            return res.status(401).json({error:" Tarea no encontrada "})
        }
        res.json(task)
    } catch(err){
        res.status(500).json({error:err.message})
    } 
}

// delete principal task
exports.deletePrincipalTask = async(req,res) => {
    const {id} = req.params

    try{
        const task = await TodoModel.findById(id)

        if(!task){
            return res.status(404).json({error: "Task principal not found"})
        }

        if(!task.subtaskTitles || task.subtaskTitles.length === 0)
            return res.json({
            message: "Task deleted",
            deleted: true
        })

        // convertir las subtask como principal tarea
        const taskTitle = task.subtaskTitles[0]
        const taskPriority = task.subtaskPriorities?.[0] || 'media'
        const taskCompleted = task.subtaskCompleted?.[0] || false

        task.title = taskTitle
        task.priority = taskPriority
        task.completed = taskCompleted

        // Eliminar la primera subtarea de los array
        task.subtaskTitles.splice(0, 1);
        if (task.subtaskPriorities && task.subtaskPriorities.length > 0) {
            task.subtaskPriorities.splice(0, 1);
        }
        if (task.subtaskCompleted && task.subtaskCompleted.length > 0) {
            task.subtaskCompleted.splice(0, 1);
        }

        await task.save()

        res.json({
    
            updatedTask: task,
            deletedSubtask: {
                title: taskTitle,
                priority: taskPriority,
                completed: taskCompleted
            }
        })

     } catch (err){
        console.error(err)
     }
}

// delete subtask
exports.deleteSubTask = async (req,res) => {

    const {id,subTaskIndex} = req.params

    try{
        const task = await TodoModel.findById(id)

        if(!task){
            return res.status(404).json({error: "Tarea no encontrada"})
        }

        const index = parseInt(subTaskIndex)

        task.subtaskTitles.splice(index,1)
        task.subtaskPriorities.splice(index,1)
        
        if(task.subtaskCompleted && task.subtaskCompleted.length > index) {
            task.subtaskCompleted.splice(index,1)
        }

        const updateTask = await task.save()
        res.json(updateTask)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

// delete all 
exports.deleteAllTask = async (req,res) => {
    try{
        const result = await TodoModel.deleteMany({})
        res.json(result)
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}

// edit and save principal task,only date
exports.saveTask = async (req,res) => {
    const {id} = req.params
    const {date, title, priority} = req.body
    
     if (!date || !title || !priority) {
        return res.status(400).json({error:"completed the sections"})
    }

    try{
        // const updateDate = new Date(date)

        const saveTask = await TodoModel.findByIdAndUpdate(id,{date, title, priority}, {new:true})
        res.json(saveTask)
    
    } catch(err) {
        res.status(500).json({error:err.message})
    }
}

// edit subtask
exports.editSubtask = async (req,res) => {
    const {id,subTaskIndex} = req.params;
    const updates = req.body;

    try{
        const task = await TodoModel.findById(id)
        if(!task) return res.status(404).json({error: "Tarea no encontrada"})
            
        const index = parseInt(subTaskIndex)

        if (index < 0 || index >= task.title.length){
            return res.status(400).json({error: "Indice de subtarea invalido"})
        }

        if (updates.title !== undefined) task.subtaskTitles[index] = updates.title
        if (updates.priority !== undefined) task.subtaskPriorities[index] = updates.priority


        const updateTask = await task.save()
        res.json(updateTask)
    
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}


exports.completeAllTask = async (req,res) => {
    const { id } = req.params
    
    try {
        const task = await TodoModel.findById(id)
        if (!task) {
            return res.status(404).json({ error: "Tarea no encontrada" })
        }

       
        const newCompletedState = !task.completed
        
        if (!task.subtaskTitles || task.subtaskTitles.length === 0) {
            task.completed = newCompletedState
            await task.save()
            return res.json(task)
        }
        
        
        task.completed = newCompletedState
        
        
        if (!task.subtaskCompleted || task.subtaskCompleted.length === 0) {
            task.subtaskCompleted = new Array(task.subtaskTitles.length).fill(false)
        }
        
        
        while (task.subtaskCompleted.length < task.subtaskTitles.length) {
            task.subtaskCompleted.push(false)
        }
        
        
        for (let i = 0; i < task.subtaskTitles.length; i++) {
            task.subtaskCompleted[i] = newCompletedState
        }

        await task.save()
        res.json(task)

    } catch (err) {
        console.error(err.message)
        res.status(500).json({ error: "Error actualizando las tareas" })
    }
}

// completed principal task
exports.completePrincipalTask = async (req,res) => {
    const {id} = req.params

    try{
        const task = await TodoModel.findById(id)

        if(!task){
            return res.status(404).json({error: "task not found"})
        }

        task.completed = !task.completed
        await task.save()
        res.json(task)
    } catch (err) {
        console.error(err.message)
    }
}

// complete subtask
exports.completeSubTask = async (req,res) => {
    const {id,subTaskIndex} = req.params

    try{
        const task = await  TodoModel.findById(id)
        if(!task){
            return res.status(404).json({error: "Tarea no encontrada"})
        }

        const index = parseInt(subTaskIndex)
        
        // Valor indicie
        if(index < 0 || index >= (task.title?.length || 0)){
            return res.status(400).json({ error: "Índice de subtarea inválido" })
        }

        // Se inicia el array si no existe
        if(!task.subtaskCompleted || task.completed.length === 0){
            task.subtaskCompleted = new Array(task.title.length).fill(false)
        }


        while (task.subtaskCompleted.length < task.title.length){
            task.subtaskCompleted.push(false)
        }

        task.subtaskCompleted[index] = !task.subtaskCompleted[index]

        const updatedTask = await task.save()
        res.json(updatedTask)

    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

exports.incompleteSubTask = async (req,res) => {
    const {id, subTaskIndex} = req.params

    try{
        const task = await TodoModel.findById(id)

        if(!task){
            return res.status(404).json({error: 'Task not found'})
        }

        const index = parseInt(subTaskIndex)

        if(index < 0 || index >= (task.subtaskTitles?.length || 0)){
            return res.status(400).json({ error: "Índice de subtarea inválido" })
        }


        if(!task.incompletedSubtask){
            task.incompletedSubtask = new Array(task.subtaskTitles.length).fill(false)
        }

        if(!task.subtaskCompleted){
            task.subtaskCompleted = new Array(task.subtaskTitles.length).fill(false)
        }

        while(task.incompletedSubtask.length < task.subtaskTitles.length){
            task.incompletedSubtask.push(false)
        }


        while(task.subtaskCompleted.length < task.subtaskTitles.length){
            task.subtaskCompleted.push(false)
        }

        task.incompletedSubtask[index] = !task.incompletedSubtask[index]

        if(task.incompletedSubtask[index]){
            task.subtaskCompleted[index] = false
        }

        const updatedTask = await task.save()
        res.json(updatedTask)

    } catch(err){
        res.status(500).json({error:err.message})
    }
}