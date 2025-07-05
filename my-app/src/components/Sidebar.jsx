import React from "react";
import { MdOutlineDashboard } from "react-icons/md";
import { BsCalendarDay, BsCalendarWeek, BsCalendarMonth } from "react-icons/bs";
import { IoIosLogOut } from "react-icons/io";

const Sidebar = ({
  activeView,
  setActiveView,
  activeGoal,
  setActiveGoal,
  currentUser,
  onLogout,
  onMascotEmotion,
  onShowMascot,
}) => {
  const handleViewChange = (view) => {
    setActiveView(view);
    setActiveGoal(null);
    // Show encouraging mascot when switching to todo views
    onMascotEmotion("encouraging");
    onShowMascot(true);
    setTimeout(() => onShowMascot(false), 3000);
  };

  const handleGoalChange = (goal) => {
    setActiveGoal(goal);
    setActiveView(null);
    // Show focused mascot when switching to goal views
    onMascotEmotion("focused");
    onShowMascot(true);
    setTimeout(() => onShowMascot(false), 3000);
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-blue-600 to-purple-700 text-white shadow-xl z-20 flex flex-col">
      {/* User Profile Section */}
      <div className="p-6 border-b border-white border-opacity-20 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl animate-float">
            👤
          </div>
          <div>
            <h2 className="font-bold text-lg animate-slide-up">
              {currentUser?.username}
            </h2>
          </div>
        </div>
      </div>

      {/* Navigation Section - Scrollable */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
        {/* Todo Views */}
        <div className="mb-8">
          <h3
            className="text-lg font-semibold mb-4 flex items-center animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <span className="mr-2 text-2xl animate-pulse-custom">📝</span>
            Todo Views
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => handleViewChange("daily")}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover-lift hover-glow ${
                activeView === "daily"
                  ? "bg-white bg-opacity-20 shadow-lg transform scale-105"
                  : "hover:bg-white hover:bg-opacity-10"
              } animate-slide-up interactive-element`}
              style={{ animationDelay: "0.3s" }}
            >
              <BsCalendarDay className="text-xl animate-float-slow" />
              <span className="font-medium">Daily</span>
              {activeView === "daily" && (
                <span className="ml-auto text-2xl animate-bounce-custom">
                  ✨
                </span>
              )}
            </button>

            <button
              onClick={() => handleViewChange("weekly")}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover-lift hover-glow ${
                activeView === "weekly"
                  ? "bg-white bg-opacity-20 shadow-lg transform scale-105"
                  : "hover:bg-white hover:bg-opacity-10"
              } animate-slide-up interactive-element`}
              style={{ animationDelay: "0.4s" }}
            >
              <BsCalendarWeek className="text-xl animate-float-slow" />
              <span className="font-medium">Weekly</span>
              {activeView === "weekly" && (
                <span className="ml-auto text-2xl animate-bounce-custom">
                  ✨
                </span>
              )}
            </button>

            <button
              onClick={() => handleViewChange("monthly")}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover-lift hover-glow ${
                activeView === "monthly"
                  ? "bg-white bg-opacity-20 shadow-lg transform scale-105"
                  : "hover:bg-white hover:bg-opacity-10"
              } animate-slide-up interactive-element`}
              style={{ animationDelay: "0.5s" }}
            >
              <BsCalendarMonth className="text-xl animate-float-slow" />
              <span className="font-medium">Monthly</span>
              {activeView === "monthly" && (
                <span className="ml-auto text-2xl animate-bounce-custom">
                  ✨
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Goal Types */}
        <div className="mb-8">
          <h3
            className="text-lg font-semibold mb-4 flex items-center animate-slide-up"
            style={{ animationDelay: "0.6s" }}
          >
            <span className="mr-2 text-2xl animate-pulse-custom">🎯</span>
            Goal Types
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => handleGoalChange("shortterm")}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover-lift hover-glow ${
                activeGoal === "shortterm"
                  ? "bg-white bg-opacity-20 shadow-lg transform scale-105"
                  : "hover:bg-white hover:bg-opacity-10"
              } animate-slide-up interactive-element`}
              style={{ animationDelay: "0.7s" }}
            >
              <span className="text-xl animate-float-slow">⚡</span>
              <span className="font-medium">Short-term</span>
              {activeGoal === "shortterm" && (
                <span className="ml-auto text-2xl animate-bounce-custom">
                  ✨
                </span>
              )}
            </button>

            <button
              onClick={() => handleGoalChange("longterm")}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover-lift hover-glow ${
                activeGoal === "longterm"
                  ? "bg-white bg-opacity-20 shadow-lg transform scale-105"
                  : "hover:bg-white hover:bg-opacity-10"
              } animate-slide-up interactive-element`}
              style={{ animationDelay: "0.8s" }}
            >
              <span className="text-xl animate-float-slow">🚀</span>
              <span className="font-medium">Long-term</span>
              {activeGoal === "longterm" && (
                <span className="ml-auto text-2xl animate-bounce-custom">
                  ✨
                </span>
              )}
            </button>
          </div>
        </div>

        {/* AI Assistant Section */}
        <div className="mb-8">
          <h3
            className="text-lg font-semibold mb-4 flex items-center animate-slide-up"
            style={{ animationDelay: "0.9s" }}
          >
            <span className="mr-2 text-2xl animate-sparkle">🤖</span>
            AI Assistant
          </h3>
          <div
            className="bg-white bg-opacity-10 rounded-xl p-4 animate-slide-up"
            style={{ animationDelay: "1s" }}
          >
            <p className="text-sm text-white text-opacity-90 mb-3">
              Need help with your tasks and goals?
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-2xl animate-bounce-custom">💡</span>
              <span className="text-sm font-medium">Click the AI button!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Section - Fixed at bottom */}
      <div className="p-4 border-t border-white border-opacity-20 flex-shrink-0">
        <button
          onClick={() => {
            // Show sleepy mascot before logout
            onMascotEmotion("sleepy");
            onShowMascot(true);
            setTimeout(() => {
              onShowMascot(false);
              onLogout();
            }, 2000);
          }}
          className="w-full flex items-center justify-center space-x-2 p-3 rounded-xl bg-white bg-opacity-10 hover:bg-opacity-20 transition-all duration-200 hover-lift interactive-element animate-slide-up"
          style={{ animationDelay: "1.1s" }}
        >
          <IoIosLogOut className="text-xl animate-float-slow" />
          <span className="font-medium">Logout</span>
        </button>
      </div>

      {/* Floating Emojis */}
      <div
        className="floating-emoji top-20 right-4 text-2xl animate-float"
        style={{ animationDelay: "1s" }}
      >
        ✨
      </div>
      <div
        className="floating-emoji top-40 left-4 text-xl animate-float-slow"
        style={{ animationDelay: "2s" }}
      >
        🌟
      </div>
      <div
        className="floating-emoji bottom-40 right-6 text-lg animate-float"
        style={{ animationDelay: "3s" }}
      >
        💫
      </div>
    </div>
  );
};

export default Sidebar;
