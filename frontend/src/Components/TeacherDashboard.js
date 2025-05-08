import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { FaBars, FaCalendarCheck, FaHistory, FaExclamationTriangle, FaSignOutAlt, FaChalkboardTeacher, FaBell } from "react-icons/fa";
import "./TeacherDashboard.css";
import BookingForm from "./BookingForm";
import HistoryBooking from "./HistoryBooking";
import ReportForm from "./ReportForm";
import NotificationBox from "../Components/NotificationBox";
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

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [stats, setStats] = useState([]);

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
  const displayName = user ? `Teacher ${user.name}` : "Teacher";

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('/api/bookings/history');
        setBookingHistory(response.data);
      } catch (error) {
        console.error('Failed to fetch booking history:', error);
      }
    };

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get("/api/bookings/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchHistory();
    fetchStats();
  }, []);

  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const [notifications, setNotifications] = useState([
    "📅 لديك حجز لموارد تعليمية غدًا!",
    "⚠️ الرجاء التأكد من توفر الموارد المحجوزة."
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [maintenanceNotifications, setMaintenanceNotifications] = useState([]);

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
    <div className="teacher-dashboard">
      <div className="notification-icon" onClick={() => setIsOpen(!isOpen)}>
        <FaBell size={24} />
        {notifications.length > 0 && <span className="badge">{notifications.length}</span>}
      </div>

      {isOpen && <NotificationBox notifications={notifications} showMaintenance={false} />}

      <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <FaBars />
      </button>

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
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
        {activeTab === "report" && (
          <ReportForm setMaintenanceNotifications={setMaintenanceNotifications} />
        )}
      </main>
    </div>
  );
};

export default TeacherDashboard;
