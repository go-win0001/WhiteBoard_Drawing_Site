const canvas= require('../models/canvasModal');

const getUserCanvas=async (req,res)=>{
    try{
        const userId=req.user._id;
        const newCanvas=await canvas.getUserCanvas(userId);
        if(newCanvas.length === 0){
            return res.status(200).json({message: 'add canvas'});
        }
        res.status(200).json({newCanvas,username: req.user.username});
    }catch(error){
        res.status(400).json({message: error.message});
    }
}

const createCanvas=async (req,res)=>{

    try {
        const userId = req.user._id;  // req is updated by authmiddleware after receiveing token
        const { name } = req.body;
        const data = await canvas.createCanvas(userId, name);
        res.status(201).json({message: 'Canvas created successfully', data});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

const loadCanvas=async (req,res)=>{
    try{
        
        const canvasId=req.params.id;
        const userId=req.user._id;
        const newCanvas=await canvas.loadCanvas(userId,canvasId);
        res.status(200).json(newCanvas);

    }catch(error){
        res.status(400).json({message: error.message});
    }
}

const updateCanavs=async (req,res)=>{
    const canvasId = req.params.id;
    const userId= req.user._id;  // req is updated by authmiddleware after receiving token
    const {elements} = req.body;
    try {
        const message = await canvas.updateCanvas(canvasId, userId, elements);
        res.status(200).json({
            message: message,
            canvasId,
            userId,
            elements
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
            
});
    }
}

const deleteCanvas=async (req,res)=>{
    try {
        const canvasId = req.params.id; 
        const userId= req.user._id;  // req is updated by authmiddleware after receiving token
        const msg=await canvas.deleteCanvas(canvasId, userId);
        res.status(200).json(msg);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

const shareCanvas=async (req,res)=>{
    try {
        const canvasId = req.params.id;
        const email= req.user.email;  // req is updated by authmiddleware after receiving token
        const {shareWith} = req.body; // shareWith should be an array of emails
        console.log(shareWith);
        const updatedCanvas = await canvas.shareCanvas(canvasId, email, shareWith);
        res.status(200).json({message: 'Canvas shared successfully',updatedCanvas});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

module.exports={getUserCanvas,createCanvas,loadCanvas,updateCanavs,deleteCanvas,shareCanvas};