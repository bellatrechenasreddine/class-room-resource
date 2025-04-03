
// logout 
import { useNavigate } from "react-router-dom";

import React, { useState } from "react";
import "./Dashboard.css";
import { FaChartBar, FaClipboardList, FaCogs, FaSignOutAlt, FaDatabase, FaUserShield,FaBars } from "react-icons/fa";
//  داىره import { Bar, Pie } from "react-chartjs-2";
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend } from "chart.js";
import NotificationBox from "../Components/NotificationBox"; // استيراد مكون الإشعارات
import { FaBell } from "react-icons/fa"; // ✅ أيقونة الجرس

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [reportType, setReportType] = useState("");
  // iphone 
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false); // إغلاق الشريط الجانبي بعد الضغط
  };
// logout 
const navigate = useNavigate();

  const barData = {
    labels: ["Projector", "Whiteboard", "Laptop", "Tablet"],
    datasets: [
      {
        label: "Reservations",
        data: [10, 15, 8, 12],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false, // يجعل المخطط يستجيب لحجم الحاوية
    scales: {
      x: {
        ticks: { font: { size: 14 } }, // حجم النص على المحور X
        grid: { display: false }, // إخفاء الخطوط الخلفية للمحور X
        barThickness: 40, // التحكم في عرض العمود
        maxBarThickness: 70, // الحد الأقصى لعرض العمود
      },
      y: {
        beginAtZero: true,
        ticks: { font: { size: 14 } },
      },
    },
  };
  

  // resource 
  const [showAddResource, setShowAddResource] = useState(false);
const [newResource, setNewResource] = useState({ name: "", category: "" });
const [resources, setResources] = useState([
  { name: "Projector", category: "Electronics" },
  { name: "Whiteboard", category: "Office" },
]);

const handleAddResource = () => {
  if (newResource.name.trim() && newResource.category.trim()) {
    setResources([...resources, newResource]); // إضافة المورد الجديد
    setNewResource({ name: "", category: "" }); // تصفير الحقول
    setShowAddResource(false); // إغلاق النموذج
  } else {
    alert("يرجى ملء جميع الحقول!");
  }
};
// reservation maintananvce 
// بيانات الحجوزات
const [reservations, setReservations] = useState([
  { id: 101, resource: "Projector", user: "John Doe", date: "2025-04-01" },
  { id: 102, resource: "Whiteboard", user: "Jane Smith", date: "2025-04-02" }
]);

// بيانات طلبات الصيانة
const [maintenanceRequests, setMaintenanceRequests] = useState([
  { id: 201, resource: "Projector", status: "Fixed" },
  { id: 202, resource: "Printer", status: "Out of Order" }
]);

// تأكيد الحجز
const confirmReservation = (id) => {
  console.log(`✅ تم تأكيد الحجز رقم ${id}`);
};

// حذف الحجز
const deleteReservation = (id) => {
  setReservations(reservations.filter(reservation => reservation.id !== id));
};

// طلب إصلاح
const requestRepair = (id) => {
  console.log(`🔧 تم طلب إصلاح للمورد رقم ${id}`);
};

// تغيير حالة الصيانة
const toggleMaintenanceStatus = (id) => {
  setMaintenanceRequests(prevRequests =>
    prevRequests.map(req =>
      req.id === id ? { ...req, status: req.status === "Fixed" ? "Out of Order" : "Fixed" } : req
    )
  );
};

// حذف طلب الصيانة
const deleteMaintenanceRequest = (id) => {
  setMaintenanceRequests(maintenanceRequests.filter(req => req.id !== id));
};
// Notification 
const [maintenanceNotifications, setMaintenanceNotifications] = useState([
  "⚙️ تنبيه: جهاز معطل في المختبر 3",
  "🚨 جهاز في المكتبة يحتاج إلى إصلاح عاجل"
]);

const [notifications, setNotifications] = useState([
  "🔔 طلب حجز جديد في الانتظار!",
  "🔔 تمت الموافقة على حجز جديد.",
  "🔔 مشكلة جديدة تم الإبلاغ عنها!"
]);
const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false); // التحكم في إشعارات الصيانة

  const toggleAdminNotifications = () => {
    setIsAdminOpen(!isAdminOpen);
    setIsMaintenanceOpen(false); // إغلاق إشعارات الصيانة عند فتح إشعارات المسؤول
  };
  const toggleMaintenanceNotifications = () => {
    setIsMaintenanceOpen(!isMaintenanceOpen);
    setIsAdminOpen(false); // إغلاق إشعارات المسؤول عند فتح إشعارات الصيانة
  };

  return (
    <div className="dashboard-container">
            {/* ✅ أيقونة الجرس للإشعارات */}
            <div className="notification-icon" onClick={toggleAdminNotifications}>
        <FaBell size={24} />
        {notifications.length > 0 && <span className="badge">{notifications.length}</span>}
      </div>

      {/* ✅ صندوق الإشعارات المنسدل */}
      {isAdminOpen && <NotificationBox notifications={notifications} showMaintenance={false} />}

 
      {/* زر إظهار وإخفاء القائمة الجانبية عند العرض على الهاتف */}
<button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
  <FaBars size={24} />
</button>

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <h2 className={`logo ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => setActiveTab("dashboard")}>
          <FaUserShield className="admin-icon" /> Admin Dashboard
        </h2>

        <button className={activeTab === "resource" ? "active" : ""} onClick={() => setActiveTab("resource")}>
          <FaDatabase className="icon" /> Resource
        </button>
        <button className={activeTab === "reservation" ? "active" : ""} onClick={() => setActiveTab("reservation")}>
          <FaClipboardList className="icon" /> Reservation
        </button>
        <button className={activeTab === "maintenance" ? "active" : ""} onClick={() => setActiveTab("maintenance")}>
          <FaCogs className="icon" /> Maintenance
        </button>
        <button className={activeTab === "reports" ? "active" : ""} onClick={() => { 
          setActiveTab("reports");
          setReportType("");
        }}>
          <FaChartBar className="icon" /> Reports
        </button>
        
        <button className="logout" onClick={() => navigate("/login")}>
  <FaSignOutAlt className="icon" /> Logout
</button>

      </aside>


      <main className="main-content">
        {activeTab === "dashboard" && (
          <div className="dashboard-home active">
            <h2>Dashboard Overview</h2>
            <div className="charts-container">
              <div className="chart-box">
                <h3>Reservations Statistics</h3>
                <Bar data={barData}  options={barOptions}/>
              </div>
              
            </div>
          </div>
        )}


{activeTab === "resource" && (
  <div className="table-container active">
     <div className="responsive-table">
    <h2>Resource Management</h2>
    
    <button className="add-resource-btn" onClick={() => setShowAddResource(true)}>➕ Add Resource</button>

    {showAddResource && (
      <div className="modal-overlay">
        <div className="modal">
          <h3>Add New Resource</h3>
          <input
            type="text"
            placeholder="Resource Name"
            value={newResource.name}
            onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Category"
            value={newResource.category}
            onChange={(e) => setNewResource({ ...newResource, category: e.target.value })}
          />
          <div className="modal-buttons">
            <button className="confirm-btn" onClick={handleAddResource}>Confirm</button>
            <button className="delete-btn" onClick={() => setShowAddResource(false)}>Cancel</button>
          </div>
        </div>
      </div>
    )}

    <table border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Category</th>
        </tr>
      </thead>
      <tbody>
        {resources.map((resource, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{resource.name}</td>
            <td>{resource.category}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  </div>
)}


{activeTab === "reservation" && (
          <div className="table-container active">
             <div className="responsive-table">
            <h2>Reservation System</h2>
            <table border="1" className="styled-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Resource</th>
                  <th>User</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(res => (
                  <tr key={res.id}>
                    <td>{res.id}</td>
                    <td>{res.resource}</td>
                    <td>{res.user}</td>
                    <td>{res.date}</td>
                    <td>
                      <button className="confirm-btn" onClick={() => confirmReservation(res.id)}>✔ Confirm</button>
                      <button className="delete-btn" onClick={() => deleteReservation(res.id)}>❌ Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        )}

     
       {activeTab === "maintenance" && (
        
      <>
       
        {/* ✅ أيقونة الجرس للإشعارات */}
        <div className="notification-icon" onClick={toggleMaintenanceNotifications}>
        <FaBell size={24} />
        {maintenanceNotifications.length > 0 && <span className="badge">{maintenanceNotifications.length}</span>}
      </div>

      {/* ✅ صندوق الإشعارات المنسدل */}
      {isMaintenanceOpen && <NotificationBox maintenanceNotifications={maintenanceNotifications} showNotification={false} />}


          <div className="table-container active">

             <div className="responsive-table">
            <h2>Maintenance Logs</h2>
            <table border="1" className="styled-table">
              <thead>
                <tr>
                  <th>Maintenance ID</th>
                  <th>Resource</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceRequests.map(req => (
                  <tr key={req.id}>
                    <td>{req.id}</td>
                    <td>{req.resource}</td>
                    <td className={req.status === "Fixed" ? "fixed-status" : "out-order-status"}>
                      {req.status === "Fixed" ? "✔ مصلح" : "❌ غير مصلح"}
                    </td>
                    <td>
                      <button className="repair-btn" onClick={() => requestRepair(req.id)}>🔧 طلب إصلاح</button>
                      <button className="toggle-btn" onClick={() => toggleMaintenanceStatus(req.id)}>🔄 تغيير الحالة</button>
                      <button className="delete-btn" onClick={() => deleteMaintenanceRequest(req.id)}>🗑️ حذف</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
         
          </>
        
        )}

        {activeTab === "reports" && (
          <div className="reports-container active">
            <h2>Reports</h2>
            <button className="report-btn" onClick={() => setReportType("usage")}>
              Create Report Usage
            </button>
            <button className="report-btn" onClick={() => setReportType("reservation")}>
              Create Report Reservation
            </button>

            {reportType && (
              <div className="report-writing">
                <h3>{reportType === "usage" ? "Usage Report" : "Reservation Report"}</h3>
                <textarea id="reportText" placeholder="اكتب التقرير هنا..." />
                <button className="save-report-btn" onClick={() => {
                  let reportContent = document.getElementById("reportText").value;
                  if (reportContent.trim() === "") {
                    alert("يرجى كتابة التقرير قبل الحفظ!");
                  } else {
                    alert("✅ تم حفظ التقرير بنجاح!");
                  }
                }}>
                  💾 حفظ التقرير
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;








