import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";
import UnauthenticatedNavbar from "../components/unauthnavbar";

function Login() {
  const [showLogo, setShowLogo] = useState(true);
  
  // User login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime) {
          navigate("/userdash"); // Redirect to user dashboard if already logged in
        } else {
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
      }
    }
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    // Form validation
    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }
    if (!email.includes("@")) {
      setError("Enter a valid email format");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:8000/login", {
        email,
        password
      });

      const data = response.data;

      if (data.token) {
        localStorage.setItem("token", data.token);
        setSuccess(data.message || "Login successful");
        
        // Small delay before redirect for better UX
        setTimeout(() => {
          navigate("/userdash");
        }, 500);
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.error || 
        "An error occurred during login. Please check if the server is running."
      );
    } finally {
      setLoading(false);
    }
  }

  // Handle Google login success
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      // Send the credential token to your backend
      const response = await axios.post(
        "http://localhost:8000/auth/google/verify", 
        { credential: credentialResponse.credential }
      );

      const data = response.data;

      if (data.token) {
        localStorage.setItem("token", data.token);
        setSuccess("Google login successful");
        
        // Small delay before redirect for better UX
        setTimeout(() => {
          navigate("/userdash");
        }, 500);
      } else {
        setError("Google login failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.error || 
        "An error occurred during Google login. Please check if the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Google login error
  const handleGoogleError = () => {
    setError("Google login failed. Please try again.");
  };

  return (
    <div>
      <UnauthenticatedNavbar />
      <div className="login-container min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 p-4">
        
        {showLogo && (
          <div className="App-header mb-8">
            <a
              href="/"
              className="flex items-center justify-center gap-2 text-5xl font-extrabold text-white hover:text-gray-200 transition duration-300"
            >
              <span className="text-yellow-300">Money</span>Mate.io
            </a>
          </div>
        )}

        <div className="login-card w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
            User Login
          </h2>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-600 font-medium mb-2">Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your email"
                disabled={loading}
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-10 right-3 text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            <button
              type="submit"
              className={`w-full py-2 ${
                loading 
                  ? "bg-indigo-400" 
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white font-semibold rounded-lg transition duration-300`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="my-6 flex items-center justify-center">
            <div className="border-t border-gray-300 flex-grow mr-3"></div>
            <span className="text-gray-500 text-sm">OR</span>
            <div className="border-t border-gray-300 flex-grow ml-3"></div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              disabled={loading}
            />
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <a href="/signup" className="text-indigo-600 hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;