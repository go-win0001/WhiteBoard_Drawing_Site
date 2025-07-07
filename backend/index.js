const express= require('express');

const connect=require('./db')
const userRoutes=require('./routes/user');
const canvasRoutes=require('./routes/canvas');
const cors = require('cors');
require('dotenv').config()
const { Server } = require("socket.io");
const http = require("http");
const Canvas = require("./models/canvasModal");
const SECRET_KEY=process.env.JWT_SECRET
const jwt=require("jsonwebtoken");
const canvasModal = require('./models/canvasModal');
const app=express();

connect()
app.use(cors({
    cors: {
      origin: ["http://localhost:3000"], 
      methods: ["GET", "POST"],
    },
  }
));
app.use(express.json());

app.use('/api/users',userRoutes)
app.use('/api/canvas',canvasRoutes)

app.get('/',(req,res)=>{
    res.status(200).json({message: 'Welcome to the Canvas API!'});
})

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000"], 
      methods: ["GET", "POST"],
    },
  });


let canvasData = {};

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
  
    socket.on("joinCanvas", async ({ canvasId }) => {
        // console.log("Joining canvas:", canvasId);
        try {
          const canvas= await canvasModal.findById(canvasId);
        socket.join(canvasId);
        console.log(`User ${socket.id} joined canvas ${canvasId}`);
  
        if (canvasData[canvasId]) {
            // console.log(canvasData)
          socket.emit("loadCanvas", canvasData[canvasId]);
        } else {
          socket.emit("loadCanvas", canvas.elements);
        }
      } catch (error) {
        console.error(error);
        socket.emit("error", { message: "An error occurred while joining the canvas." });
        }
    });

    socket.on("drawingUpdate", async ({ canvasId, elements }) => {
        try {
          canvasData[canvasId] = elements;
    
          socket.to(canvasId).emit("receiveDrawingUpdate", elements);
    
          const canvas = await canvasModal.findById(canvasId);
          if (canvas) {
            // console.log('updating canvas... ', i++)
            await Canvas.findByIdAndUpdate(canvasId, { elements }, { new: true, useFindAndModify: false });
          }
        } catch (error) {
          console.error(error);
        }
      });
    
      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

const PORT=process.env.PORT;
server.listen(PORT,()=>{
    console.log(`Server is running on port http://127.0.0.1:${PORT}`);
});
