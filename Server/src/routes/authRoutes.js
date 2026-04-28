const express = require('express')
const authController = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')
const { EmailComment } = require('../controllers/resendController')
const { authGuard } = require('../config/passport');
const router = express.Router()

router.post('/register', authController.registerUser)
router.post('/login',authController.loginUser,)
router.post('/logout', protect,authController.logoutUser)
router.post('/forgot-password', authController.forgotPasswordLimiter,authController.forgotPassword)
router.patch('/reset-password', authController.resetPassword)
router.post('/verify-email', protect,authController.verifyEmail)
router.patch('/change-password', protect, authController.changePassword)
router.patch('/change-user', protect, authController.changeUserName)
router.get('/name', protect, authController.userName)
router.delete('/delete-user', protect,authController.userDeleteCount)
router.post('/send-email',EmailComment)

// google
router.get('/google', authController.googleLogin)
router.get('/google/callback', authController.googleCallback)


// uso de passport jwt
router.get('/profile', authGuard, (req, res) => {
    res.json({ user: req.user });
});

module.exports = router