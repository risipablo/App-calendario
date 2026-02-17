const express = require('express')
const { protect } = require('../middleware/authMiddleware')
const router = express.Router()

router.get('/validate-token', protect,(req,res) => {
    res.status(200).json({
        success:true,
        user:{
            id: req.user._id,
            name: req.user.name,
            email: req.user.email
        },
        tokenValidad:true,
        expiresIn: req.user.tokenExpiry
    })
})

module.exports = router