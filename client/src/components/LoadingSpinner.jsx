import React from 'react';

const LoadingSpinner = ({ message = "Loading...", size = "default", variant = "fullscreen" }) => {
  const sizeClasses = {
    small: "text-3xl",
    default: "text-6xl",
    large: "text-8xl"
  };

  const textSizeClasses = {
    small: "text-base",
    default: "text-lg",
    large: "text-xl"
  };

  if (variant === "compact") {
    return (
      <div className="text-center py-8">
        <div className="relative mb-4">
          {/* Compact qweb text */}
          <div className={`font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-pulse ${sizeClasses[size]}`}>
            qweb
          </div>
          
          {/* Compact animated dots */}
          <div className="flex justify-center space-x-1 mt-2">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
        
        <p className={`text-gray-600 font-medium animate-pulse ${textSizeClasses[size]}`}>
          {message}
        </p>
      </div>
    );
  }

  // Fullscreen variant (default)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          {/* Animated qweb text */}
          <div className={`font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-pulse ${sizeClasses[size]}`}>
            qweb
          </div>
          
          {/* Animated dots */}
          <div className="flex justify-center space-x-1 mt-4">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          
          {/* Subtle loading bar */}
          <div className="mt-6 w-32 h-1 bg-gray-200 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <p className={`text-gray-600 font-medium animate-pulse ${textSizeClasses[size]}`}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
