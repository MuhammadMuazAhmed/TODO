import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";

const GoalSection = ({
  activeGoal,
  currentUser,
  goals,
  setGoals,
  onTaskCompletion,
  onAddGoal,
  onMascotEmotion,
  onShowMascot,
}) => {
  const [goal, setGoal] = useState("");
  const [taskFilter, setTaskFilter] = useState("all"); // "all", "pending", "completed"

  const saveGoalsToLS = (newGoals) => {
    if (currentUser) {
      localStorage.setItem(`goals_${currentUser.id}`, JSON.stringify(newGoals));
    }
  };

  const addGoal = async () => {
    if (onAddGoal) {
      await onAddGoal(goal);
      setGoal("");
      // Show focused mascot when adding a goal
      if (onMascotEmotion && onShowMascot) {
        onMascotEmotion("focused");
        onShowMascot(true);
        setTimeout(() => onShowMascot(false), 3000);
      }
    } else {
      // Fallback to original behavior if onAddGoal is not provided
      const newGoals = [
        ...goals,
        {
          id: uuidv4(),
          goal,
          isCompleted: false,
          type: activeGoal,
          createdAt: new Date().toISOString(),
        },
      ];
      setGoals(newGoals);
      setGoal("");
      saveGoalsToLS(newGoals);
    }
  };

  const handleGoalEdit = (e, id) => {
    const g = goals.filter((i) => i.id === id);
    setGoal(g[0].goal);
    const newGoals = goals.filter((item) => item.id !== id);
    setGoals(newGoals);
    saveGoalsToLS(newGoals);
  };

  const handleGoalDelete = (e, id) => {
    const newGoals = goals.filter((item) => item.id !== id);
    setGoals(newGoals);
    saveGoalsToLS(newGoals);
  };

  const change = (e) => {
    setGoal(e.target.value);
  };

  const handleGoalCheckbox = async (e) => {
    const id = e.target.name;
    const index = goals.findIndex((item) => item.id === id);
    const newGoals = [...goals];
    const wasCompleted = newGoals[index].isCompleted;
    newGoals[index].isCompleted = !wasCompleted;
    setGoals(newGoals);
    saveGoalsToLS(newGoals);

    // If goal was just completed (not unchecked), generate celebration message
    if (!wasCompleted && onTaskCompletion) {
      await onTaskCompletion(newGoals[index].goal, "goal");
      // Show proud mascot when completing a goal
      if (onMascotEmotion && onShowMascot) {
        onMascotEmotion("proud");
        onShowMascot(true);
        setTimeout(() => onShowMascot(false), 4000);
      }
    } else if (wasCompleted && onMascotEmotion && onShowMascot) {
      // Show worried mascot when unchecking a goal
      onMascotEmotion("worried");
      onShowMascot(true);
      setTimeout(() => onShowMascot(false), 3000);
    }
  };

  // Filter goals based on active goal type and task filter
  const filteredGoals = goals.filter((item) => {
    const typeMatch = item.type === activeGoal;
    if (taskFilter === "all") return typeMatch;
    if (taskFilter === "pending") return typeMatch && !item.isCompleted;
    if (taskFilter === "completed") return typeMatch && item.isCompleted;
    return typeMatch;
  });

  const getGoalTitle = () => {
    switch (activeGoal) {
      case "shortterm":
        return "Short-term Goals";
      case "longterm":
        return "Long-term Goals";
      default:
        return "Goals";
    }
  };

  const getFilterTitle = () => {
    switch (taskFilter) {
      case "all":
        return "All Goals";
      case "pending":
        return "Pending Goals";
      case "completed":
        return "Completed Goals";
      default:
        return "All Goals";
    }
  };

  if (!currentUser) {
    return <div>Please log in to view your goals.</div>;
  }

  return (
    <div className="w-full relative">
      <div className="addgoal mx-auto my-8 p-6 bg-white rounded-lg shadow-md w-2/3">
        <h1 className="text-2xl font-bold mb-4 text-green-900 text-center">
          GoalFlow! Achieve Your Dreams, Step by Step
        </h1>
        <h1 className="text-2xl font-bold mb-4 text-green-900">
          Add {getGoalTitle()}
        </h1>
        <div className="flex items-center">
          <input
            onChange={change}
            value={goal}
            type="text"
            className="border border-gray-300 rounded-l-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder={`Add a ${activeGoal} goal...`}
          />
          <button
            onClick={addGoal}
            disabled={goal.length < 3}
            className="bg-green-600 text-white px-3 py-2 rounded-r-lg hover:bg-green-700 focus:ring-2 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Goal
          </button>
        </div>
      </div>

      {/* Goal Filter Buttons */}
      <div className="mx-auto w-2/3 mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setTaskFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              taskFilter === "all"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All Goals
          </button>
          <button
            onClick={() => setTaskFilter("pending")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              taskFilter === "pending"
                ? "bg-orange-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Pending Goals
          </button>
          <button
            onClick={() => setTaskFilter("completed")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              taskFilter === "completed"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Completed Goals
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 text-center text-green-900">
        {getGoalTitle()} - {getFilterTitle()}
      </h2>

      <div className="goals mx-auto my-6 w-2/3">
        {filteredGoals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>
              {taskFilter === "all" &&
                `No ${activeGoal} goals yet. Add your first one above!`}
              {taskFilter === "pending" &&
                `No pending ${activeGoal} goals. Great job!`}
              {taskFilter === "completed" &&
                `No completed ${activeGoal} goals yet.`}
            </p>
          </div>
        ) : (
          filteredGoals.map((item) => {
            return (
              <div
                key={item.id}
                className="goal flex items-center bg-white shadow-md rounded-lg p-4 my-2 border border-gray-300"
              >
                <input
                  name={item.id}
                  onChange={handleGoalCheckbox}
                  type="checkbox"
                  checked={item.isCompleted}
                  className="mr-4 accent-green-600"
                />
                <div
                  className={`flex-grow ${
                    item.isCompleted
                      ? "line-through text-gray-500"
                      : "text-gray-900"
                  }`}
                >
                  {item.goal}
                </div>
                <div className="buttons flex space-x-2">
                  <button
                    onClick={(e) => handleGoalEdit(e, item.id)}
                    className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600"
                  >
                    <CiEdit />
                  </button>
                  <button
                    onClick={(e) => handleGoalDelete(e, item.id)}
                    className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700"
                  >
                    <MdDeleteOutline />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default GoalSection;
