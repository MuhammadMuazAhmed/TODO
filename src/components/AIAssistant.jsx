import React, { useState } from "react";
import { MdLightbulb, MdChat, MdTrendingUp, MdAdd } from "react-icons/md";
import GeminiAIService from "../services/geminiAI";
import Mascot from "./Mascot.jsx";

const AIAssistant = ({
  currentUser,
  todos,
  goals,
  onAddTodo,
  onAddGoal,
  activeView,
  activeGoal,
  onMascotEmotion,
  onShowMascot,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("suggestions");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [insights, setInsights] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatResponse, setChatResponse] = useState("");

  const generateTodoSuggestions = async () => {
    setLoading(true);
    // Show thinking mascot while generating suggestions
    if (onMascotEmotion && onShowMascot) {
      onMascotEmotion("thinking");
      onShowMascot(true);
    }

    try {
      const currentTodos = todos.filter((todo) => todo.view === activeView);
      const currentGoals = goals.filter((goal) => goal.type === activeGoal);

      const suggestions = await GeminiAIService.generateTodoSuggestions(
        currentTodos,
        currentGoals,
        activeView
      );
      setSuggestions(suggestions);
      // Show excited mascot when suggestions are ready
      if (onMascotEmotion && onShowMascot) {
        onMascotEmotion("excited");
        setTimeout(() => onShowMascot(false), 3000);
      }
    } catch (error) {
      console.error("Error generating suggestions:", error);
      if (onShowMascot) onShowMascot(false);
    } finally {
      setLoading(false);
    }
  };

  const generateGoalRecommendations = async () => {
    setLoading(true);
    // Show focused mascot while generating recommendations
    if (onMascotEmotion && onShowMascot) {
      onMascotEmotion("focused");
      onShowMascot(true);
    }

    try {
      const currentTodos = todos.filter((todo) => todo.view === activeView);
      const currentGoals = goals.filter((goal) => goal.type === activeGoal);

      const recommendations = await GeminiAIService.generateGoalRecommendations(
        currentTodos,
        currentGoals,
        activeGoal
      );
      setRecommendations(recommendations);
      // Show proud mascot when recommendations are ready
      if (onMascotEmotion && onShowMascot) {
        onMascotEmotion("proud");
        setTimeout(() => onShowMascot(false), 3000);
      }
    } catch (error) {
      console.error("Error generating recommendations:", error);
      if (onShowMascot) onShowMascot(false);
    } finally {
      setLoading(false);
    }
  };

  const getProductivityInsights = async () => {
    setLoading(true);
    try {
      const currentTodos = todos.filter((todo) => todo.view === activeView);
      const currentGoals = goals.filter((goal) => goal.type === activeGoal);

      const insights = await GeminiAIService.getProductivityInsights(
        currentTodos,
        currentGoals
      );
      setInsights(insights);
    } catch (error) {
      console.error("Error getting insights:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatMessage.trim()) return;

    setLoading(true);
    try {
      const currentTodos = todos.filter((todo) => todo.view === activeView);
      const currentGoals = goals.filter((goal) => goal.type === activeGoal);

      const response = await GeminiAIService.chatWithAI(chatMessage, {
        todos: currentTodos,
        goals: currentGoals,
      });
      setChatResponse(response);
    } catch (error) {
      console.error("Error sending chat message:", error);
      setChatResponse("Sorry, I encountered an error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuggestion = (suggestion) => {
    if (activeView) {
      onAddTodo(suggestion.title);
    }
  };

  const handleAddRecommendation = (recommendation) => {
    if (activeGoal) {
      onAddGoal(recommendation.title);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "work":
        return "bg-blue-100 text-blue-800";
      case "personal":
        return "bg-purple-100 text-purple-800";
      case "health":
        return "bg-green-100 text-green-800";
      case "learning":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      {/* AI Assistant Toggle Button - Now with Mascot */}
      <div className="fixed bottom-4 lg:bottom-6 right-4 lg:right-6 z-50">
        <div
          onClick={() => {
            setIsOpen(!isOpen);
            // Show different mascot emotions based on state
            if (onMascotEmotion && onShowMascot) {
              if (!isOpen) {
                // Opening AI panel - show excited mascot
                onMascotEmotion("excited");
                onShowMascot(true);
                setTimeout(() => onShowMascot(false), 2000);
              } else {
                // Closing AI panel - show sleepy mascot
                onMascotEmotion("sleepy");
                onShowMascot(true);
                setTimeout(() => onShowMascot(false), 2000);
              }
            }
          }}
          className="cursor-pointer group"
        >
          <Mascot
            emotion={isOpen ? "thinking" : "happy"}
            size="large"
            animated={true}
            className="hover:scale-110 transition-transform duration-200"
          />
        </div>
      </div>

      {/* AI Assistant Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-2 lg:p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] lg:max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="bg-purple-600 text-white p-3 lg:p-4 flex justify-between items-center">
              <h2 className="text-lg lg:text-xl font-semibold">AI Assistant</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 text-lg lg:text-xl"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap border-b">
              <button
                onClick={() => setActiveTab("suggestions")}
                className={`flex-1 min-w-[120px] p-2 lg:p-3 text-center text-xs lg:text-sm ${
                  activeTab === "suggestions"
                    ? "bg-purple-50 text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <MdAdd className="inline mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Todo Suggestions</span>
                <span className="sm:hidden">Suggestions</span>
              </button>
              <button
                onClick={() => setActiveTab("recommendations")}
                className={`flex-1 min-w-[120px] p-2 lg:p-3 text-center text-xs lg:text-sm ${
                  activeTab === "recommendations"
                    ? "bg-purple-50 text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <MdTrendingUp className="inline mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Goal Recommendations</span>
                <span className="sm:hidden">Goals</span>
              </button>
              <button
                onClick={() => setActiveTab("insights")}
                className={`flex-1 min-w-[120px] p-2 lg:p-3 text-center text-xs lg:text-sm ${
                  activeTab === "insights"
                    ? "bg-purple-50 text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <MdLightbulb className="inline mr-1 lg:mr-2" />
                Insights
              </button>
              <button
                onClick={() => setActiveTab("chat")}
                className={`flex-1 min-w-[120px] p-2 lg:p-3 text-center text-xs lg:text-sm ${
                  activeTab === "chat"
                    ? "bg-purple-50 text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <MdChat className="inline mr-1 lg:mr-2" />
                Chat
              </button>
            </div>

            {/* Content */}
            <div className="p-3 lg:p-4 overflow-y-auto max-h-[60vh] lg:max-h-[60vh]">
              {activeTab === "suggestions" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                      AI Todo Suggestions
                    </h3>
                    <button
                      onClick={generateTodoSuggestions}
                      disabled={loading}
                      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
                    >
                      {loading ? "Generating..." : "Generate Suggestions"}
                    </button>
                  </div>

                  {suggestions.length > 0 ? (
                    <div className="space-y-3">
                      {suggestions.map((suggestion, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{suggestion.title}</h4>
                            <button
                              onClick={() => handleAddSuggestion(suggestion)}
                              className="text-purple-600 hover:text-purple-800 text-sm"
                            >
                              Add
                            </button>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">
                            {suggestion.description}
                          </p>
                          <div className="flex gap-2">
                            <span
                              className={`px-2 py-1 rounded text-xs ${getPriorityColor(
                                suggestion.priority
                              )}`}
                            >
                              {suggestion.priority} priority
                            </span>
                            <span
                              className={`px-2 py-1 rounded text-xs ${getCategoryColor(
                                suggestion.category
                              )}`}
                            >
                              {suggestion.category}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Click "Generate Suggestions" to get AI-powered todo
                      recommendations
                    </p>
                  )}
                </div>
              )}

              {activeTab === "recommendations" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                      AI Goal Recommendations
                    </h3>
                    <button
                      onClick={generateGoalRecommendations}
                      disabled={loading}
                      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
                    >
                      {loading ? "Generating..." : "Generate Recommendations"}
                    </button>
                  </div>

                  {recommendations.length > 0 ? (
                    <div className="space-y-3">
                      {recommendations.map((recommendation, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">
                              {recommendation.title}
                            </h4>
                            <button
                              onClick={() =>
                                handleAddRecommendation(recommendation)
                              }
                              className="text-purple-600 hover:text-purple-800 text-sm"
                            >
                              Add
                            </button>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">
                            {recommendation.description}
                          </p>
                          <div className="flex gap-2">
                            <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                              {recommendation.timeframe}
                            </span>
                            <span
                              className={`px-2 py-1 rounded text-xs ${getCategoryColor(
                                recommendation.category
                              )}`}
                            >
                              {recommendation.category}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Click "Generate Recommendations" to get AI-powered goal
                      suggestions
                    </p>
                  )}
                </div>
              )}

              {activeTab === "insights" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                      Productivity Insights
                    </h3>
                    <button
                      onClick={getProductivityInsights}
                      disabled={loading}
                      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
                    >
                      {loading ? "Analyzing..." : "Get Insights"}
                    </button>
                  </div>

                  {insights ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-green-700 mb-2">
                          Insights
                        </h4>
                        <ul className="space-y-1">
                          {insights.insights.map((insight, index) => (
                            <li key={index} className="text-sm text-gray-700">
                              • {insight}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-blue-700 mb-2">Tips</h4>
                        <ul className="space-y-1">
                          {insights.tips.map((tip, index) => (
                            <li key={index} className="text-sm text-gray-700">
                              • {tip}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <h4 className="font-medium text-yellow-800 mb-1">
                          Motivation
                        </h4>
                        <p className="text-sm text-yellow-700">
                          {insights.motivation}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Click "Get Insights" to receive personalized productivity
                      analysis
                    </p>
                  )}
                </div>
              )}

              {activeTab === "chat" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Chat with AI Assistant
                  </h3>

                  {chatResponse && (
                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <p className="text-sm text-gray-700">{chatResponse}</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Ask me anything about productivity..."
                      className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm lg:text-base"
                      onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                    />
                    <button
                      onClick={sendChatMessage}
                      disabled={loading || !chatMessage.trim()}
                      className="bg-purple-600 text-white px-3 lg:px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50 text-sm lg:text-base"
                    >
                      {loading ? "..." : "Send"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
