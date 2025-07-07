import Board from '../component/Board';
import Toolbar from '../component/ToolBar';
import BoardProvider from '../component/store/BoardProvider';
import ToolBox from '../component/ToolBox';
import ToolBoxProvider from '../component/store/ToolBoxProvider';
import { useNavigate,useParams } from 'react-router-dom';

import { useContext, useEffect, useState } from 'react'; // You missed this import too
import BoardContext from '../component/store/board-context';
// import { getToken } from '../utils/token';

function Canvas({id}) {
  // const token=getToken();
  const { id: canvasId } = useParams(); 
  const navigate = useNavigate();
  const [error, setError] = useState(null);
 
   const [canvasElement,setCanvasElements]=useState([]);

  useEffect(() => {
    if (!canvasId) {
      navigate('/profile');
      return;
    }

    const fetchCanvas = async () => {
      try {
        const token =localStorage.getItem("token");
        const res = await fetch(`http://localhost:3030/api/canvas/load/${canvasId}`, {
          headers: {
            authorization: token,
              'Cache-Control': 'no-cache' 
          },
        });

        if (!res.ok) throw new Error('Failed to fetch canvas');
    
        const data = await res.json();
        // console.log(data);
        if (!data) {
          throw new Error('Canvas not found');
        }
        console.log(data.elements);
        setCanvasElements(data.elements || []);

      } catch (err) {
        setError(err.message);
      }
    };

    fetchCanvas();
  }, [canvasId, navigate]);

  if (error) return <p className="text-red-600 text-center">{error}</p>;
  // if (!canvasData) return <p className="text-center">Loading canvas...</p>;

  return (
    <BoardProvider intialElement={canvasElement} >
      <ToolBoxProvider >
        <ToolBox />
        <Toolbar />
        <Board id={canvasId}/>
      </ToolBoxProvider>
    </BoardProvider>
  );
}

export default Canvas;

