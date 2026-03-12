const express = require('express')
const { getTask, addTask, addMoreTask, deleteTask, deleteSubTask, deleteAllTask, completeSubTask, editSubtask, completeAllTask, completePrincipalTask, saveTask, deletePrincipalTask, incompleteSubTask, } = require('../controllers/taskController')
const { protect } = require('../middleware/authMiddleware')
const router = express.Router()

<<<<<<< HEAD
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
=======
router.get('/task', protect,getTask)
router.post('/task', protect,addTask)
router.post('/task/:id/addtask', protect,addMoreTask)
router.delete('/task/:id', protect,deleteTask)
router.delete('/task/:id/principal', protect,deletePrincipalTask)
router.delete('/task/:id/subtask/:subTaskIndex', protect,deleteSubTask)
router.delete('/task', protect,deleteAllTask)
router.patch('/task/:id',protect, saveTask)
router.patch('/task/:id/subtask/:subTaskIndex', protect,editSubtask)
router.patch('/task/:id/completeAllTask', protect,completeAllTask) 
router.patch('/task/:id/completedTask', protect,completePrincipalTask)
router.patch('/task/:id/subtask/:subTaskIndex/toggle', protect,completeSubTask)
router.patch('/task/:id/subtask/:subTaskIndex/incomplete', protect,incompleteSubTask)
>>>>>>> feature/auth


module.exports = router