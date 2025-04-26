import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });

      const token = res.data.token;
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token); // فك التوكن للحصول على الدور
      const role = decoded.role;

      // توجيه حسب الدور
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "teacher") {
        navigate("/teacher-dashboard");
      } else if (role === "student") {
        navigate("/student-dashboard");
      } else if (role === "maintenance") {
        navigate("/maintenance-dashboard");
      } else {
        setError("Unknown role");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h2 className="login-title">Login</h2>
        <p className="login-subtitle">Login to your account.</p>
        {error && <p className="error-message">{error}</p>}
        <div className="input-container">
          <input
            type="email"
            placeholder="E-mail Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
        </div>
        <div className="input-container">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
        </div>
        <div className="login-options">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <span className="reset-password" onClick={() => navigate("/reset-password")}>
            Reset Password?
          </span>
        </div>
        <button onClick={handleLogin} className="login-button">Login</button>
        <p className="signup-text">Don't have an account yet? <a href="#">Join KRIS today.</a></p>
      </div>
      <div className="login-right">
        <div className="overlay">
          <div className="carousel-indicators">
            <span className="active"></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
