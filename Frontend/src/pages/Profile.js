import React, { useEffect, useState ,useRef} from 'react';
import { useNavigate } from 'react-router-dom';
// import {getToken} from '../utils/token';
import Button from '../component/Button';
import socket from '../utils/socket';
function Profile() {

  

  const [canvases, setCanvases] = useState([]);
  const [ownerName, setOwnerName] = useState(''); // Owner's name
  const [error, setError] = useState(null);
  const [name, setName] = useState('');//canavs name  
  // const [createError, setCreateError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const emailRef = useRef();
  const navigate = useNavigate();
   

  const fetchCanvas = async () => {
      try {
        const token =localStorage.getItem("token");
        const res = await fetch('http://localhost:3030/api/canvas', {
          headers: { authorization: token },
           'Cache-Control': 'no-cache' 
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch canvas');
        setCanvases(data.newCanvas || []);
        setOwnerName(data.username || '');
      } catch (err) {
        setError(err.message);
      }
    };


  useEffect(() => { 
    fetchCanvas();
  }, []);


  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg('');
    try {
     const token =localStorage.getItem("token");
      const response = await fetch('http://localhost:3030/api/canvas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create canvas');

      setSuccessMsg('Canvas created successfully!');
      setName('');
       fetchCanvas(); 
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOpenCanvas = (canvasId) => {
    navigate(`/load/${canvasId}`);
  };

const handleDeleteCanvas = async (canvasId) => {
  try {


     const canvas = canvases.find(c => c._id === canvasId);
    if (canvas && canvas.owner.username.toString() !== ownerName.toString()) {
      alert("You can't delete this canvas - you are not the owner!");
      return;
    }

      const token =localStorage.getItem("token");
    const res = await fetch(`http://localhost:3030/api/canvas/${canvasId}`, {
      method: 'DELETE',
      headers: {
        authorization: token,
      },
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'Failed to delete canvas');
    }
     fetchCanvas(); 
  } catch (err) {
    console.error('Error deleting canvas:', err.message);
  }
};

  const handleShareCanvas = async (canvasId, email) => {
    if (!email) return;
    // console.log(email);
    try {
      const token =localStorage.getItem("token");
      await fetch(`http://localhost:3030/api/canvas/share/${canvasId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
        body: JSON.stringify({ shareWith: email }),
      });
    } catch (err) {
      console.error('Error sharing canvas:', err.message);
    }
  };

  return (
     <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-10 px-4">
      {/* Canvas Creation Form */}
     

      <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-2xl w-full max-w-7xl mb-8 border border-white/20">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Create New Canvas
            </h1>
          </div>
          
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter canvas name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300 placeholder-gray-400"
            />
          </div>
          
          <div className="flex-shrink-0">
            <button
              onClick={handleCreate}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-8 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              Create Canvas
            </button>
          </div>
        </div>
        
        {successMsg && (
          <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-xl">
            <p className="text-green-700 text-center font-medium">{successMsg}</p>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-xl">
            <p className="text-red-700 text-center font-medium">{error}</p>
          </div>
        )}
      </div>

      {/* Canvas List */}
      <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-7xl border border-white/20">
 
         <Button value={"Back"}/>

        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Your Canvases
          </h2>
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-4 inline-block">
            <p className="text-lg font-semibold text-gray-700">
              Owner: <span className="text-indigo-700">{ownerName}</span>
            </p>
          </div>
        </div>

        {canvases.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-8 inline-block">
              <p className="text-gray-600 text-xl">No canvases found. Create your first one!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {canvases.map((canvas) => (
              <div
                key={canvas._id}
                className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-indigo-300 relative"
              >
                {/* Shared Badge */}
                {canvas.owner.username !== ownerName && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                    SHARED
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="font-bold text-xl text-gray-800 mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {canvas.name}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Created: {new Date(canvas.createdAt).toLocaleString()}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Updated: {new Date(canvas.updatedAt).toLocaleString()}
                    </p>
                    {canvas.owner.username !== ownerName && (
                      <p className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        Owner: {canvas.owner.username}
                      </p>
                    )}
                  </div>
                </div>

                {/* Share Section */}
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      ref={emailRef}
                      type="email"
                      placeholder="Share with email..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-300"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleOpenCanvas(canvas._id)}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                    >
                      Open
                    </button>
                    
                    <button
                      onClick={() => handleDeleteCanvas(canvas._id)}
                      className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-3 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                    >
                      Delete
                    </button>
                    
                    <button
                      onClick={() =>
                        handleShareCanvas(canvas._id, emailRef.current?.value)
                      }
                      className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-3 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                    >
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;