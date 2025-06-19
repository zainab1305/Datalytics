import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AuthForm() {
  const [isSignup, setIsSignup] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsSignup(!isSignup);
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async () => {
    try {
      const endpoint = isSignup
        ? "http://localhost:5001/api/analytics/signup"
        : "http://localhost:5001/api/analytics/login";

      const payload = isSignup
        ? { name, email, password }
        : { email, password };

      const response = await axios.post(endpoint, payload);
      console.log("Success:", response.data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Gradient Section */}
      <div className="w-1/2 bg-gradient-to-r from-[#d7b4f3] via-[#eacdfc] to-[#f9eafc] flex flex-col justify-center items-center text-[#4a2d63] p-10">
        <h1 className="text-5xl font-extrabold mb-4">Datalytics</h1>
        <p className="text-lg text-center max-w-md">
          Dive deep into your data and visualize insights in seconds.
        </p>
      </div>

      {/* Right Auth Form */}
      <div className="w-1/2 flex justify-center items-center bg-white">
        <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">{isSignup ? "Sign Up" : "Login"}</h2>

          {isSignup && (
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          )}

          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
          />

          <input
            type="password"
            placeholder={isSignup ? "Create Password" : "Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-5 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-[#c084fc] hover:bg-[#b26bfa] text-white py-3 rounded-lg font-semibold transition"
          >
            {isSignup ? "Create Account" : "Login"}
          </button>

          <p className="mt-4 text-sm text-gray-600">
            {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
            <span
              className="text-[#7e22ce] font-medium cursor-pointer hover:underline"
              onClick={toggleForm}
            >
              {isSignup ? "Login" : "Sign Up"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
