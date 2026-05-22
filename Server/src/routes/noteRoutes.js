const express = require('express')
const { protect } = require('../middleware/authMiddleware');
const { getNote, addNote, deleteNote, deleteAllNote, saveTask, completedNote, deleteNoteFilter } = require('../controllers/noteController');
const router = express.Router()

router.get('/note',protect, getNote)
router.post('/note', protect, addNote)
router.delete('/note/filter', protect, deleteNoteFilter)
router.delete('/note/:id', protect, deleteNote)
router.delete('/note', protect, deleteAllNote)
router.patch('/note/:id', protect,saveTask)
router.patch('/note/:id/completed', protect,completedNote)

module.exports = router