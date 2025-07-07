import React, { useReducer } from 'react'
import toolboxContext from './toolbox-context'
import { COLORS, TOOL_ACTION_TYPES, TOOL_ITEMS, TOOLBOX_ACTIONS } from '../../constants'

function toolBoxReducer(state,action){
   switch (action.type) {
        case TOOLBOX_ACTIONS.CHANGE_STROKE:{
            const {toolType,color}=action.payload
            //change the state i.e set toolType ka stoke to color 
            return {
                ...state,
                [toolType]:{
                    ...[toolType],
                    stroke:color
                }
            }
        }   
        case TOOLBOX_ACTIONS.CHANGE_FILL:{
            const {toolType,color}=action.payload
            //change the state i.e set toolType ka stoke to color 
            let newState={...state}
            newState[toolType].fill=color;
            return newState;
        } 
        case TOOLBOX_ACTIONS.CHANGE_SIZE:{
            const {toolType,size}=action.payload
            //change the state i.e set toolType ka stoke to color 
            let newState={...state}
            newState[toolType].size=size;
            return newState;
        }   
        default:
            return state;
   }

}
const intialToolBoxState={
   [TOOL_ITEMS.BRUSH]: {
    stroke: COLORS.BLACK,
  },
  [TOOL_ITEMS.LINE]: {
    stroke: COLORS.BLACK,
    size: 1,
  },
  [TOOL_ITEMS.RECTANGLE]: {
    stroke: COLORS.BLACK,
    fill: null,
    size: 1,
  },
  [TOOL_ITEMS.CIRCLE]: {
    stroke: COLORS.BLACK,
    fill: null,
    size: 1,
  },
  [TOOL_ITEMS.ARROW]: {
    stroke: COLORS.BLACK,
    size: 1,
  },
  [TOOL_ITEMS.TEXT]: {
    stroke: COLORS.BLACK,
    size: 32,
  },

}

const ToolBoxProvider = ({children}) => {
    const [toolBoxState,dispatchToolBox]=useReducer(toolBoxReducer,intialToolBoxState);
    
    function changeStoke(toolType,color){
        dispatchToolBox({
            type:TOOLBOX_ACTIONS.CHANGE_STROKE,
            payload:{
                toolType,color
            }
        })
    }
    
    function changeFill(toolType,color){
        dispatchToolBox({
            type:TOOLBOX_ACTIONS.CHANGE_FILL,
            payload:{
                toolType,color
            }
        })
    }
    function changeSize(toolType,size){
        // console.log(sizeLen);
        dispatchToolBox({
            type:TOOLBOX_ACTIONS.CHANGE_SIZE,
            payload:{
                toolType,size
            }
        })
    }
    const contextValue={
        toolBoxState,
        changeStoke,
        changeFill,
        changeSize,
    }

    return (
    <toolboxContext.Provider value={contextValue}>
      {children}
    </toolboxContext.Provider>
  )
}

export default ToolBoxProvider
