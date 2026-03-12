const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel');

exports.protect = async (req,res,next) => {

    let token;

    if(req.cookies?.token){
        token = req.cookies.token
    }

    else if (req.headers.authorization?.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }

    if(!token){
        return res.status(401).json({error: 'Not authorized. Invalid Token'})
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // checkout id in the DB, if exist 
        if (!decoded?.id) {
            return res.status(401).json({ error: 'Invalid token payload' });
        }

        const user = await userModel.findById(decoded.id).select('-password')

        if (!user){
            return res.status(401).json({error: "User not found"})
        }

        if(user.passwordChangedAt){
            const changed = parseInt(user.passwordChangedAt.getTime() / 100,10)
            if(decoded.iat < changed){
                return res.status(401).json({ error: 'Session expired. Please login again' });
            }
        }

        req.user = user
        next()
    } catch (err){
        if (err.name === 'TokenExpiredError'){
            return res.status(401).json({error: 'Token expired, please login again'})
        }
        return res.status(401).json({error: 'Invalid token'})
    }
}