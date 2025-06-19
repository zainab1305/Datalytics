import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Logging in...");

    try {
      const res = await axios.post("http://localhost:5001/api/analytics/login", formData);
      setMessage("✅ Login successful!");

      // Optional: store token if using JWT
      // localStorage.setItem("token", res.data.token);

      console.log("✅ Login Response:", res.data);

      // Optional: navigate to dashboard
      // window.location.href = "/dashboard";
    } catch (err) {
      setMessage("❌ Login failed. Please check your credentials.");
      console.error("Login error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
        <p>{message}</p>
      </form>
    </div>
  );
};

export default Login;
