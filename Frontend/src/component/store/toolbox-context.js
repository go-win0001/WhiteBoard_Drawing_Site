import { createContext } from "react";

const ToolBoxContext=createContext(
    {
        toolBoxState:{},
        changeStoke:()=>{},
        changeFill:()=>{},
        changeSize:()=>{},
    }
);
export default ToolBoxContext