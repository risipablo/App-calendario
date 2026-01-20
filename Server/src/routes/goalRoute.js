const express = require('express')
const { getGoal, addGoal, deleteGoal, deleteAllGoal, saveGoal, completedGoal } = require('../controllers/goalController')
const router = express.Router()

router.get('/goal', getGoal)
router.post('/goal', addGoal)
router.delete('/goal/:id', deleteGoal)
router.delete('/goal', deleteAllGoal)
router.patch('/goal/:id', saveGoal)
router.patch('/goal/:id/completedGoal', completedGoal)

module.exports = router