import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { FaBars, FaCalendarCheck, FaHistory, FaExclamationTriangle, FaSignOutAlt, FaChalkboardTeacher } from "react-icons/fa";
import "./StudentDashboard.css";
import TeacherBookingForm from "./TeacherBookingForm";
import BookingForm from "./BookingForm"
import ReportForm from "./ReportForm"
import NotificationBox from "../Components/NotificationBox"; // ✅ استيراد صندوق الإشعارات
import { FaBell } from "react-icons/fa"; // ✅ أيقونة الجرس

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null); // ✅ تعريف الحالة

  // // تعديل روفرم الحجز 
  // const [selectedResource, setSelectedResource] = useState("");
  // const [showForm, setShowForm] = useState(false);
  // // قائمة الموارد لكل فئة
  // const resourceOptions = {
  //   "PC": ["PC1", "PC2", "PC3"],
  //   "Datashow": ["Datashow1", "Datashow2"],
  //   "Whiteboard": ["Whiteboard1", "Whiteboard2"]
  // };

  // // عند الضغط على الصورة، نحدد الفئة ونظهر الفورم
  // const handleResourceClick = (category) => {
  //   setSelectedCategory(category);
  //   setSelectedResource(""); // تصفير الاختيار السابق
  //   setShowForm(true);
  // };


  const navigate = useNavigate(); // 🔄 التنقل بين الصفحات


  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false); // إغلاق الشريط الجانبي عند الاختيار
  };


  const handleLogout = () => {
    navigate("/login"); // 🔄 إعادة التوجيه إلى صفحة تسجيل الدخول
  };

  // over view 
  // بيانات الحجوزات كمثال
const bookingHistory = [
  { id: 1, resource: "Projector", date: "2025-04-01" },
  { id: 2, resource: "Laptop", date: "2025-03-28" },
  { id: 3, resource: "Projector", date: "2025-03-25" },
  { id: 4, resource: "Tablet", date: "2025-03-20" },
  { id: 5, resource: "Projector", date: "2025-03-15" },
];

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
//  NOTificaion 
const [notifications, setNotifications] = useState([
  "🔔 لديك حجز قادم يوم غد!",
  "🔔 لا تنسَ إرجاع المعدات في الوقت المحدد."
]);
const [isOpen, setIsOpen] = useState(false); // ✅ حالة التحكم في فتح/إغلاق الإشعارات

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
          <FaChalkboardTeacher className="logo-icon" /> <span>Student Dashboard</span>
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

        {/* {activeTab === "booking" && (
  <div className="booking-section">
    <h2>Choose a Resource</h2>
    <div className="resource-options">
      <img src="/images/pc.png" alt="PC" onClick={() => setSelectedCategory("PC")} />
      <img src="/images/datashow.png" alt="Datashow" onClick={() => setSelectedCategory("Datashow")} />
      <img src="/images/board.png" alt="Board" onClick={() => setSelectedCategory("Board")} />
    </div>

    {selectedCategory && (
      <form className="booking-form">
        <label>Resource Category:</label>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="PC">PC</option>
          <option value="Datashow">Datashow</option>
          <option value="Board">Board</option>
        </select>

        <label>Resource Name:</label>
        <select>
          {selectedCategory === "PC" && ["PC1", "PC2", "PC3"].map((item) => <option key={item}>{item}</option>)}
          {selectedCategory === "Datashow" && ["Datashow1", "Datashow2"].map((item) => <option key={item}>{item}</option>)}
          {selectedCategory === "Board" && ["Board1", "Board2"].map((item) => <option key={item}>{item}</option>)}
        </select>

        <button type="submit">Book Now</button>
      </form>
    )}
  </div>
)} */}

{activeTab === "booking" && <TeacherBookingForm />}

{activeTab === "history" && <BookingForm />}
{activeTab === "report" && <ReportForm />}
      </main>
    </div>
  );
};

export default StudentDashboard;

