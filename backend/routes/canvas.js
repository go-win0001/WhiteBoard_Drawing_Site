const express = require('express');
const router= express.Router();

const { getUserCanvas,createCanvas,loadCanvas,updateCanavs,deleteCanvas,shareCanvas } = require('../controller/canvasController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/',authMiddleware,(req,res)=>{
    getUserCanvas(req, res);
})

router.post('/',authMiddleware,(req,res)=>{
    createCanvas(req, res);
})
router.get('/load/:id',authMiddleware,(req,res)=>{   //sended a req ar params
    loadCanvas(req, res);
})

//rote to update canvas
router.put('/:id', authMiddleware, (req, res) => {
    updateCanavs(req, res);
});

router.delete('/:id', authMiddleware, (req, res) => {
    deleteCanvas(req, res);
})

router.put('/share/:id', authMiddleware, (req, res) => {
    // This route is for sharing canvas with o
    shareCanvas(req, res); 
    });

module.exports = router;