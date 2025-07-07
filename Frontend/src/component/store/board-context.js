import { createContext } from "react";

//intialize the global context 
const BoardContext=createContext({
   isUserLoggedIn: false,
   activeToolItem:"",
   elements:[],
   history:[[]],
   index:0,
   toolActionType:"",
   HandleActiveTool:()=>{},
   boardMouseDownHandler:()=>{},
   boardMouseMoveHandler:()=>{},
   boardMouseUpHandler:()=>{},
   textAreaBlurHandler:()=>{},
   undo:()=>{},
   redo:()=>{},
  setHistory: () => {},
   canvasId: "", 
  setElements: () => {},
})
export default BoardContext;