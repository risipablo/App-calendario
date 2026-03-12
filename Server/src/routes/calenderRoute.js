const express = require('express')
const { getCalender, addCalender, deleteCalender, saveCalender, getTodayEvents, deleteAllNotes, } = require('../controllers/calenderController')
const { protect } = require('../middleware/authMiddleware')
const router = express.Router()

router.get('/calendar',protect, getCalender)
router.get('/calendar/today',protect, getTodayEvents)
router.post('/calendar', protect, addCalender)
router.delete('/calendar/:id',protect, deleteCalender)
router.delete('/calendar', protect,deleteAllNotes)
router.patch('/calendar/:id', protect,saveCalender)

module.exports = router