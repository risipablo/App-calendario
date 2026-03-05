const express = require('express')
const { getGoal, addGoal, deleteGoal, deleteAllGoal, saveGoal, completedGoal } = require('../controllers/goalController')
const { protect } = require('../middleware/authMiddleware')
const router = express.Router()

router.get('/goal', protect, getGoal)
router.post('/goal', protect,addGoal)
router.delete('/goal/:id', protect,deleteGoal)
router.delete('/goal',protect, deleteAllGoal)
router.patch('/goal/:id', protect,saveGoal)
router.patch('/goal/:id/completedGoal', protect,completedGoal)

module.exports = router