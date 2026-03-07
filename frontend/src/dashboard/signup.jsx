import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UnauthenticatedNavbar from "../components/unauthnavbar";
function Signup() {
  // Unified Signup States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (!email.includes("@")) {
      setError("Enter a valid email format");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:5000/signup", {
        name,
        email,
        password,
      });

      if (response.status === 201) {
        setSuccess(response.data.message);
        setError("");
        navigate("/userdash");
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } else {
        setError(response.data.error);
        setSuccess("");
      }
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred during signup");
      setSuccess("");
      console.log("Error:", err);
    }
  }

  return (
    <div>
      <div>
        <UnauthenticatedNavbar />
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 p-4">
        <div className="mb-8">
          <a
            href="/"
            className="flex items-center justify-center gap-2 text-5xl font-extrabold text-white hover:text-gray-200 transition duration-300"
          >
            <span className="text-yellow-300">Money</span>Mate.io
          </a>
        </div>
        <div className="signup-card w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Signup
          </h2>

          {error && (
            <div className="text-red-600 text-sm mb-4 text-center">{error}</div>
          )}
          {success && (
            <div className="text-green-600 text-sm mb-4 text-center">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                placeholder="Enter your email"
              />
            </div>
            <div className="relative">
              <label className="block text-gray-600 font-medium mb-2">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-10 right-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            <div className="relative">
              <label className="block text-gray-600 font-medium mb-2">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-10 right-3 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
