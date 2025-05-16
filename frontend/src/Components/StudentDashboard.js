import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FaBars, FaCalendarCheck, FaHistory, FaExclamationTriangle, FaSignOutAlt, FaChalkboardTeacher, FaBell } from "react-icons/fa";
import "./StudentDashboard.css";
import BookingForm from "./BookingForm";
import HistoryBooking from "./HistoryBooking"
import ReportForm from "./ReportForm"
import NotificationBox from "../Components/NotificationBox"; // ✅ استيراد صندوق الإشعارات
import axios from 'axios';

// 📊 استيراد أدوات الرسم البياني
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    "🔔 You have a booking coming up tomorrow!",
    "🔔 Don't forget to return the equipment on time"
  ]);
  const [isOpen, setIsOpen] = useState(false); // ✅ حالة التحكم في فتح/إغلاق الإشعارات
  const [stats, setStats] = useState([]); // ⚙️ لتخزين الإحصائيات

  const navigate = useNavigate();

  const getUserFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  };

  const user = getUserFromToken();
  const displayName = user ? `Student ${user.name}` : "Student";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get("/api/bookings/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data); // تخزين الإحصائيات المسترجعة من الخادم
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false); // إغلاق الشريط الجانبي عند الاختيار
  };

  const handleLogout = () => {
    navigate("/login"); // 🔄 إعادة التوجيه إلى صفحة تسجيل الدخول
  };

  // ⚙️ بيانات الرسم البياني
  const barData = {
    labels: stats.map(item => item.type),  // عرض نوع المورد
    datasets: [{
      label: "Bookings by Resource Type",
      data: stats.map(item => item.booking_count),
      backgroundColor: "rgba(75, 192, 192, 0.6)", // اللون الخاص بالرسم البياني
    }]
  };
  
  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Bookings per Resource Type" }
    }
  };

  return (
    <div className="Student-dashboard">
      {/* ✅ أيقونة الجرس لفتح صندوق الإشعارات */}
      <div className="notification-icon" onClick={() => setIsOpen(!isOpen)}>
        <FaBell size={24} />
        {notifications.length > 0 && <span className="badge">{notifications.length}</span>}
      </div>

      {/* ✅ صندوق الإشعارات المنسدل */}
      {isOpen && <NotificationBox notifications={notifications} showMaintenance={false} />}

      <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <FaBars />
      </button>

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* 🌟 زر الشعار القابل للضغط يعيد المستخدم لصفحة "Overview" */}
        <button className={`logo-button ${activeTab === "overview" ? "active" : ""}`} onClick={() => handleTabClick("overview")}>
          <FaChalkboardTeacher className="logo-icon" /> <span>{displayName}</span>
        </button>

        <button className={activeTab === "booking" ? "active" : ""} onClick={() => handleTabClick("booking")}>
          <FaCalendarCheck /> Booking
        </button>
        <button className={activeTab === "history" ? "active" : ""} onClick={() => handleTabClick("history")}>
          <FaHistory /> Bookings history
        </button>
        <button className={activeTab === "report" ? "active" : ""} onClick={() => handleTabClick("report")}>
          <FaExclamationTriangle /> Report a problem
        </button>
        <button className="logout" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      <main className="main-content">
        {activeTab === "overview" && (
          <div className="overview-stats">
            <h2>📊 Dashboard Statistics</h2>
            <div className="chart-box" style={{ marginTop: "20px" }}>
              {barData.labels.length > 0 ? (
                <Bar data={barData} options={barOptions} />
              ) : (
                <p>Loading chart...</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "booking" && <BookingForm />}
        {activeTab === "history" && <HistoryBooking />}
        {activeTab === "report" && <ReportForm />}
      </main>
    </div>
  );
};

export default StudentDashboard;
