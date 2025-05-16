import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email: email.trim(),
        password,
      });

      const { token } = response.data;

      // استخراج البيانات من التوكن
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log("Decoded payload:", payload);

      const userRole = payload.role;
      const userName = payload.name;
      console.log("Decoded name:", userName);

      // حفظ التوكن والاسم في localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userName", userName);
      // تحقق من تخزين البيانات في localStorage
    console.log("Stored name in localStorage:", localStorage.getItem("userName"));
    console.log("Decoded token:", JSON.parse(atob(localStorage.getItem("token").split('.')[1])));
      // التوجيه حسب الدور
      switch (userRole) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "teacher":
          navigate("/teacher-dashboard");
          break;
        case "student":
          navigate("/student-dashboard");
          break;
        case "maintenance":
          navigate("/maintenance-dashboard");
          break;
        default:
          setError("Unknown role");
          break;
      }

    } catch (error) {
      console.error("Login failed:", error);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h2 className="login-title">Login</h2>
        <p className="login-subtitle">Login to your account</p>
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
          <span
            className="reset-password"
            onClick={() => navigate("/reset-password")}
          >
            Reset Password?
          </span>
        </div>
        <button onClick={handleLogin} className="login-button">Login</button>
        <p className="signup-text">
          Don't have an account yet? <a href="#">Join KRIS today</a>
        </p> 
      </div>
      <div className="login-right">
        <div className="overlay">
          <p className="promo-text">
            Manage all <span className="highlight">Classroom Resources</span><br /> with ease and efficiency.
          </p>
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
