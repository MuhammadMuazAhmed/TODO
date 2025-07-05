import React from "react";

const Mascot = ({
  emotion = "happy",
  size = "medium",
  animated = true,
  className = "",
  onClick = null,
}) => {
  const getEmotionConfig = (emotion) => {
    switch (emotion) {
      case "happy":
        return {
          emoji: "🦉",
          expression: "😊",
          color: "text-yellow-500",
          bgColor: "bg-yellow-100",
          message: "Great job!",
          animation: "animate-bounce-custom",
        };
      case "excited":
        return {
          emoji: "🦉",
          expression: "🤩",
          color: "text-orange-500",
          bgColor: "bg-orange-100",
          message: "Amazing!",
          animation: "animate-wiggle",
        };
      case "proud":
        return {
          emoji: "🦉",
          expression: "😌",
          color: "text-green-500",
          bgColor: "bg-green-100",
          message: "I'm so proud!",
          animation: "animate-float",
        };
      case "encouraging":
        return {
          emoji: "🦉",
          expression: "💪",
          color: "text-blue-500",
          bgColor: "bg-blue-100",
          message: "You can do it!",
          animation: "animate-pulse-custom",
        };
      case "thinking":
        return {
          emoji: "🦉",
          expression: "🤔",
          color: "text-purple-500",
          bgColor: "bg-purple-100",
          message: "Let me think...",
          animation: "animate-float-slow",
        };
      case "surprised":
        return {
          emoji: "🦉",
          expression: "😲",
          color: "text-red-500",
          bgColor: "bg-red-100",
          message: "Wow!",
          animation: "animate-bounce-custom",
        };
      case "sleepy":
        return {
          emoji: "🦉",
          expression: "😴",
          color: "text-gray-500",
          bgColor: "bg-gray-100",
          message: "Time for a break?",
          animation: "animate-float-slow",
        };
      case "celebrating":
        return {
          emoji: "🦉",
          expression: "🎉",
          color: "text-pink-500",
          bgColor: "bg-pink-100",
          message: "Party time!",
          animation: "animate-wiggle",
        };
      case "focused":
        return {
          emoji: "🦉",
          expression: "🎯",
          color: "text-indigo-500",
          bgColor: "bg-indigo-100",
          message: "Stay focused!",
          animation: "animate-pulse-custom",
        };
      case "worried":
        return {
          emoji: "🦉",
          expression: "😟",
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
          message: "Need help?",
          animation: "animate-float-slow",
        };
      default:
        return {
          emoji: "🦉",
          expression: "😊",
          color: "text-yellow-500",
          bgColor: "bg-yellow-100",
          message: "Hello!",
          animation: "animate-float",
        };
    }
  };

  const getSizeConfig = (size) => {
    switch (size) {
      case "small":
        return {
          container: "w-16 h-16",
          emoji: "text-2xl",
          expression: "text-lg",
          message: "text-xs",
        };
      case "medium":
        return {
          container: "w-20 h-20",
          emoji: "text-3xl",
          expression: "text-xl",
          message: "text-sm",
        };
      case "large":
        return {
          container: "w-24 h-24",
          emoji: "text-4xl",
          expression: "text-2xl",
          message: "text-base",
        };
      case "xlarge":
        return {
          container: "w-32 h-32",
          emoji: "text-6xl",
          expression: "text-4xl",
          message: "text-lg",
        };
      default:
        return {
          container: "w-20 h-20",
          emoji: "text-3xl",
          expression: "text-xl",
          message: "text-sm",
        };
    }
  };

  const config = getEmotionConfig(emotion);
  const sizeConfig = getSizeConfig(size);

  return (
    <div
      className={`relative ${className} ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      {/* Mascot Container */}
      <div
        className={`${sizeConfig.container} ${
          config.bgColor
        } rounded-full flex items-center justify-center shadow-lg border-2 border-white ${
          animated ? config.animation : ""
        } transition-all duration-300 hover:scale-105`}
      >
        <div className="relative">
          {/* Main Owl Emoji */}
          <div className={`${sizeConfig.emoji} ${config.color}`}>
            {config.emoji}
          </div>
          {/* Expression Overlay */}
          <div
            className={`absolute -top-1 -right-1 ${sizeConfig.expression} ${config.color}`}
          >
            {config.expression}
          </div>
        </div>
      </div>

      {/* Speech Bubble */}
      <div
        className={`absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-3 py-2 shadow-lg border border-gray-200 ${sizeConfig.message} font-medium text-gray-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      >
        {config.message}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
      </div>
    </div>
  );
};

// Mascot with different expressions for different contexts
export const HappyMascot = (props) => <Mascot emotion="happy" {...props} />;
export const ExcitedMascot = (props) => <Mascot emotion="excited" {...props} />;
export const ProudMascot = (props) => <Mascot emotion="proud" {...props} />;
export const EncouragingMascot = (props) => (
  <Mascot emotion="encouraging" {...props} />
);
export const ThinkingMascot = (props) => (
  <Mascot emotion="thinking" {...props} />
);
export const SurprisedMascot = (props) => (
  <Mascot emotion="surprised" {...props} />
);
export const SleepyMascot = (props) => <Mascot emotion="sleepy" {...props} />;
export const CelebratingMascot = (props) => (
  <Mascot emotion="celebrating" {...props} />
);
export const FocusedMascot = (props) => <Mascot emotion="focused" {...props} />;
export const WorriedMascot = (props) => <Mascot emotion="worried" {...props} />;

export default Mascot;
