import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { FaBars, FaCalendarCheck, FaHistory, FaExclamationTriangle, FaSignOutAlt, FaChalkboardTeacher } from "react-icons/fa";
import "./TeacherDashboard.css";
import BookingForm from "./BookingForm";
import HistoryBooking from "./HistoryBooking"
import ReportForm from "./ReportForm"
import NotificationBox from "../Components/NotificationBox"; // استيراد مكون الإشعارات
import { FaBell } from "react-icons/fa"; // ✅ أيقونة الجرس

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null); // ✅ تعريف الحالة

  const navigate = useNavigate(); // 🔄 التنقل بين الصفحات


  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false); // إغلاق الشريط الجانبي عند الاختيار
  };


  const handleLogout = () => {
    navigate("/login"); // 🔄 إعادة التوجيه إلى صفحة تسجيل الدخول
  };

// حساب عدد الحجوزات
const totalBookings = bookingHistory.length;

// حساب أشهر مورد مستخدم
const resourceCount = bookingHistory.reduce((acc, booking) => {
  acc[booking.resource] = (acc[booking.resource] || 0) + 1;
  return acc;
}, {});

const mostUsedResource = Object.keys(resourceCount).reduce((a, b) =>
  resourceCount[a] > resourceCount[b] ? a : b
);
// Notification 
const [notifications, setNotifications] = useState([
  "📅 لديك حجز لموارد تعليمية غدًا!",
  "⚠️ الرجاء التأكد من توفر الموارد المحجوزة."
]);
const [isOpen, setIsOpen] = useState(false); // ✅ حالة التحكم في فتح/إغلاق الإشعارات


// report and notification
const [maintenanceNotifications, setMaintenanceNotifications] = useState([]);

  return (
    <div className="teacher-dashboard">
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
          <FaChalkboardTeacher className="logo-icon" /> <span>Teacher Dashboard</span>
        </button>

        <button className={activeTab === "booking" ? "active" : ""} onClick={() => handleTabClick("booking")}>
          <FaCalendarCheck /> Booking
        </button>
        <button className={activeTab === "history" ? "active" : ""} onClick={() => handleTabClick("history")}>
          <FaHistory /> Booking history
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
    {/* <NotificationBox notifications={notifications} /> */}

    <div className="stats-container">
      <div className="stat-card">
        <h3>📅 Total Bookings</h3>
        <p>{totalBookings}</p>
      </div>
      <div className="stat-card">
        <h3>🔥 Most Used Resource</h3>
        <p>{mostUsedResource}</p>
      </div>
    </div>
  </div>
)}

{activeTab === "booking" && <BookingForm />}

{activeTab === "history" && <HistoryBooking />}
{/* {activeTab === "report" && <ReportForm />} */}
{activeTab === "report" && (
  <ReportForm setMaintenanceNotifications={setMaintenanceNotifications} />
)}


      </main>
    </div>
  );
};

export default TeacherDashboard;
