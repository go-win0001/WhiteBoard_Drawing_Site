
const express = require('express');
const router= express.Router();
const {registerUser,loginUser}=require('../controller/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/login',(req, res) => {
    loginUser(req, res);
});
router.post('/register',(req, res) => {
    registerUser(req, res);
});

// router.get('/x',authMiddleware, (req, res) => {
//     res.status(200).json({message: `Hello ${req.user.username}, welcome to your profile!`, user: req.user});
// })

module.exports=router;