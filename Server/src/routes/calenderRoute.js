const express = require('express')
const { getCalender, addCalender, deleteCalender, saveCalender, getTodayEvents, deleteAllNotes, } = require('../controllers/calenderController')
const router = express.Router()

router.get('/calendar', getCalender)
router.get('/calendar/today', getTodayEvents)
router.post('/calendar', addCalender)
router.delete('/calendar/:id', deleteCalender)
router.delete('/calendar', deleteAllNotes)
router.patch('/calendar/:id', saveCalender)

module.exports = router