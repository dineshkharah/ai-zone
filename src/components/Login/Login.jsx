import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loginUser } from '../../api';
import './Login.css';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const role = new URLSearchParams(location.search).get("role");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const data = await loginUser(email, password, role);
      console.log("Login successful:", data);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", role);
      navigate("/tools");
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    }
  };

  return (
    <div className="h-screen w-screen bg-[#2b2b2b] flex items-center justify-center">
      <div className="rainbow-shadow-login p-12 rounded-2xl">
        <div className="flex flex-col w-96 p-10 rounded-2xl bg-[#1e1e1e] text-white gap-6 relative z-10">
          <h2 className="text-4xl font-bold text-center mb-2">Login</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-4 rounded-xl bg-[#2b2b2b] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-4 rounded-xl bg-[#2b2b2b] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
          />

          <button
            onClick={handleLogin}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-md transition duration-300"
          >
            Login
          </button>

          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}

          <div className="text-center text-sm mt-2">
            <a href="#" className="text-blue-400 hover:underline">Forgot Password?</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
