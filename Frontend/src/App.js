
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Canvas from './pages/OpenCanvas';

// import Board from './component/Board';
// import Toolbar from './component/ToolBar';
// import BoardProvider from './component/store/BoardProvider';
// import ToolBox from './component/ToolBox';
// import ToolBoxProvider from './component/store/ToolBoxProvider';

function App() {
  return (
   
   <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/load/:id" element={<Canvas />} />
      </Routes>
    </Router>

  //  <BoardProvider>
  //     <ToolBoxProvider>
  //       <ToolBox />
  //       <Toolbar />
  //       <Board  />
  //     </ToolBoxProvider>
  //   </BoardProvider>
      
    
  );
}

export default App;
