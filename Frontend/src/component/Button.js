
import React from 'react'

const Button = ({value}) => {

    const handleGoBack = () => {
        window.history.back();
    };

  return (
       <button
        onClick={handleGoBack}
        className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 border border-white/20 flex items-center gap-2"
      >
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 19l-7-7 7-7" 
          />
        </svg>
        {value}
      </button>
  )
}

export default Button
