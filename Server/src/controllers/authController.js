const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const rateLimit = require('express-rate-limit')
const { sendPasswordEmail } = require('../service/emailService')
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
            return res.status(400).json({error:"This name has exist "})
        }

        const newUser = new userModel({email,password,name})
        await newUser.save()
        
        res.status(201).json({ message: 'Success registration user'})
    } catch (err){
        console.log("Error en registro:", err)  
        res.status(500).json({error: 'Error', details: err.message}) 
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

        // res.cookie('token', token,{
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production', 
        //     sameSite: 'strict', 
        // })

        res.json({
            message: 'Success login', 
            token: token,  
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })


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

exports.changeUserName = async (req, res) => {
    const { newName } = req.body;  
    const userId = req.user.id;

    if (!newName ) {
        return res.status(400).json({ error: "El nuevo nombre y email son requeridos." });
    }

    try {

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }


        const nameExists = await userModel.findOne({ 
            name: newName, 
            _id: { $ne: userId }
         });

 
        user.name = newName;
        await user.save();

        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ 
            message: "Nombre de usuario actualizado exitosamente",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.changePassword = async (req,res) => {
    const {currentPasword, newPassword} = req.body
    const userId = req.user.id

    if(!currentPasword || !newPassword){
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
        const isMatch = await user.comparePassword(currentPasword)
        if (!isMatch){
            return res.status(401).json({error: 'Password incorrect'})
        }

        // hash and save the new password
        user.password = newPassword
        await user.save()
        res.status(200).json({message: "Password updated successfully"})

    } catch(err){
        res.status(500).json({error: err.message})
    }
}


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

exports.forgotPassword = async (req,res) => {
    const {email} = req.body

    if(!email){
        return res.status(400).json({error: 'El email es requerido'})
    }

    try{
        const user = await userModel.findOne({email})

        if(!user){
            return res.status(200).json({
                message: 'Si el correo existe, recibirás instrucciones para recuperar tu contraseña.' 
            })
        }

        const resetToken = crypto.randomBytes(32).toString('hex')

        const hashedToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

        user.resetPasswordToken = hashedToken
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000
        await user.save()

        await sendPasswordEmail(user.email, resetToken, user.name)
        res.status(200).json({ 
            message: 'Instrucciones enviadas a tu correo electrónico.' 
        });
    }  catch (err) {
        console.error('Error en forgotPassword:', err);
        res.status(500).json({ 
            message: "Error en el servidor. Intenta más tarde." 
        });
    }
}

exports.forgotPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 3, 
    message: { error: 'Demasiados intentos. Intenta nuevamente en una hora.' },
    standardHeaders: true,
    legacyHeaders: false,
})

exports.userName = async (req,res) => {
    try {
        
        const user = await userModel.findById(req.user.id).select('name email')
        if(!user){
            return res.status(404).json({error: 'user not found'})
        }
        res.status(200).json({user:{name:user.name, email:user.email}})
    
    } catch(err){
        res.status(500).json({error: err.message})
    }
}