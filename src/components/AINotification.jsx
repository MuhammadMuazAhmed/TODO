import React, { useState, useEffect } from "react";
import { MdClose, MdCelebration, MdLightbulb } from "react-icons/md";

const AINotification = ({
  message,
  type = "success",
  onClose,
  autoClose = true,
  duration = 5000,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Show notification with animation
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Start progress countdown
    const startTime = Date.now();
    const duration = 4000; // 4 seconds

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (elapsed >= duration) {
        clearInterval(progressInterval);
        handleClose();
      }
    }, 16); // Update every 16ms for smooth animation

    return () => {
      clearTimeout(showTimer);
      clearInterval(progressInterval);
    };
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getNotificationStyle = () => {
    switch (type) {
      case "completion":
        return {
          background: "bg-gradient-to-r from-green-400 to-emerald-500",
          icon: "🎉",
          title: "Task Completed!",
          border: "border-green-300",
          shadow: "shadow-green-200",
        };
      case "analysis":
        return {
          background: "bg-gradient-to-r from-blue-400 to-purple-500",
          icon: "💡",
          title: "Great Addition!",
          border: "border-blue-300",
          shadow: "shadow-blue-200",
        };
      default:
        return {
          background: "bg-gradient-to-r from-gray-400 to-gray-500",
          icon: "📝",
          title: "Notification",
          border: "border-gray-300",
          shadow: "shadow-gray-200",
        };
    }
  };

  const style = getNotificationStyle();

  return (
    <div
      className={`fixed top-6 right-6 z-50 max-w-sm w-full ${
        isVisible ? "animate-slideIn" : "opacity-0 translate-x-full"
      }`}
    >
      <div
        className={`${style.background} ${style.border} ${
          style.shadow
        } rounded-2xl p-6 text-white shadow-2xl transform transition-all duration-300 ${
          isExiting ? "animate-slideOut" : ""
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="text-3xl mr-3 animate-bounce">{style.icon}</div>
            <div>
              <h3 className="font-bold text-lg">{style.title}</h3>
              <div className="text-xs opacity-90">AI Assistant</div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition-colors duration-200 p-1 rounded-full hover:bg-white hover:bg-opacity-20"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Message */}
        <div className="mb-4">
          <p className="text-white text-sm leading-relaxed font-medium">
            {message}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white bg-opacity-20 rounded-full h-1 mb-2">
          <div
            className="bg-white h-1 rounded-full transition-all duration-100 ease-linear"
            style={{
              width: `${progress}%`,
            }}
          ></div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={handleClose}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default AINotification;
