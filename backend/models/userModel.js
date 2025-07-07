const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const bcrypt = require('bcrypt');
const validator = require('validator');
 
const userSchema = new Schema({
    username:{
        type: String,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
})

 userSchema.statics.register=async function(username, email, password) {
    try {
            if(!validator.isEmail(email)){
                throw new Error('Invalid email format');
            }

            if(!validator.isStrongPassword(password,{
                minLength: 8,
                minLowercase: 0,
                minUppercase: 0,
                minNumbers: 0,
                minSymbols: 0
            })){
                throw new Error('Password must be at least 8 characters long');
            }
       
        const hashPassword = await bcrypt.hash(password, 10);
        const user=new this({
            username,email,password:hashPassword
        })
        return await user.save();
    } catch (error) {
        throw new Error('Error registering user: ' + error.message);
    }
 }

 userSchema.statics.login=async function(email, password) {
    try {
        const user=await this.findOne({email});
        if(!user){
            throw new Error('Email not found');
        }

        const isPassword=await bcrypt.compare(password, user.password);
        if(!isPassword){
             throw new Error('Incorrect password');
        }
        return user;
    } catch (error) {
        throw new Error('Error logging in user: ' + error.message);
    }
 }

 userSchema.statics.getUser=async function(email) {
    try {
        return await this.findOne({email});
    } catch (error) {
        throw new Error('Error fetching users: ' + error.message);
    }
 }

 const userModal = mongoose.model('User', userSchema);
 module.exports = userModal;