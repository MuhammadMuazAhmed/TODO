import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import TodoSection from "./components/TodoSection";
import GoalSection from "./components/GoalSection";
import Login from "./components/Login";
import AIAssistant from "./components/AIAssistant";
import AINotification from "./components/AINotification";
import ProgressQuestions from "./components/ProgressQuestions";
import Mascot, {
  HappyMascot,
  ExcitedMascot,
  ProudMascot,
  EncouragingMascot,
  ThinkingMascot,
  SurprisedMascot,
  SleepyMascot,
  CelebratingMascot,
  FocusedMascot,
  WorriedMascot,
} from "./components/Mascot";

function App() {
  const [activeView, setActiveView] = useState(null);
  const [activeGoal, setActiveGoal] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [goals, setGoals] = useState([]);
  const [notification, setNotification] = useState(null);
  const [showProgressQuestions, setShowProgressQuestions] = useState(false);
  const [hasShownQuestionsToday, setHasShownQuestionsToday] = useState(false);
  const [mascotEmotion, setMascotEmotion] = useState("happy");
  const [showMascot, setShowMascot] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Security: Clear any sensitive data from URL parameters on load
  useEffect(() => {
    // Remove any sensitive data from URL parameters
    if (window.location.search) {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);

  // Clear any existing user session on app load to require fresh login
  useEffect(() => {
    // Remove any existing user session from localStorage
    localStorage.removeItem("currentUser");
  }, []);

  // Load todos and goals when user changes
  useEffect(() => {
    if (currentUser) {
      const savedTodos = localStorage.getItem(`todos_${currentUser.id}`);
      const savedGoals = localStorage.getItem(`goals_${currentUser.id}`);

      if (savedTodos) {
        setTodos(JSON.parse(savedTodos));
      } else {
        setTodos([]);
      }

      if (savedGoals) {
        setGoals(JSON.parse(savedGoals));
      } else {
        setGoals([]);
      }
    }
  }, [currentUser]);

  // Check for progress questions when goals change
  useEffect(() => {
    if (currentUser && goals.length > 0) {
      checkAndShowProgressQuestions();
    }
  }, [currentUser, goals]);

  // Check if we should show progress questions (once per day)
  const checkAndShowProgressQuestions = () => {
    if (!currentUser) return;

    // Only show progress questions if user has goals
    if (!goals || goals.length === 0) return;

    const today = new Date().toDateString();
    const lastQuestionDate = localStorage.getItem(
      `lastQuestionDate_${currentUser.id}`
    );

    if (lastQuestionDate !== today) {
      setShowProgressQuestions(true);
      localStorage.setItem(`lastQuestionDate_${currentUser.id}`, today);
    }
  };

  // Manual trigger for progress questions (for testing)
  const triggerProgressQuestions = () => {
    if (currentUser && goals.length > 0) {
      setShowProgressQuestions(true);
    }
  };

  // Handle adding daily tasks from goals
  const handleAddTasks = (dailyTasks) => {
    if (currentUser && activeView) {
      const newTodos = dailyTasks.map((task, index) => ({
        id: `daily_${Date.now()}_${index}`,
        todo: task.title,
        isCompleted: false,
        view: activeView,
        createdAt: new Date().toISOString(),
        description: task.description,
        estimatedTime: task.estimatedTime,
        priority: task.priority,
        source: "daily-task",
      }));

      const updatedTodos = [...todos, ...newTodos];
      setTodos(updatedTodos);
      localStorage.setItem(
        `todos_${currentUser.id}`,
        JSON.stringify(updatedTodos)
      );

      setNotification({
        message: `🎯 Added ${dailyTasks.length} daily tasks to help you achieve your goals!`,
        type: "analysis",
      });
    } else {
      // If no active view, add to daily view
      const newTodos = dailyTasks.map((task, index) => ({
        id: `daily_${Date.now()}_${index}`,
        todo: task.title,
        isCompleted: false,
        view: "daily",
        createdAt: new Date().toISOString(),
        description: task.description,
        estimatedTime: task.estimatedTime,
        priority: task.priority,
        source: "daily-task",
      }));

      const updatedTodos = [...todos, ...newTodos];
      setTodos(updatedTodos);
      localStorage.setItem(
        `todos_${currentUser.id}`,
        JSON.stringify(updatedTodos)
      );

      setNotification({
        message: `🎯 Added ${dailyTasks.length} daily tasks to your daily view!`,
        type: "analysis",
      });
    }
  };

  // Test AI connection on app load (silent) - Only in development
  useEffect(() => {
    if (import.meta.env.DEV) {
      const testAI = async () => {
        try {
          const GeminiAIService = (await import("./services/geminiAI")).default;
          await GeminiAIService.testAI();
        } catch (error) {
          // Silent fail in production
        }
      };

      testAI();
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
    setMascotEmotion("excited");
    setShowMascot(true);
    setTimeout(() => setShowMascot(false), 3000);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    // Clear question date when logging out
    if (currentUser) {
      localStorage.removeItem(`lastQuestionDate_${currentUser.id}`);
    }
    // Reset view states
    setActiveView(null);
    setActiveGoal(null);
    // Clear todos and goals
    setTodos([]);
    setGoals([]);
    // Reset progress questions state
    setShowProgressQuestions(false);
    setShowMascot(false);
  };

  const handleAddTodo = async (todoText) => {
    if (currentUser && activeView) {
      const newTodo = {
        id: Date.now().toString(),
        todo: todoText,
        isCompleted: false,
        view: activeView,
        createdAt: new Date().toISOString(),
      };
      const newTodos = [...todos, newTodo];
      setTodos(newTodos);
      localStorage.setItem(`todos_${currentUser.id}`, JSON.stringify(newTodos));

      // Generate AI analysis for new todo
      try {
        const GeminiAIService = (await import("./services/geminiAI")).default;

        const analysis = await GeminiAIService.generateTaskAnalysis(
          todoText,
          "todo",
          {
            currentTodos: todos,
            currentGoals: goals,
            activeView: activeView,
          }
        );

        if (analysis && analysis.trim() !== "") {
          setNotification({
            message: analysis,
            type: "analysis",
          });
        } else {
          setNotification({
            message:
              "Great addition! This task will help you stay organized and productive.",
            type: "analysis",
          });
        }
      } catch (error) {
        // Silent error handling in production
        setNotification({
          message:
            "Great addition! This task will help you stay organized and productive.",
          type: "analysis",
        });
      }
    }
  };

  const handleAddGoal = async (goalText) => {
    if (currentUser && activeGoal) {
      const newGoal = {
        id: Date.now().toString(),
        goal: goalText,
        isCompleted: false,
        type: activeGoal,
        createdAt: new Date().toISOString(),
      };
      const newGoals = [...goals, newGoal];
      setGoals(newGoals);
      localStorage.setItem(`goals_${currentUser.id}`, JSON.stringify(newGoals));

      // Generate AI analysis for new goal
      try {
        const GeminiAIService = (await import("./services/geminiAI")).default;
        const analysis = await GeminiAIService.generateTaskAnalysis(
          goalText,
          "goal",
          {
            currentTodos: todos,
            currentGoals: goals,
            activeGoal: activeGoal,
          }
        );
        setNotification({
          message: analysis,
          type: "analysis",
        });
        setMascotEmotion("focused");
        setShowMascot(true);
        setTimeout(() => setShowMascot(false), 3000);
      } catch (error) {
        // Silent error handling in production
      }
    }
  };

  const handleTaskCompletion = async (taskText, taskType = "todo") => {
    try {
      const GeminiAIService = (await import("./services/geminiAI")).default;
      const completedTodos = todos.filter((todo) => todo.isCompleted).length;
      const completedGoals = goals.filter((goal) => goal.isCompleted).length;

      const celebrationMessage =
        await GeminiAIService.generateCompletionMessage(taskText, taskType, {
          totalTodos: todos.length,
          completedTodos: completedTodos,
          totalGoals: goals.length,
          completedGoals: completedGoals,
        });

      setNotification({
        message: celebrationMessage,
        type: "completion",
      });
      setMascotEmotion("celebrating");
      setShowMascot(true);
      setTimeout(() => setShowMascot(false), 4000);
    } catch (error) {
      // Silent error handling in production
    }
  };

  // Determine which section to show based on user selection
  const isTodoMode =
    activeView === "daily" ||
    activeView === "weekly" ||
    activeView === "monthly";
  const isGoalMode = activeGoal === "shortterm" || activeGoal === "longterm";

  // Show login screen if no user is logged in
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        activeGoal={activeGoal}
        setActiveGoal={setActiveGoal}
        currentUser={currentUser}
        onLogout={handleLogout}
        onMascotEmotion={setMascotEmotion}
        onShowMascot={setShowMascot}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <div className="lg:ml-64 min-h-screen bg-gray-50 transition-all duration-300">
        {isTodoMode && (
          <TodoSection
            activeView={activeView}
            currentUser={currentUser}
            todos={todos}
            setTodos={setTodos}
            onTaskCompletion={handleTaskCompletion}
            onAddTodo={handleAddTodo}
            onMascotEmotion={setMascotEmotion}
            onShowMascot={setShowMascot}
          />
        )}
        {isGoalMode && (
          <GoalSection
            activeGoal={activeGoal}
            currentUser={currentUser}
            goals={goals}
            setGoals={setGoals}
            onTaskCompletion={handleTaskCompletion}
            onAddGoal={handleAddGoal}
            onMascotEmotion={setMascotEmotion}
            onShowMascot={setShowMascot}
          />
        )}

        {/* AI Assistant - Available on all pages */}
        <AIAssistant
          currentUser={currentUser}
          todos={todos}
          goals={goals}
          onAddTodo={handleAddTodo}
          onAddGoal={handleAddGoal}
          activeView={activeView}
          activeGoal={activeGoal}
          onMascotEmotion={setMascotEmotion}
          onShowMascot={setShowMascot}
        />

        {/* Show welcome message when no section is selected */}
        {!isTodoMode && !isGoalMode && (
          <div className="relative">
            {/* User Info Card - Responsive positioning */}
            <div className="absolute top-4 right-4 lg:right-4 z-10">
              <div className="bg-white p-3 lg:p-4 rounded-lg shadow-md max-w-xs">
                <h3 className="text-xs lg:text-sm font-semibold text-gray-800 mb-1">
                  Welcome, {currentUser.username}!
                </h3>
                <p className="text-xs text-gray-600">{currentUser.email}</p>
              </div>
            </div>

            <div className="flex items-center justify-center min-h-screen px-4 lg:px-0">
              <div className="text-center max-w-md lg:max-w-lg">
                {/* Mascot - Show on welcome screen */}
                <div className="mb-4 lg:mb-6 flex justify-center">
                  <HappyMascot size="large" />
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-700 mb-3 lg:mb-4">
                  TodoFlow
                </h1>
                <p className="text-base lg:text-lg text-gray-600 mb-6 lg:mb-8">
                  Select a todo view or goal type from the sidebar to get
                  started.
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="text-center">
                    <div className="bg-blue-100 p-3 lg:p-4 rounded-lg mb-2">
                      <span className="text-blue-600 text-xl lg:text-2xl">
                        📝
                      </span>
                    </div>
                    <p className="text-xs lg:text-sm text-gray-600">
                      Choose a todo view
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-100 p-3 lg:p-4 rounded-lg mb-2">
                      <span className="text-green-600 text-xl lg:text-2xl">
                        🎯
                      </span>
                    </div>
                    <p className="text-xs lg:text-sm text-gray-600">
                      Choose a goal type
                    </p>
                  </div>
                </div>

                {/* Test Progress Questions Button - Only in development */}
                {import.meta.env.DEV && goals.length > 0 && (
                  <div className="mt-6 lg:mt-8">
                    <button
                      onClick={triggerProgressQuestions}
                      className="bg-purple-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm lg:text-base"
                    >
                      🧪 Test Progress Questions
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                      Click to manually trigger progress questions
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Progress Questions Modal */}
        {showProgressQuestions && (
          <ProgressQuestions
            currentGoals={goals}
            currentTodos={todos}
            onClose={() => setShowProgressQuestions(false)}
            onMascotEmotion={setMascotEmotion}
            onShowMascot={setShowMascot}
          />
        )}

        {/* AI Notification */}
        {notification && (
          <AINotification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}

        {/* Floating Mascot - Appears during actions (positioned to avoid AI button) */}
        {showMascot && (
          <div className="fixed bottom-4 lg:bottom-8 left-4 lg:left-8 z-50 animate-fade-in-scale">
            <Mascot emotion={mascotEmotion} size="large" className="group" />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
