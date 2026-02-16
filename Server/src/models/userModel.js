const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({

    email:{
        type:String,
        required: true,
        unique: true
    },
    name:{
        type: String,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required: true,
        minlength: [9, 'La contraseña debe tener al menos 8 caracteres'],
        validate:{
            validator: function(value){
                return /[A-Z]/.test(value)
            },
            message: 'La contraseña debe contener al menos una letra mayúscula'
        }
    },
    role:{
        type:String,
        enum: ['admin', 'user'], 
        default: 'user' 
    },
    resetPasswordToken:String,
    resetPasswordExpires: Date
})


// Generate password for the user
userSchema.pre('save', async function(next){
    if (!this.isModified('password')) return next

    try{
        const salt = await bcrypt.genSalt(12)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (error){
        next (error)
    }
})

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

userSchema.method.generatePasswordResetToken = function(){
    const token = crypto.randomBytes(20).toString('hex')
    this.resetPasswordToken = token
    this.resetPasswordToken = Date.now() + 3600000 
    return token
}

const userModel = mongoose.model('User', userSchema)
module.exports = userModel