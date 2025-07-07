const jwt=require('jsonwebtoken');
const userModel = require('../models/userModel')
require('dotenv').config();

const authMiddleware=async (req, res, next)=>{
    try {
        const token= req.headers.authorization;
        
        if(!token){
            return res.status(401).json({message: 'No token provided'});
        }
        const decoded=jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({message: 'Invalid token'});
        }
        const user=await userModel.getUser(decoded.email);
        // req.user=decoded;
        req.user=user;
        // res.status(200).json({message: 'Authenticated successfully', user: user});
        next();
    } catch (error) {
        res.status(500).json({message: 'AUthentication failed'});
    }
    
}

module.exports=authMiddleware;