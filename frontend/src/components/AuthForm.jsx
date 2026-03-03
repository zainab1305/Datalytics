import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BarChart3, Database, Zap } from "lucide-react";

function AuthForm() {
  const [isSignup, setIsSignup] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsSignup(!isSignup);
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isSignup
        ? "http://localhost:5001/api/analytics/signup"
        : "http://localhost:5001/api/analytics/login";

      const payload = isSignup ? { name, email, password } : { email, password };

      const response = await axios.post(endpoint, payload);

      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-cyan-500/10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col justify-center p-16 w-full">
          <h1 className="text-5xl xl:text-6xl font-bold text-gradient mb-6">
            Datalytics
          </h1>
          <p className="text-xl text-zinc-400 max-w-md leading-relaxed mb-12">
            Transform raw data into stunning visualizations and actionable insights with AI-powered analytics.
          </p>
          <div className="flex gap-8">
            {[
              { icon: BarChart3, label: "Rich Charts" },
              { icon: Database, label: "Excel & CSV" },
              { icon: Zap, label: "AI Insights" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10"
              >
                <Icon className="w-5 h-5 text-indigo-400" />
                <span className="text-zinc-300 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md animate-slide-up">
          <div className="lg:hidden mb-8">
            <h1 className="text-3xl font-bold text-gradient">Datalytics</h1>
          </div>

          <div className="glass-effect p-8 lg:p-10 rounded-3xl border border-white/10">
            <div className="mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-zinc-100 mb-2">
                {isSignup ? "Create your account" : "Welcome back"}
              </h2>
              <p className="text-zinc-500">
                {isSignup
                  ? "Join thousands analyzing data smarter"
                  : "Sign in to continue to your dashboard"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignup && (
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Full name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  {isSignup ? "Password" : "Password"}
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Please wait..." : isSignup ? "Create account" : "Sign in"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-sm text-zinc-500 text-center">
                {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={toggleForm}
                  className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors"
                >
                  {isSignup ? "Sign in" : "Sign up"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
