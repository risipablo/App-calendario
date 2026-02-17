const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

exports.registerUser = async(req,res) => {
    const {email, password, name} = req.body

    if(!email || !password || !name){
        return res.status(400).json({error: "Complete all field"})
    }

    try{
        const userExists = await userModel.findOne({email})
        const nameExists = await userModel.findOne({name})

        if(userExists){
            return res.status(400).json({error: "This email has exist "})
        } else if (nameExists){
            return res.status(400).json({erro:"This name has exist "})
        }

        const newUser = new userModel({email,password,name})
        await newUser.save()
        
        res.status(201).json({ message: 'Success registration user'})
    } catch (err){
        res.status(500).json({error: 'Error'})
    }
}

// 5 try of login
exports.loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {error: "A many tries have failed, try later"}
})


exports.loginUser = async (req,res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({error: "Completed all the field"})
    }

    try{
        const user = await userModel.findOne({email})

        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error: "Incorrect credentials" })
        }

        // create access token
        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET,{ expiresIn: '1h' })

        res.cookie('token', token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict', 
        })

        res.json({message: 'Seccess login', user:{
            id: user._id,
            name: user.name,
            email: user.email
        }})

    } catch(err){
        res.status(500).json({error: "Error in the server: " + err.message})
    }
}

exports.logoutUser = (req,res) => {
    res.clearCookie('token',{
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    })
    res.json({ message: 'Success logout'})
}


exports.verifyEmail = async (req,res) => {
    const {email} = req.body

    try{
        const user = await userModel.findOne({email, _id: req.user.id})

        if(!user){
            return res.status(404).json({message: 'Incorrect Email'})
        }
        res.status(200).json({message:'Verified Email', userId: user._id})
    
    } catch (error){
        res.status(500).json({message: 'Error in the server'})
    }
}

exports.changeUserName = async (req,res) => {
    const {newName} = req.body
    const userId = req.user.id

    if(!newName){
        return res.status(400).json({error: "The new name is required."})
    }

    try{
        const user = await userModel.findById(userId)
        if(!user){
            return res.status(404).json({error: 'User not found'})
        }

        const nameExists = await userModel.findOne({name:newName})
        if(nameExists){
            return res.status(400).json({error: 'This name exist, put anothe one'})
        }

        user.name = newName
        await user.save()
        res.status(200).json({message: "Username update successfully"})
    
    } catch(err){
        res.status(500).json({err})
    }
}

exports.changePassword = async (req,res) => {
    const {currentPassword, newPassword} = req.body
    const userId = req.user.id

    if(!currentPassword || !newPassword){
        return res.status(400).json({error: "both password are required"})
    }

    if(newPassword.length < 9){
        return res.status(400).json({error: 'The new password must have equal o more 9 letters'})
    }

    try{
        const user = await userModel.findById(userId)
        if (!user){
            return res.status(404).json({error: 'user not found'})
        }

        // checkout the passwords
        const isMatch = await user.comparePassword(currentPassword)
        if (!isMatch){
            return res.status(401).json({error: 'Password incorrect'})
        }

        // hash and save the new password
        user.password = newPassword
        await user.save()
    
    } catch(err){
        res.status(500).json({error: err.message})
    }
}

exports.forgotPassword = async (req,res) => {
    const {email} = req.body

    try{
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(200).json({ message: 'That email exists, you will receive instructions'})
        }

        const token = crypto.randomBytes(20).toString('hex')
        user.resetPasswordToken = token
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000
        await user.save()
        
        res.status(200).json({ message: 'Reset token generated' })
    
    } catch(err){
        res.status(500).json({ message: "Error in the server", error:err})
    }
}

exports.forgotPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 3,
    message: { error: 'Too many requests, try again later' }
})

exports.resetPassword = async (req,res) => {
    const {token, newPassword} = req.body

    if (!newPassword || newPassword.length < 9) {
        return res.status(400).json({ error: 'Password must be at least 9 characters' })
    }

    try{
        const user = await userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: {$gt: Date.now()}
        })

        if(!user){
            return res.status(400).json({message: 'Invalidad or expire token'})
        }

        user.password = newPassword
 

        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined
        await user.save()
        res.json({message: 'Success update password'})
    } catch (error) {
        res.status(500).json({ message: "Error in the server", error: error.message });
    }
}

exports.userName = async (req,res) => {
    try {
        
        const user = await userModel.findById(req.user.id).select('name')
        if(!user){
            return res.status(404).json({error: 'user not found'})
        }
        res.status(200).json({user:{name:user.name}})
    
    } catch(err){
        res.status(500).json({error: err.message})
    }
}