import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import Navbar from "./components/Nav";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [finisheditems, setfinisheditems] = useState(false);

  const Togglefinished = (e) => {
    setfinisheditems(!finisheditems);
  };

  useEffect(() => {
    const todostrin = localStorage.getItem("todos");
    if (todostrin) {
      const savedTodos = JSON.parse(todostrin);
      setTodos(savedTodos);
    }
  }, []);

  const saveToLS = (newTodos) => {
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const add = () => {
    const newTodos = [...todos, { id: uuidv4(), todo, isCompleted: false }];
    setTodos(newTodos);
    setTodo("");
    saveToLS(newTodos);
  };

  const handleEdit = (e, id) => {
    const t = todos.filter((i) => i.id === id);
    setTodo(t[0].todo);
    const newTodos = todos.filter((item) => item.id !== id);
    setTodos(newTodos);
    saveToLS(newTodos);
  };

  const handleDelete = (e, id) => {
    const newTodos = todos.filter((item) => item.id !== id);
    setTodos(newTodos);
    saveToLS(newTodos);
  };

  const change = (e) => {
    setTodo(e.target.value);
  };

  const handlecheckbox = (e) => {
    const id = e.target.name;
    const index = todos.findIndex((item) => item.id === id);
    const newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos);
    saveToLS(newTodos);
  };

  return (
    <>
      <Navbar />
      <div className="addtodo mx-auto my-8 p-6 bg-white rounded-lg shadow-md w-2/3">
        <h1 className="text-2xl font-bold mb-4 text-blue-900 text-center">
          TodoFlow! Organize Your Day, Effortlessly
        </h1>
        <h1 className="text-2xl font-bold mb-4 text-blue-900">Add Todo</h1>
        <div className="flex items-center">
          <input
            onChange={change}
            value={todo}
            type="text"
            className="border border-gray-300 rounded-l-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={add}
            disabled={todo.length < 3}
            className="bg-blue-600 text-white px-3 py-2 rounded-r-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
          >
            Add
          </button>
        </div>
      </div>
      <div className="mx-auto w-2/3">
        <input
          type="checkbox"
          checked={finisheditems}
          className="mr-2 accent-blue-600"
          onChange={Togglefinished}
        />
        <label className="text-blue-900 font-medium">Show Completed</label>
      </div>
      <h2 className="text-2xl font-bold mt-8 text-center text-blue-900">
        Todos
      </h2>
      <div className="todos mx-auto my-6 w-2/3">
        {todos.map((item) => {
          return (
            (finisheditems || !item.isCompleted) && (
              <div
                key={item.id}
                className="todo flex items-center bg-white shadow-md rounded-lg p-4 my-2 border border-gray-300"
              >
                <input
                  name={item.id}
                  onChange={handlecheckbox}
                  type="checkbox"
                  checked={item.isCompleted}
                  className="mr-4 accent-blue-600"
                />
                <div
                  className={`flex-grow ${
                    item.isCompleted
                      ? "line-through text-gray-500"
                      : "text-gray-900"
                  }`}
                >
                  {item.todo}
                </div>
                <div className="buttons flex space-x-2">
                  <button
                    onClick={(e) => handleEdit(e, item.id)}
                    className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600"
                  >
                    <CiEdit />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, item.id)}
                    className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700"
                  >
                    <MdDeleteOutline />
                  </button>
                </div>
              </div>
            )
          );
        })}
      </div>
    </>
  );
}

export default App;
