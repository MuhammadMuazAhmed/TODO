import React, { useState, useEffect } from "react";
import GeminiAIService from "../services/geminiAI.js";

const ProgressQuestions = ({
  currentGoals,
  currentTodos,
  onClose,
  onMascotEmotion,
  onShowMascot,
}) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    generateQuestions();
  }, [currentGoals, currentTodos]);

  const generateQuestions = async () => {
    try {
      setLoading(true);
      // Show thinking mascot while generating questions
      if (onMascotEmotion && onShowMascot) {
        onMascotEmotion("thinking");
        onShowMascot(true);
      }

      const generatedQuestions =
        await GeminiAIService.generateProgressQuestions(
          currentGoals,
          currentTodos
        );

      // Only proceed if we got valid questions from AI
      if (generatedQuestions && generatedQuestions.length > 0) {
        setQuestions(generatedQuestions);
        // Show excited mascot when questions are ready
        if (onMascotEmotion && onShowMascot) {
          onMascotEmotion("excited");
          setTimeout(() => onShowMascot(false), 2000);
        }
      } else {
        // If AI returns empty or invalid response, close the modal
        console.log("AI returned empty questions, closing modal");
        if (onShowMascot) onShowMascot(false);
        onClose();
      }
      setLoading(false);
    } catch (error) {
      console.error("Error generating questions:", error);
      // If AI fails, close the modal instead of showing mock questions
      setLoading(false);
      if (onShowMascot) onShowMascot(false);
      onClose();
    }
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);

    // Show brief celebration animation
    setTimeout(() => {
      const currentQuestion = questions[currentQuestionIndex];
      setAnswers((prev) => ({
        ...prev,
        [currentQuestionIndex]: {
          question: currentQuestion.question,
          answer: answer,
          category: currentQuestion.category,
        },
      }));

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        // Show encouraging mascot for next question
        if (onMascotEmotion && onShowMascot) {
          onMascotEmotion("encouraging");
          onShowMascot(true);
          setTimeout(() => onShowMascot(false), 2000);
        }
      } else {
        // All questions answered, show final celebration
        setShowCelebration(true);
        // Show celebrating mascot for completion
        if (onMascotEmotion && onShowMascot) {
          onMascotEmotion("celebrating");
          onShowMascot(true);
          setTimeout(() => onShowMascot(false), 3000);
        }
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    }, 500);
  };

  // Get contextual answer options based on question category and content
  const getAnswerOptions = (question) => {
    const questionLower = question.question.toLowerCase();
    const category = question.category;

    // Celebration questions
    if (
      category === "celebration" ||
      questionLower.includes("proud") ||
      questionLower.includes("accomplish")
    ) {
      return [
        "Completed a major milestone or goal",
        "Made consistent daily progress",
        "Overcame a challenging obstacle",
        "Helped someone else succeed",
        "Learned something new and valuable",
      ];
    }

    // Reflection questions
    if (
      category === "reflection" ||
      questionLower.includes("achievable") ||
      questionLower.includes("momentum")
    ) {
      return [
        "My short-term goals feel most achievable",
        "My health and fitness goals are progressing well",
        "My learning and skill development goals",
        "My personal relationship goals",
        "My financial goals are on track",
      ];
    }

    // Planning questions
    if (
      category === "planning" ||
      questionLower.includes("step") ||
      questionLower.includes("today")
    ) {
      return [
        "Break down my biggest goal into smaller tasks",
        "Schedule dedicated time for my most important goal",
        "Research resources or tools to help me succeed",
        "Set a specific weekly milestone",
        "Ask for help or find a mentor",
      ];
    }

    // Motivation questions
    if (
      category === "motivation" ||
      questionLower.includes("putting off") ||
      questionLower.includes("tackle")
    ) {
      return [
        "A challenging work project I've been avoiding",
        "Starting my fitness routine or healthy habits",
        "Learning a new skill or taking a course",
        "Organizing my personal space or finances",
        "Reconnecting with friends or family",
      ];
    }

    // Goal-specific questions
    if (questionLower.includes("goal")) {
      return [
        "I'm making excellent progress",
        "I'm making steady progress",
        "I'm struggling but staying committed",
        "I need to adjust my approach",
        "I'm feeling stuck and need help",
      ];
    }

    // Default options for general questions
    return [
      "I'm making great progress",
      "I'm making some progress",
      "I'm facing challenges but staying positive",
      "I need to refocus and adjust my strategy",
      "I'm feeling overwhelmed and need support",
    ];
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "celebration":
        return "🎉";
      case "reflection":
        return "🤔";
      case "planning":
        return "📋";
      case "motivation":
        return "💪";
      default:
        return "❓";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "celebration":
        return "bg-gradient-to-r from-yellow-400 to-orange-500";
      case "reflection":
        return "bg-gradient-to-r from-blue-400 to-purple-500";
      case "planning":
        return "bg-gradient-to-r from-green-400 to-teal-500";
      case "motivation":
        return "bg-gradient-to-r from-pink-400 to-red-500";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center shadow-2xl">
          <div className="animate-bounce mb-4">
            <div className="text-6xl">🦉</div>
          </div>
          <div className="text-xl font-bold text-gray-800 mb-2">
            Preparing Your Progress Check
          </div>
          <div className="text-gray-600">
            AI is crafting personalized questions just for you...
          </div>
          <div className="mt-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (showCelebration) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center shadow-2xl animate-bounce">
          <div className="text-8xl mb-4">🎉</div>
          <div className="text-2xl font-bold text-gray-800 mb-2">
            Great Job!
          </div>
          <div className="text-gray-600">Thanks for sharing your progress!</div>
          <div className="text-sm text-gray-500 mt-4">
            Keep up the amazing work!
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center shadow-2xl">
          <div className="text-6xl mb-4">👋</div>
          <div className="text-xl font-bold text-gray-800 mb-2">
            Welcome Back!
          </div>
          <div className="text-gray-600 mb-6">
            Let's check in on your progress and help you stay motivated!
          </div>
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
          >
            Let's Go!
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage =
    ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-600">
              Progress
            </span>
            <span className="text-sm font-semibold text-gray-600">
              {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Question Header */}
        <div className="text-center mb-6">
          <div
            className={`inline-flex items-center px-4 py-2 rounded-full text-white font-semibold mb-4 ${getCategoryColor(
              currentQuestion.category
            )}`}
          >
            <span className="text-xl mr-2">
              {getCategoryIcon(currentQuestion.category)}
            </span>
            {currentQuestion.category.charAt(0).toUpperCase() +
              currentQuestion.category.slice(1)}
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-3 leading-relaxed">
            {currentQuestion.question}
          </h2>
          <p className="text-sm text-gray-600">{currentQuestion.context}</p>
        </div>

        {/* Answer Options */}
        <div className="space-y-3">
          {getAnswerOptions(currentQuestion).map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
              className={`w-full p-4 rounded-2xl text-left transition-all duration-200 transform hover:scale-105 ${
                selectedAnswer === option
                  ? "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg scale-105"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-800 border-2 border-transparent hover:border-blue-300"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                    selectedAnswer === option
                      ? "border-white bg-white"
                      : "border-gray-300"
                  }`}
                >
                  {selectedAnswer === option && (
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  )}
                </div>
                <span className="font-medium">{option}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Skip Button */}
        <div className="text-center mt-6">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressQuestions;
