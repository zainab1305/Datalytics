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

    // ✅ Store user after successful login
    if (!isSignup) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    console.log("Success:", response.data);
    navigate("/dashboard");
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    alert(error.response?.data?.message || "Something went wrong.");
  }
};


  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 animate-fade-in">
      {/* Left Section */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-white p-12 animate-slide-up shadow-xl">
        <div className="text-center max-w-lg">
          <h1 className="text-7xl font-extrabold mb-6 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Datalytics
          </h1>
          <p className="text-xl leading-relaxed text-slate-600 mb-8">
            Transform your data into actionable insights with our advanced analytics platform.
          </p>
          <div className="flex justify-center space-x-4">
            <div className="w-3 h-3 bg-slate-400 rounded-full animate-bounce-slow"></div>
            <div className="w-3 h-3 bg-slate-500 rounded-full animate-bounce-slow" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-slate-600 rounded-full animate-bounce-slow" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>

      {/* Right Auth Form */}
      <div className="w-1/2 flex justify-center items-center p-8 bg-slate-100">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-10 text-center animate-slide-up" style={{animationDelay: '0.2s'}}>
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-2 text-slate-800">
              {isSignup ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-slate-600">
              {isSignup ? "Join our analytics community" : "Sign in to your account"}
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
            {isSignup && (
              <div className="animate-fade-in">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-slate-50 hover:bg-white text-slate-800 placeholder-slate-500"
                  required
                />
              </div>
            )}

            <div className="animate-fade-in" style={{animationDelay: '0.1s'}}>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-slate-50 hover:bg-white text-slate-800 placeholder-slate-500"
                required
              />
            </div>

            <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
              <input
                type="password"
                placeholder={isSignup ? "Create Password" : "Password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-slate-50 hover:bg-white text-slate-800 placeholder-slate-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl text-lg mt-8"
            >
              {isSignup ? "Create Account" : "Sign In"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-600">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <span
                className="text-blue-600 font-semibold cursor-pointer hover:text-blue-800 transition-colors duration-200 hover:underline"
                onClick={toggleForm}
              >
                {isSignup ? "Sign in here" : "Sign up here"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

}

export default AuthForm;
