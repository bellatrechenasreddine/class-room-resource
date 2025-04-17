import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css"; // ملف تنسيق الصفحة

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleReset = () => {
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    // في التطبيق الفعلي، يجب إرسال طلب إلى الخادم لإرسال رابط إعادة التعيين
    setMessage("If this email is registered, you will receive a reset link.");
    
    // بعد التأكيد، يمكن إعادة توجيه المستخدم إلى صفحة تسجيل الدخول
    setTimeout(() => navigate("/login"), 3000);
  };

  return (
    <div className="reset-password-container">
  
 <h2>Reset Password</h2>
      <p>Enter your email address, and we'll send you a link to reset your password.</p>
      {message && <p className="message">{message}</p>}
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="reset-input"
      />
      <button onClick={handleReset} className="reset-button">Send Reset Link</button>
      <button onClick={() => navigate("/")} className="back-button">Back to Login</button>

    </div>
  );
}
