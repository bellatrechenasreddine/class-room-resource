import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    if (email === "admin@example.com" && password === "admin123") {
      navigate("/admin-dashboard");
    } else if (email === "teacher@example.com" && password === "teacher123") {
      navigate("/teacher-dashboard");
    } else if (email === "student@example.com" && password === "student123") {
      navigate("/student-dashboard");
    } else {
      setError("Invalid email or password");
    }
    if (email === "maintenance@example.com" && password === "maint123") {
      navigate("/maintenance-dashboard");
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
          <a onClick={() => navigate("/reset-password")} className="reset-password">
             <span 
    className="reset-password" 
    onClick={() => navigate("/reset-password")}
  >
    Reset Password?
  </span>
  </a>

        </div>
        <button onClick={handleLogin} className="login-button">Login</button>
        <p className="signup-text">Don't have an account yet? <a href="#">Join KRIS today.</a></p>
      </div>
      <div className="login-right">
        <div className="overlay">
          {/* <p className="promo-text">
            Manage all <span className="highlight">HR Operations</span> from the comfort of your home.
          </p> */}
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
