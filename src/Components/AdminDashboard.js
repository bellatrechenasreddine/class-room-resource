
// logout 
import TeacherBookingForm from "./TeacherBookingForm"

import { useNavigate } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import React, { useState ,useEffect } from "react";
import "./Dashboard.css";
import { FaChartBar, FaClipboardList, FaCogs, FaSignOutAlt, FaDatabase, FaUserShield,FaBars } from "react-icons/fa";
//  داىره import { Bar, Pie } from "react-chartjs-2";
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend } from "chart.js";
import NotificationBox from "../Components/NotificationBox"; // استيراد مكون الإشعارات
import { FaBell } from "react-icons/fa"; // ✅ أيقونة الجرس
import Loader from "../Components/Loader"; // استيراد اللودر
import resourceOptions from "./resourceOptions"; // استيراد الموارد

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend);




const AdminDashboard = () => {
// usesrs
  const [users, setUsers] = useState([
    { name: "Ahmed Saleh", email: "ahmed@example.com", role: "teacher" },
    { name: "Layla Amine", email: "layla@example.com", role: "student" }
  ]);
  
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "" });
  
  const handleAddUser = () => {
    if (newUser.name && newUser.email && newUser.role) {
      setUsers([...users, newUser]);
      setNewUser({ name: "", email: "", role: "" });
      setShowAddUser(false);
    }
  };
  
  const handleDeleteUser = (index) => {
    const updatedUsers = [...users];
    updatedUsers.splice(index, 1);
    setUsers(updatedUsers);
  };

  // resherch 
  const [searchTerm, setSearchTerm] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

  // report 

  const [activeTab, setActiveTab] = useState("dashboard");
  const [reportType, setReportType] = useState("");
  // iphone 
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false); // إغلاق الشريط الجانبي بعد الضغط
    setLoading(true); // ⏳ تشغيل اللودر
    setTimeout(() => {
      setActiveTab(tab);
      setLoading(false); // ⏳ إيقاف اللودر بعد تحميل المحتوى
    }, 1500); // ⏳ محاكاة تحميل البيانات
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
    setLoading(true);
    setTimeout(() => {
      setResources([...resources, newResource]);
      setNewResource({ name: "", category: "" });
      setShowAddResource(false);
      setLoading(false);
    }, 1500);
  } else {
    alert("يرجى ملء جميع الحقول!");
  }
};


// const handleAddResource = () => {
//   if (newResource.name.trim() && newResource.category.trim()) {
//     setResources([...resources, newResource]); // إضافة المورد الجديد
//     setNewResource({ name: "", category: "" }); // تصفير الحقول
//     setShowAddResource(false); // إغلاق النموذج
//   } else {
//     alert("يرجى ملء جميع الحقول!");
//   }
// };
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
  setLoading(true);
  setTimeout(() => {
    console.log(`✅ تم تأكيد الحجز رقم ${id}`);
    setLoading(false);
  }, 1500);
};

// const confirmReservation = (id) => {
//   console.log(`✅ تم تأكيد الحجز رقم ${id}`);
// };

// حذف الحجز
const deleteReservation = (id) => {
  setLoading(true);
  setTimeout(() => {
    setReservations(reservations.filter(reservation => reservation.id !== id));
    setLoading(false);
  }, 1500);
};

// const deleteReservation = (id) => {
//   setReservations(reservations.filter(reservation => reservation.id !== id));
// };

// طلب إصلاح
const requestRepair = (id) => {
  setLoading(true);
  setTimeout(() => {
    console.log(`🔧 تم طلب إصلاح للمورد رقم ${id}`);
    setLoading(false);
  }, 1500);
};

// const requestRepair = (id) => {
//   console.log(`🔧 تم طلب إصلاح للمورد رقم ${id}`);
// };

// تغيير حالة الصيانة
const toggleMaintenanceStatus = (id) => {
  setLoading(true);
  setTimeout(() => {
    setMaintenanceRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === id ? {
          ...req,
          status: req.status === "Fixed" ? "Out of Order" : "Fixed"
        } : req
      )
    );
    setLoading(false);
  }, 1500);
};

// const toggleMaintenanceStatus = (id) => {
//   setMaintenanceRequests(prevRequests =>
//     prevRequests.map(req =>
//       req.id === id ? { ...req, status: req.status === "Fixed" ? "Out of Order" : "Fixed" } : req
//     )
//   );
// };

// حذف طلب الصيانة
const deleteMaintenanceRequest = (id) => {
  setLoading(true);
  setTimeout(() => {
    setMaintenanceRequests(maintenanceRequests.filter(req => req.id !== id));
    setLoading(false);
  }, 1500);
};

// const deleteMaintenanceRequest = (id) => {
//   setMaintenanceRequests(maintenanceRequests.filter(req => req.id !== id));
// };
// Notification 
const [maintenanceNotifications, setMaintenanceNotifications] = useState([
  "⚙️Alert: Faulty device in lab 3",
  "🚨 A device in the library needs urgent repair"
]);

const [notifications, setNotifications] = useState([
"🔔 A new reservation request is pending!",
"🔔 A new reservation has been approved.",
"🔔 A new issue has been reported!"
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


  const [loading, setLoading] = useState(true); // ⏳ حالة التحميل

  useEffect(() => {
    // محاكاة تحميل البيانات من API مع تأخير
    setTimeout(() => {
      setReservations([
        { id: 101, resource: "Projector", user: "John Doe", date: "2025-04-01" },
        { id: 102, resource: "Whiteboard", user: "Jane Smith", date: "2025-04-02" }
      ]);
      setLoading(false); // ⏳ إيقاف التحميل
    }, 2000); // ⏳ محاكاة تأخير 2 ثانية
  }, []);
  
  // نتاع الحدف والتحديث للمورد
  const [editIndex, setEditIndex] = useState(null);
const [editResource, setEditResource] = useState({ name: "", category: "" });

const handleEdit = (index) => {
  setEditIndex(index);
  setEditResource({ ...resources[index] });
};

const handleUpdateResource = () => {
  if (editResource.name.trim() && editResource.category.trim()) {
    const updated = [...resources];
    updated[editIndex] = editResource;
    setResources(updated);
    setEditIndex(null);
  } else {
    alert("Please fill in all fields.");
  }
};

const handleDelete = (index) => {
  const filtered = resources.filter((_, i) => i !== index);
  setResources(filtered);
};

  // save report 
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedResource, setSelectedResource] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [usageReports, setUsageReports] = useState([]);
  

  return (
    <div className="dashboard-container">
       {loading ? (
        <Loader /> // ✅ عرض اللودر أثناء التحميل
      ) : (
        <>
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

        <button className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>
         <FaUsers className="icon" /> Users
          </button>

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


{activeTab === "users" && (
  <div className="table-container active">
    <div className="responsive-table">
      <h2>User Management</h2>

      {/* 🔍 حقل البحث */}
      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />

      {/* ➕ زر الإضافة */}
      <button className="add-resource-btn" onClick={() => setShowAddUser(true)}>➕ Add User</button>

      {/* نافذة منبثقة لإضافة مستخدم جديد */}
      {showAddUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New User</h3>
            <input
              type="text"
              placeholder="Full Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={handleAddUser}>Confirm</button>
              <button className="delete-btn" onClick={() => setShowAddUser(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* جدول المستخدمين */}
      <table border="1">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDeleteUser(index)}>🗑️ Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}


{activeTab === "resource" && (
  <div className="table-container active">
    <div className="responsive-table">
      <h2>Resource Management</h2>

      {/* 🔍 محرك البحث */}
      <input
        type="text"
        placeholder="🔍 Search by name or category..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {/* ➕ زر الإضافة */}
      <button className="add-resource-btn" onClick={() => setShowAddResource(true)}>➕ Add Resource</button>

      {/* نافذة الإضافة */}
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

      {/* نافذة التعديل */}
      {editIndex !== null && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Resource</h3>
            <input
              type="text"
              placeholder="Resource Name"
              value={editResource.name}
              onChange={(e) => setEditResource({ ...editResource, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Category"
              value={editResource.category}
              onChange={(e) => setEditResource({ ...editResource, category: e.target.value })}
            />
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={handleUpdateResource}>Update</button>
              <button className="delete-btn" onClick={() => setEditIndex(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* جدول الموارد */}
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {resources
            .filter((resource) =>
              resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              resource.category.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((resource, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{resource.name}</td>
                <td>{resource.category}</td>
                <td>
                  <button onClick={() => handleEdit(index)}>✏️ Edit</button>
                  <button onClick={() => handleDelete(index)}>🗑️ Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  </div>
)}




{activeTab === "reservation" && <TeacherBookingForm />}

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
                      {req.status === "Fixed" ? "✔ Repairman" : "❌ Not fixed"}
                    </td>
                    <td>
                      {/* <button className="repair-btn" onClick={() => requestRepair(req.id)}>🔧 Repair request</button> */}
                      <button className="toggle-btn" onClick={() => toggleMaintenanceStatus(req.id)}>🔄 Change status</button>
                      <button className="delete-btn" onClick={() => deleteMaintenanceRequest(req.id)}>🗑️ Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
         
          </>
        
        )}

        {/* {activeTab === "reports" && (
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
                <h3>{reportType === "usage" ? "Usage Report"
                 : "Reservation Report"}</h3>
                <textarea id="reportText" placeholder="Write your report here..." />
                <button className="save-report-btn" onClick={() => {
                  let reportContent = document.getElementById("reportText").value;
                  if (reportContent.trim() === "") {
                    alert("Please write the report before saving!");
                  } else {
                    alert("✅ Report saved successfully!");
                  }
                }}>
                  💾 Save the report
                </button>
 

              </div>
            )}
          </div>
        )} */}
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

    {reportType === "usage" ? (
      <>
        {/* ✅ Resource Category & Resource Name */}
        <label>Resource Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedResource("");
          }}
          required
        >
          <option value="">Select a category</option>
          {Object.keys(resourceOptions).map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>

        {selectedCategory && (
          <>
            <label>Resource Name:</label>
            <select
              value={selectedResource}
              onChange={(e) => setSelectedResource(e.target.value)}
              required
            >
              <option value="">Select a resource</option>
              {resourceOptions[selectedCategory].map((res, i) => (
                <option key={i} value={res}>{res}</option>
              ))}
            </select>
          </>
        )}

        <label>Issue Description:</label>
        <textarea
          rows="3"
          placeholder="Describe the issue..."
          value={issueDescription}
          onChange={(e) => setIssueDescription(e.target.value)}
          required
        />
      </>
    ) : (
      <>
        {/* ✅ textarea لتقرير الحجز */}
        <label>Reservation Report:</label>
        <textarea
          id="reportText"
          placeholder="Write your reservation report here..."
          required
        />
      </>
    )}

    <button className="save-report-btn" onClick={() => {
      const content =
        reportType === "usage" ? issueDescription.trim() : document.getElementById("reportText").value.trim();

      if (reportType === "usage") {
        if (!selectedCategory || !selectedResource || content === "") {
          alert("Please fill in all fields!");
          return;
        }

        setUsageReports(prev => [
          ...prev,
          `${selectedCategory} - ${selectedResource}: ${content}`
        ]);

        setMaintenanceNotifications(prev => [
          ...prev,
          `📢 Issue with ${selectedResource} (${selectedCategory}): ${content.slice(0, 40)}...`
        ]);
      } else {
        if (content === "") {
          alert("Please write the reservation report!");
          return;
        }

        alert("📊 Reservation report saved successfully! (simulated)");
      }

      alert("✅ Report saved successfully!");
      setSelectedCategory("");
      setSelectedResource("");
      setIssueDescription("");
      document.getElementById("reportText").value = "";
      setReportType("");
    }}>
      💾 Save the report
    </button>
  </div>
)}

  </div>
)}

      </main>
      </> )}
    </div>
  );
};

export default AdminDashboard;








