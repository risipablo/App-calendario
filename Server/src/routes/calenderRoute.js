const express = require('express')
const { getCalender, addCalender, deleteCalender, saveCalender, getTodayEvents, } = require('../controllers/calenderController')
const router = express.Router()

router.get('/calender', getCalender)
router.get('/today', getTodayEvents)
router.post('/calender', addCalender)
router.delete('/calender/:id', deleteCalender)
router.patch('/calender/:id', saveCalender)

module.exports = router