import  {useEffect, useReducer} from 'react'
import BoardContext from './board-context'
import { TOOL_ITEMS,BOARD_ACTIONS, TOOL_ACTION_TYPES } from '../../constants'
// import rough from 'roughjs/bin/rough'
import createElement, { getSvgPathFromStroke } from '../../utils/CreateElement';
import getStroke from 'perfect-freehand';
import { isPointNearElement } from '../../utils/CreateElement';

// const gen=rough.generator();

function boardReducer(state,action){
        switch (action.type) {
            case BOARD_ACTIONS.CHANGE_TOOL:{
                return ({
                    ...state,
                    activeToolItem:action.payload.tool
                 })}
            case BOARD_ACTIONS.CHANGE_ACTION_TYPE:{
                const {toolAction}=action.payload;
                return {
                    ...state,
                    toolActionType:toolAction   
                }
            }
            case BOARD_ACTIONS.DRAW_DOWN:{
                const {clientX,clientY,fill,stroke,size}=action.payload; 
                        const newElement=createElement(
                            state.elements.length,
                            clientX,
                            clientY,
                            clientX,
                            clientY,
                            {type:state.activeToolItem,fill,stroke,size}
                        );
                        const prevElements=state.elements;
                        return ({
                            ...state,
                            toolActionType:
                              state.activeToolItem === TOOL_ITEMS.TEXT
                                ? TOOL_ACTION_TYPES.WRITING:
                                 TOOL_ACTION_TYPES.DRAWING,
                            elements:[
                                ...prevElements,newElement
                            ]
                        });
            }            
            case BOARD_ACTIONS.DRAW_MOVE:{
               const {clientX,clientY}=action.payload;
                let newElements=[...state.elements];
                const currindex=state.elements.length-1;
                const {type}=newElements[currindex];
                switch (type) {
                    case TOOL_ITEMS.LINE:
                    case TOOL_ITEMS.CIRCLE:
                    case TOOL_ITEMS.RECTANGLE:
                    case TOOL_ITEMS.ARROW:{
                        const {x1,y1,fill,stroke,size}=newElements[currindex];
                        const newElement=createElement(
                        state.elements.length,
                        x1,y1,
                        clientX,
                        clientY,
                        {type:state.activeToolItem,fill,stroke,size}
                      );
                      newElements[currindex]=newElement;
                        return ({
                            ...state,
                            elements:newElements
                        })
                    }
                    case TOOL_ITEMS.BRUSH:{
                        newElements[currindex].points=[
                            ...newElements[currindex].points,
                            {x:clientX,y:clientY}
                        ];
                        newElements[currindex].path=new Path2D(getSvgPathFromStroke(getStroke( newElements[currindex].points)))
                        return {
                            ...state,
                            elements:newElements
                        }
                    }               
                    default:
                        throw new Error("Item TOOL not recoginzed")
                }
                
            }
            case BOARD_ACTIONS.ERASE:{
                  const {clientX,clientY}=action.payload;
                let newElements=[...state.elements];


                newElements=newElements.filter(element=>{
                   return  !isPointNearElement(element,clientX,clientY);
                })
                
                const newHistory=state.history.slice(0,state.index+1);
                newHistory.push(newElements);
                
                return {
                    ...state,
                    elements:newElements,
                    history:newHistory,
                    index:state.index+1,
                }
            }
            
            case BOARD_ACTIONS.CHANGE_TEXT:{
                const {text}=action.payload;
                const indx=state.elements.length-1;
                const newElements=[...state.elements];
                newElements[indx].text=text;
                const newHistory=state.history.slice(0,state.index+1);
                newHistory.push(newElements);
                return {
                    ...state,
                    toolActionType: TOOL_ACTION_TYPES.NONE,
                    elements:newElements,
                    history:newHistory,
                    index:state.index+1,
                }
            }
            case BOARD_ACTIONS.DRAW_UP:{
                const newElemCopy=[...state.elements];
                const newHistory=state.history.slice(0,state.index+1);
                newHistory.push(newElemCopy);
                return {
                    ...state,
                    index:state.index+1,
                    history:newHistory
                }
            }
           case BOARD_ACTIONS.UNDO: {
                if (state.index <= 0) return state;
                return {
                    ...state,
                    elements: state.history[state.index - 1],
                    index: state.index - 1,
                };
                }   
             case BOARD_ACTIONS.REDO: {
            if (state.index >= state.history.length - 1) return state;
            return {
                ...state,
                elements: state.history[state.index + 1],
                index: state.index + 1,
            };
            }
             case BOARD_ACTIONS.SET_INITIAL_ELEMENTS: {
      return {
        ...state,
        elements: action.payload.elements,
        history: [action.payload.elements], 
      };
              }
            return {
                ...state,
                canvasId: action.payload.canvasId,
            };
            case BOARD_ACTIONS.SET_CANVAS_ELEMENTS:
            return {
                ...state,
                elements: action.payload.elements,
            };

            case BOARD_ACTIONS.SET_HISTORY:
            return {
                ...state,
                history: [action.payload.elements],
            };

            
            default:
                return state;
        }
}

const intialBoardState={
    activeToolItem:TOOL_ITEMS.LINE,
    toolActionType:TOOL_ACTION_TYPES.NONE,
    elements:[
    ],
    history:[[]],
   index:0,
}

const BoardProvider = ({children,intialElement }) => {

    const [boardState,dispatchBoardAction]=useReducer(boardReducer,intialBoardState);
    // boardState.elements=elements || boardState.elements; 
    
    // console.log(elements,boardState.elements);
    
    // useEffect(() => {
    // if (elements?.length) {
    //     dispatchBoardAction({
    //     type: BOARD_ACTIONS.SET_ELEMENTS,
    //     payload: { elem:elements }
    //     });
    // }
    // }, [elements]);

   useEffect(()=>{
    setElements(intialElement);
    setHistory(intialElement);
  },[intialElement])
    
    const HandleActiveTool=(tool)=>{
       dispatchBoardAction({
        type:BOARD_ACTIONS.CHANGE_TOOL,
        payload:{
            tool
        }
       })
    }

    const boardMouseDownHandler=(event,toolBoxState)=>{
        
        if(boardState.toolActionType===TOOL_ACTION_TYPES.WRITING) return;

        const {clientX,clientY}=event;
        // console.log(clientX,clientY)
        if(boardState.activeToolItem===TOOL_ITEMS.ERASER){
            
            dispatchBoardAction({
                type:BOARD_ACTIONS.CHANGE_ACTION_TYPE,
                    payload:{
                      toolAction:TOOL_ACTION_TYPES.ERASING
                 }
            })
         return;   
        }
        // console.log(clientX,clientY);
            dispatchBoardAction({
                type:BOARD_ACTIONS.DRAW_DOWN,
                payload:{
                    clientX,
                    clientY,
                    stroke:toolBoxState[boardState.activeToolItem]?.stroke,
                    fill:toolBoxState[boardState.activeToolItem]?.fill,
                    size:toolBoxState[boardState.activeToolItem]?.size,
                }
            })
        
    }

    const boardMouseMoveHandler=(event)=>{
         const {clientX,clientY}=event;
        //  console.log(clientX,clientY)
           if(boardState.toolActionType===TOOL_ACTION_TYPES.WRITING) return;
       
        if(boardState.toolActionType===TOOL_ACTION_TYPES.DRAWING){
            dispatchBoardAction({
                type:BOARD_ACTIONS.DRAW_MOVE,
                payload:{
                    clientX,
                    clientY,
                }
            })
        }else if(boardState.toolActionType===TOOL_ACTION_TYPES.ERASING){
            dispatchBoardAction({
                type:BOARD_ACTIONS.ERASE,
                payload:{
                    clientX,clientY
                }
            })
        }
    }
    const boardMouseUpHandler=()=>{
        if(boardState.toolActionType===TOOL_ACTION_TYPES.WRITING) return;

        if(boardState.toolActionType===TOOL_ACTION_TYPES.DRAWING){
            dispatchBoardAction({
                type:BOARD_ACTIONS.DRAW_UP
            })
        }
        dispatchBoardAction({
            type:BOARD_ACTIONS.CHANGE_ACTION_TYPE,
            payload:{
                toolAction:TOOL_ACTION_TYPES.NONE
            }
        })
    }

    function textAreaBlurHandler(text){
        dispatchBoardAction({
            type:BOARD_ACTIONS.CHANGE_TEXT,
            payload:{
                text
            }
        })
    }
    function undoHandler(){
        dispatchBoardAction({
            type:BOARD_ACTIONS.UNDO
        })
    }
    function redoHandler(){
        dispatchBoardAction({
            type:BOARD_ACTIONS.REDO
        })
    }

  const setElements = (elements) => {
    
    dispatchBoardAction({
      type: BOARD_ACTIONS.SET_CANVAS_ELEMENTS,
      payload: {
        elements,
      },
    });
  };
    // console.log("hello canvas")
  const setHistory = (elements) => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.SET_HISTORY,
      payload: {
        elements,
      },
    });
  };  

 


    const contextValue={
        activeToolItem:boardState.activeToolItem,
        elements:boardState.elements,
        toolActionType:boardState.toolActionType,
        HandleActiveTool,
        boardMouseDownHandler,
        boardMouseMoveHandler,
        boardMouseUpHandler,
        textAreaBlurHandler,
        undo:undoHandler,
        redo:redoHandler,
        setElements,
        setHistory,
   
    }
  return (
    <BoardContext.Provider value={contextValue}>
        {children}
    </BoardContext.Provider>
  )
}

export default BoardProvider
