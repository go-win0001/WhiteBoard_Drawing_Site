const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const registerUser=async (req,res)=>{
    try {
        const {username,email,password} = req.body;
        const user= await userModel.register(username,email, password);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({message: error.message});
    }   
}


const loginUser=async (req,res)=>{
    try {
        const {email,password} = req.body;
        // console.log(email, password);
        const user= await userModel.login(email, password);
        const payload={
            userId:user._id,
            email:user.email,
            password:user.password
        };
        // const token=jwt.sign(payload,process.env.JWT_SECRET);
        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '2h' } // Token expires in 24 hours
            );
        res.status(201).json({token:token});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}



module.exports = {registerUser, loginUser};