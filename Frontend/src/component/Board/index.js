
import { useContext, useEffect, useLayoutEffect, useRef } from 'react';
import rough from 'roughjs';
import BoardContext from '../store/board-context';
import { TOOL_ACTION_TYPES, TOOL_ITEMS } from '../../constants';
import ToolBoxContext from '../store/toolbox-context';
import classes from './index.module.css'
import updateCanvas from '../../utils/updateCanvs';
import socket from '../../utils/socket';
import axios from 'axios';
import Button from '../Button';

function Board({id}) {

  const canvasRef=useRef();
  const textAreaRef=useRef();
  const {
    elements,
    toolActionType,
    boardMouseDownHandler,
    boardMouseMoveHandler,
    boardMouseUpHandler,
    textAreaBlurHandler,
    setElements,
    setHistory
  }=useContext(BoardContext);

  const {toolBoxState}=useContext(ToolBoxContext);
 

  useEffect(() => {
    
    if (id) {
      if(!socket.connected){
         socket.connect();
      }
      
      // Join the canvas room (no need for userId)
      socket.emit("joinCanvas", { canvasId: id });

      // Listen for updates from other users
      socket.on("receiveDrawingUpdate", (updatedElements) => {
        setElements(updatedElements);
      });

      socket.on("unauthorized", (data) => {
        console.log(data.message);
        alert("Access Denied: You cannot edit this canvas.");
       
      });

      return () => {
        socket.off("receiveDrawingUpdate");
        socket.off("loadCanvas");
        socket.off("unauthorized");
      };
       
    }
  }, [id]);

  useEffect(() => {
    const fetchCanvasData = async () => {
      if (id) {
        try {
          const token=localStorage.getItem("token")
          const response = await axios.get(`http://localhost:3030/api/canvas/load/${id}`, {
            headers: { authorization: `${token}` },
          });
          // setCanvasId(id); // Set the current canvas ID
          setElements(response.data.elements); // Set the fetched elements
          setHistory(response.data.elements); // Set the fetched elements
        } catch (error) {
          console.error("Error loading canvas:", error);
        } finally {
        }
      }
    };

    fetchCanvasData();
  }, [id]);

  const setSize=(canvas)=>{
      canvas.width=window.innerWidth;
      canvas.height=window.innerHeight;
  }

  useLayoutEffect(()=>{
    const canvas=canvasRef.current;
    setSize(canvas);
    const context=canvas.getContext('2d')
    let roughCanvas = rough.canvas(canvas);




    elements.forEach(element=>{
      switch (element.type) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.CIRCLE:
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.ARROW:{
          roughCanvas.draw(element.roughEle)
          break;
        }
        case TOOL_ITEMS.BRUSH:{ //code is from library perfect freehand
          context.fillStyle=element.stroke; 
          context.fill(element.path);
          context.restore();
          break;
        }
        case TOOL_ITEMS.TEXT:{
          context.textBaseline = "top";
          context.font = `${element.size}px Caveat`;
          context.fillStyle = element.stroke;
          context.fillText(element.text, element.x1, element.y1);
          context.restore();
          break;
        }
        default:
          throw new Error("Tool not Recognized")
      }
    })
    return (()=>{
      context.clearRect(0,0,canvas.width,canvas.height);
    })
  },[elements])

  useEffect(() => {
    const textarea = textAreaRef.current;
    if (toolActionType === TOOL_ACTION_TYPES.WRITING) {
      setTimeout(() => {
        textarea.focus();
      }, 0);
    }
  }, [toolActionType]);

  function handlerMouseDown(event){
    // console.log(event);
     boardMouseDownHandler(event,toolBoxState);
  }
  function hadlerMouseMove(event){
  //    const { clientX, clientY } = event;
  // console.log("Mouse move:", clientX, clientY);
    boardMouseMoveHandler(event);
        socket.emit("drawingUpdate", { canvasId: id, elements });
  }
  function handlerMouseUp(){
       
      boardMouseUpHandler();
      // updateCanvas(id,elements)
     socket.emit("drawingUpdate", { canvasId: id, elements });
  }
  return (
    <>
    <Button value="Back"/>
     {
      toolActionType===TOOL_ACTION_TYPES.WRITING &&
      <textarea
          type="text"
          ref={textAreaRef}
          className={classes.textElementBox}
          style={{
            top: elements[elements.length - 1].y1,
            left: elements[elements.length - 1].x1,
            fontSize: `${elements[elements.length - 1]?.size}px`,
            color: elements[elements.length - 1]?.stroke,
          }}
          onBlur={(event) => textAreaBlurHandler(event.target.value)}
        />
     }
      <canvas     
        id="canvas"
        ref={canvasRef}
        className={classes.canvas}
        onMouseDown={handlerMouseDown} onMouseMove={hadlerMouseMove} onMouseUp={handlerMouseUp}>
      </canvas>
    </>
  );
}

export default Board;
