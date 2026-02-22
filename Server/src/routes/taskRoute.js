const express = require('express')
const { getTask, addTask, addMoreTask, deleteTask, deleteSubTask, deleteAllTask, completeSubTask, editSubtask, completeAllTask, completePrincipalTask, saveTask, deletePrincipalTask, incompleteSubTask, } = require('../controllers/taskController')
const router = express.Router()

router.get('/task',getTask)
router.post('/task', addTask)
router.post('/task/:id/addtask', addMoreTask)
router.delete('/task/:id', deleteTask)

router.delete('/task/:id/subtask/:subTaskIndex', deleteSubTask)
router.delete('/task', deleteAllTask)
router.patch('/task/:id', saveTask)
router.patch('/task/:id/subtask/:subTaskIndex', editSubtask)
router.patch('/task/:id/completeAllTask', completeAllTask) 
router.patch('/task/:id/completedTask', completePrincipalTask)
router.patch('/task/:id/subtask/:subTaskIndex/toggle', completeSubTask)
router.patch('/task/:id/subtask/:subTaskIndex/incomplete', incompleteSubTask)


module.exports = router