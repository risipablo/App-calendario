const express = require('express')

const upload = require('../middleware/upload') 
const { uploadProfileImage, deleteProfileImage, getProfileImage } = require('../controllers/imageController');
const { protect } = require('../middleware/authMiddleware');


const router = express.Router()


router.post('/upload-avatar', protect,upload.single('avatar'), uploadProfileImage)
router.delete('/delete-avatar',protect, deleteProfileImage)
router.get('/get-avatar', protect,getProfileImage)

module.exports = router