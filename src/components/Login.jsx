import React, { useState } from "react";
import { MdPerson, MdLock, MdEmail } from "react-icons/md";

const Login = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Input validation and sanitization
  const sanitizeInput = (input) => {
    return input.trim().replace(/[<>]/g, '');
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUsername = (username) => {
    return username.length >= 3 && username.length <= 20 && /^[a-zA-Z0-9_]+$/.test(username);
  };

  const validatePassword = (password) => {
    return password.length >= 6 && password.length <= 50;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const sanitizedUsername = sanitizeInput(username);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = password; // Don't sanitize password

    if (isRegistering) {
      // Registration validation
      if (!validateUsername(sanitizedUsername)) {
        setError("Username must be 3-20 characters and contain only letters, numbers, and underscores");
        return;
      }

      if (!validateEmail(sanitizedEmail)) {
        setError("Please enter a valid email address");
        return;
      }

      if (!validatePassword(sanitizedPassword)) {
        setError("Password must be 6-50 characters long");
        return;
      }

      // Registration logic
      try {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const existingUser = users.find((user) => user.username === sanitizedUsername);

        if (existingUser) {
          setError("Username already exists!");
          return;
        }

        const newUser = {
          id: Date.now().toString(),
          username: sanitizedUsername,
          email: sanitizedEmail,
          password: sanitizedPassword, // In a real app, this should be hashed
          createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        // Initialize user's todos and goals
        localStorage.setItem(`todos_${newUser.id}`, JSON.stringify([]));
        localStorage.setItem(`goals_${newUser.id}`, JSON.stringify([]));

        onLogin(newUser);
      } catch (error) {
        setError("Registration failed. Please try again.");
      }
    } else {
      // Login validation
      if (!sanitizedUsername || !sanitizedPassword) {
        setError("Please enter both username and password");
        return;
      }

      // Login logic
      try {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const user = users.find(
          (u) => u.username === sanitizedUsername && u.password === sanitizedPassword
        );

        if (!user) {
          setError("Invalid username or password!");
          return;
        }

        onLogin(user);
      } catch (error) {
        setError("Login failed. Please try again.");
      }
    }
  };

  const handleInputChange = (setter) => (e) => {
    const value = e.target.value;
    setter(value);
    setError(""); // Clear error when user starts typing
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">
          TodoFlow
        </h1>

        <h2 className="text-xl font-semibold text-center mb-6">
          {isRegistering ? "Create Account" : "Welcome Back"}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <MdPerson className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={handleInputChange(setUsername)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                maxLength={20}
              />
            </div>
          </div>

          {isRegistering && (
            <div>
              <div className="relative">
                <MdEmail className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={handleInputChange(setEmail)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                  maxLength={100}
                />
              </div>
            </div>
          )}

          <div>
            <div className="relative">
              <MdLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={handleInputChange(setPassword)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                maxLength={50}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            {isRegistering ? "Register" : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError("");
              setUsername("");
              setEmail("");
              setPassword("");
            }}
            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            {isRegistering
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
