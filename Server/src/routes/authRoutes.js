const express = require('express')
const authController = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')
const router = express.Router()

router.post('/register', authController.registerUser)
router.post('/login', authController.loginLimiter, authController.loginUser,)
router.post('/logout', protect,authController.logoutUser)
router.post('/forgot-password', authController.forgotPassword,  authController.forgotPasswordLimiter)
router.patch('/reset-password', authController.resetPassword)
router.post('/verify-email', protect,authController.verifyEmail)
router.patch('/change-password', protect, authController.changePassword)
router.patch('/change-user', protect, authController.changeUserName)
router.get('/name', protect, authController.userName)

module.exports = router