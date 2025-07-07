import { useContext} from 'react'
import classes from './index.module.css';
import cx from 'classnames'
import { TOOL_ITEMS } from '../../constants';

import {
  FaSlash,
  FaRegCircle,
  FaArrowRight,
  FaPaintBrush,
  FaEraser,
  FaUndoAlt,
  FaRedoAlt,
  FaFont,
  FaDownload,
} from "react-icons/fa";

import { RiRectangleLine } from "react-icons/ri";
import BoardContext from '../store/board-context';

const Toolbar = () => {
  const {activeToolItem,HandleActiveTool,undo,redo}=useContext(BoardContext);

   const handleDownloadClick = () => {
    const canvas = document.getElementById("canvas");
    const data = canvas.toDataURL("image/png");
    const anchor = document.createElement("a");
    anchor.href = data;
    anchor.download = "board.png";
    anchor.click();
  };

    return (
    <div className={classes.container}>
        <div 
            className={cx(classes.toolItem,{[classes.active]:activeToolItem===TOOL_ITEMS.BRUSH})} 
            onClick={()=>HandleActiveTool(TOOL_ITEMS.BRUSH)}>
            <FaPaintBrush/>
        </div>

        <div 
            className={cx(classes.toolItem,{[classes.active]:activeToolItem===TOOL_ITEMS.LINE})}
            onClick={()=>HandleActiveTool(TOOL_ITEMS.LINE)} >
            <FaSlash/>
        </div>

        <div 
            className={cx(classes.toolItem,{[classes.active]:activeToolItem===TOOL_ITEMS.CIRCLE})} 
            onClick={()=>HandleActiveTool(TOOL_ITEMS.CIRCLE)}>
            <FaRegCircle/>
        </div>

        <div 
            className={cx(classes.toolItem,{[classes.active]:activeToolItem===TOOL_ITEMS.RECTANGLE})} 
            onClick={()=>HandleActiveTool(TOOL_ITEMS.RECTANGLE)}>
            <RiRectangleLine/>
        </div>
        
        <div 
            className={cx(classes.toolItem,{[classes.active]:activeToolItem===TOOL_ITEMS.ARROW})} 
            onClick={()=>HandleActiveTool(TOOL_ITEMS.ARROW)}>
            <FaArrowRight/>
        </div>

        <div 
            className={cx(classes.toolItem,{[classes.active]:activeToolItem===TOOL_ITEMS.ERASER})} 
            onClick={()=>HandleActiveTool(TOOL_ITEMS.ERASER)}>
            <FaEraser/>
        </div>

          <div 
            className={cx(classes.toolItem,{[classes.active]:activeToolItem===TOOL_ITEMS.TEXT})} 
            onClick={()=>HandleActiveTool(TOOL_ITEMS.TEXT)}>
            <FaFont/>
        </div>

         <div 
            className={classes.toolItem} 
            onClick={undo}>
            <FaUndoAlt/>
        </div>

         <div 
           className={classes.toolItem} 
            onClick={redo}>
            <FaRedoAlt/>
        </div>

        <div 
            className={classes.toolItem} 
            onClick={handleDownloadClick}>
            <FaDownload/>
        </div>

      </div>
  )
}

export default Toolbar
