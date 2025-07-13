import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";

const TodoSection = ({
  activeView,
  currentUser,
  todos,
  setTodos,
  onTaskCompletion,
  onAddTodo,
  onMascotEmotion,
  onShowMascot,
}) => {
  const [todo, setTodo] = useState("");
  const [taskFilter, setTaskFilter] = useState("all"); // "all", "pending", "completed"

  const saveTodosToLS = (newTodos) => {
    if (currentUser) {
      localStorage.setItem(`todos_${currentUser.id}`, JSON.stringify(newTodos));
    }
  };

  const addTodo = async () => {
    if (onAddTodo) {
      await onAddTodo(todo);
      setTodo("");
      // Show thinking mascot when adding a task
      if (onMascotEmotion && onShowMascot) {
        onMascotEmotion("thinking");
        onShowMascot(true);
        setTimeout(() => onShowMascot(false), 3000);
      }
    } else {
      // Fallback to original behavior if onAddTodo is not provided
      const newTodo = {
        id: uuidv4(),
        todo,
        isCompleted: false,
        view: activeView,
        createdAt: new Date().toISOString(),
      };
      const newTodos = [...todos, newTodo];
      setTodos(newTodos);
      setTodo("");
      saveTodosToLS(newTodos);
    }
  };

  const handleTodoEdit = (e, id) => {
    const t = todos.filter((i) => i.id === id);
    setTodo(t[0].todo);
    const newTodos = todos.filter((item) => item.id !== id);
    setTodos(newTodos);
    saveTodosToLS(newTodos);
  };

  const handleTodoDelete = (e, id) => {
    const newTodos = todos.filter((item) => item.id !== id);
    setTodos(newTodos);
    saveTodosToLS(newTodos);
  };

  const change = (e) => {
    setTodo(e.target.value);
  };

  const handleTodoCheckbox = async (e) => {
    const id = e.target.name;
    const index = todos.findIndex((item) => item.id === id);
    const newTodos = [...todos];
    const wasCompleted = newTodos[index].isCompleted;
    newTodos[index].isCompleted = !wasCompleted;
    setTodos(newTodos);
    saveTodosToLS(newTodos);

    // If todo was just completed (not unchecked), generate celebration message
    if (!wasCompleted && onTaskCompletion) {
      await onTaskCompletion(newTodos[index].todo, "todo");
      // Show celebrating mascot when completing a task
      if (onMascotEmotion && onShowMascot) {
        onMascotEmotion("celebrating");
        onShowMascot(true);
        setTimeout(() => onShowMascot(false), 4000);
      }
    } else if (wasCompleted && onMascotEmotion && onShowMascot) {
      // Show surprised mascot when unchecking a task
      onMascotEmotion("surprised");
      onShowMascot(true);
      setTimeout(() => onShowMascot(false), 3000);
    }
  };

  // Filter todos based on active view and task filter
  const filteredTodos = todos.filter((item) => {
    const viewMatch = item.view === activeView;
    if (taskFilter === "all") return viewMatch;
    if (taskFilter === "pending") return viewMatch && !item.isCompleted;
    if (taskFilter === "completed") return viewMatch && item.isCompleted;
    return viewMatch;
  });

  const getViewTitle = () => {
    switch (activeView) {
      case "daily":
        return "Daily Tasks";
      case "weekly":
        return "Weekly Tasks";
      case "monthly":
        return "Monthly Tasks";
      default:
        return "Tasks";
    }
  };

  const getViewEmoji = () => {
    switch (activeView) {
      case "daily":
        return "📅";
      case "weekly":
        return "📆";
      case "monthly":
        return "🗓️";
      default:
        return "📝";
    }
  };

  const getFilterTitle = () => {
    switch (taskFilter) {
      case "all":
        return "All Tasks";
      case "pending":
        return "Pending Tasks";
      case "completed":
        return "Completed Tasks";
      default:
        return "All Tasks";
    }
  };

  const getFilterEmoji = () => {
    switch (taskFilter) {
      case "all":
        return "📋";
      case "pending":
        return "⏳";
      case "completed":
        return "✅";
      default:
        return "📋";
    }
  };

  if (!currentUser) {
    return <div>Please log in to view your todos.</div>;
  }

  return (
    <div className="w-full relative px-4 lg:px-0">
      <div className="addtodo mx-auto my-4 lg:my-8 p-4 lg:p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-lg w-full lg:w-2/3 border border-blue-100">
        <h1 className="text-2xl lg:text-3xl font-bold mb-3 lg:mb-4 text-center gradient-text animate-slide-up">
          <span className="mr-2 lg:mr-3 text-3xl lg:text-4xl animate-float">
            {getViewEmoji()}
          </span>
          {getViewTitle()}
        </h1>
        <h2
          className="text-lg lg:text-xl font-bold mb-3 lg:mb-4 text-gray-700 text-center animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          Add New Task
        </h2>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <input
            onChange={change}
            value={todo}
            type="text"
            className="w-full sm:flex-1 border border-gray-300 rounded-xl sm:rounded-l-xl sm:rounded-r-none p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            placeholder={`Add a ${activeView} task...`}
          />
          <button
            onClick={addTodo}
            disabled={todo.length < 3}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 lg:px-6 py-3 rounded-xl sm:rounded-l-none sm:rounded-r-xl hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover-lift interactive-element"
          >
            <span className="mr-2 text-lg">✨</span>
            Add Task
          </button>
        </div>
      </div>

      {/* Task Filter Buttons */}
      <div className="mx-auto w-full lg:w-2/3 mb-4 lg:mb-6">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 justify-center">
          <button
            onClick={() => setTaskFilter("all")}
            className={`px-4 lg:px-6 py-2 lg:py-3 rounded-xl font-medium transition-all duration-200 hover-lift interactive-element text-sm lg:text-base ${
              taskFilter === "all"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <span className="mr-2 text-base lg:text-lg">
              {getFilterEmoji()}
            </span>
            All Tasks
          </button>
          <button
            onClick={() => setTaskFilter("pending")}
            className={`px-4 lg:px-6 py-2 lg:py-3 rounded-xl font-medium transition-all duration-200 hover-lift interactive-element text-sm lg:text-base ${
              taskFilter === "pending"
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <span className="mr-2 text-base lg:text-lg">⏳</span>
            Pending Tasks
          </button>
          <button
            onClick={() => setTaskFilter("completed")}
            className={`px-4 lg:px-6 py-2 lg:py-3 rounded-xl font-medium transition-all duration-200 hover-lift interactive-element text-sm lg:text-base ${
              taskFilter === "completed"
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg transform scale-105"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <span className="mr-2 text-base lg:text-lg">✅</span>
            Completed Tasks
          </button>
        </div>
      </div>

      <h2
        className="text-xl lg:text-2xl font-bold mt-6 lg:mt-8 text-center text-gray-800 animate-slide-up px-4"
        style={{ animationDelay: "0.2s" }}
      >
        <span className="mr-2 lg:mr-3 text-2xl lg:text-3xl animate-pulse-custom">
          {getFilterEmoji()}
        </span>
        {getViewTitle()} - {getFilterTitle()}
      </h2>

      <div className="todos mx-auto my-4 lg:my-6 w-full lg:w-2/3 px-4 lg:px-0">
        {filteredTodos.length === 0 ? (
          <div
            className="text-center py-8 lg:py-12 text-gray-500 animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="text-4xl lg:text-6xl mb-3 lg:mb-4 animate-float">
              📝
            </div>
            <p className="text-base lg:text-lg mb-2">
              {taskFilter === "all" &&
                `No ${activeView} tasks yet. Add your first one above!`}
              {taskFilter === "pending" &&
                `No pending ${activeView} tasks. Great job!`}
              {taskFilter === "completed" &&
                `No completed ${activeView} tasks yet.`}
            </p>
            <p className="text-xs lg:text-sm text-gray-400">
              Start building your productivity! 🚀
            </p>
          </div>
        ) : (
          filteredTodos.map((item, index) => {
            return (
              <div
                key={item.id}
                className={`todo flex flex-col sm:flex-row items-start sm:items-center bg-white shadow-md rounded-xl p-3 lg:p-4 my-3 border border-gray-200 transition-all duration-300 hover-lift hover-glow animate-slide-up ${
                  item.isCompleted ? "bg-green-50 border-green-200" : ""
                }`}
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <div className="flex items-center w-full sm:w-auto mb-2 sm:mb-0">
                  <input
                    name={item.id}
                    onChange={handleTodoCheckbox}
                    type="checkbox"
                    checked={item.isCompleted}
                    className="mr-3 sm:mr-4 accent-green-600 w-4 h-4 sm:w-5 sm:h-5 cursor-pointer interactive-element"
                  />
                  <div
                    className={`flex-grow ${
                      item.isCompleted
                        ? "line-through text-gray-500"
                        : "text-gray-900"
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-2 text-base lg:text-lg">
                        {item.isCompleted ? "✅" : "📋"}
                      </span>
                      <span className="text-sm lg:text-base">{item.todo}</span>
                    </div>
                    {item.description && (
                      <p className="text-xs lg:text-sm text-gray-500 mt-1">
                        {item.description}
                      </p>
                    )}
                    {item.estimatedTime && (
                      <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full mt-1">
                        ⏱️ {item.estimatedTime}
                      </span>
                    )}
                  </div>
                </div>
                <div className="buttons flex space-x-2 self-end sm:self-auto">
                  <button
                    onClick={(e) => handleTodoEdit(e, item.id)}
                    className="bg-yellow-500 text-white p-1.5 lg:p-2 rounded-lg hover:bg-yellow-600 transition-all duration-200 hover-lift interactive-element"
                  >
                    <CiEdit className="text-sm lg:text-base" />
                  </button>
                  <button
                    onClick={(e) => handleTodoDelete(e, item.id)}
                    className="bg-red-600 text-white p-1.5 lg:p-2 rounded-lg hover:bg-red-700 transition-all duration-200 hover-lift interactive-element"
                  >
                    <MdDeleteOutline className="text-sm lg:text-base" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Emojis */}
      <div
        className="floating-emoji top-20 right-20 text-2xl animate-float"
        style={{ animationDelay: "1s" }}
      >
        ✨
      </div>
      <div
        className="floating-emoji top-40 left-20 text-xl animate-float-slow"
        style={{ animationDelay: "2s" }}
      >
        🌟
      </div>
      <div
        className="floating-emoji bottom-40 right-20 text-lg animate-float"
        style={{ animationDelay: "3s" }}
      >
        💫
      </div>
    </div>
  );
};

export default TodoSection;
