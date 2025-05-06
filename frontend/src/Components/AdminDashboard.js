
// logout 
import BookingForm from "./BookingForm"

import { useNavigate } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import React, { useState ,useEffect } from "react";
import "./Dashboard.css";
import { FaChartBar, FaClipboardList, FaCogs, FaSignOutAlt, FaDatabase, FaUserShield,FaBars } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";  // إضافة هذا السطر
import HistoryBooking from "./HistoryBooking"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend } from "chart.js";
import NotificationBox from "../Components/NotificationBox"; // استيراد مكون الإشعارات
import { FaBell } from "react-icons/fa"; // ✅ أيقونة الجرس
import Loader from "../Components/Loader"; // استيراد اللودر
import resourceOptions from "./resourceOptions"; // استيراد الموارد
import axios from 'axios';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend);




const AdminDashboard = () => {
// usesrs
const [users, setUsers] = useState([]);
const [newUser, setNewUser] = useState({ name: "", email: "", role: "" });
const [showAddUser, setShowAddUser] = useState(false);
const [showEditUser, setShowEditUser] = useState(false);  // نافذة التعديل
const [currentUser, setCurrentUser] = useState(null); // لتخزين المستخدم الحالي الذي سيتم تعديله
const [searchQuery, setSearchQuery] = useState('');

// جلب جميع المستخدمين من الباك اند
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };
  fetchUsers();
}, []);

// تصفية المستخدمين بناءً على حقل البحث
const filteredUsers = users.filter(user =>
  user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  user.email.toLowerCase().includes(searchQuery.toLowerCase())
);

// إضافة مستخدم جديد
const handleAddUser = async () => {
  if (newUser.name && newUser.email && newUser.role) {
    try {
      const response = await axios.post('http://localhost:5000/api/users', newUser);
      const addedUser = response.data;

      setUsers([...users, addedUser]); // إضافة المستخدم الجديد إلى القائمة
      setNewUser({ name: "", email: "", role: "" });
      setShowAddUser(false);
    } catch (error) {
      console.error("Error adding user", error);
      alert("حدث خطأ أثناء إضافة المستخدم");
    }
  }
};

// حذف مستخدم
const handleDeleteUser = async (id) => {
  const confirmDelete = window.confirm("هل أنت متأكد أنك تريد حذف هذا المستخدم؟");

  if (confirmDelete) {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setUsers(users.filter(user => user.id !== id)); // تحديث القائمة بعد الحذف
      alert("تم حذف المستخدم بنجاح");
    } catch (error) {
      console.error("Error deleting user", error);
      alert("حدث خطأ أثناء حذف المستخدم");
    }
  }
};

// تعديل مستخدم
const handleEditUser = (user) => {
  setCurrentUser(user);  // تخزين بيانات المستخدم الحالي
  setShowEditUser(true); // إظهار نافذة التعديل
};

// تأكيد التعديل
const handleUpdateUser = async () => {
  if (currentUser.name && currentUser.email && currentUser.role) {
    try {
      const response = await axios.put(`http://localhost:5000/api/users/${currentUser.id}`, currentUser);
      const updatedUser = response.data;

      // تحديث المستخدم في القائمة
      setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
      setShowEditUser(false);
      alert("تم تعديل المستخدم بنجاح");
    } catch (error) {
      console.error("Error updating user", error);
      alert("حدث خطأ أثناء تعديل المستخدم");
    }
  }
};
  

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
        label: "Bookings",
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
  const [resources, setResources] = useState([]);
  const [newResource, setNewResource] = useState({
    name: "",
    type: "",       // تغيير category إلى type
    status: "",     // إضافة status
    location: "",   // إضافة location
  });
  const [showAddResource, setShowAddResource] = useState(false);
  const [showEditResource, setShowEditResource] = useState(false);  
  const [currentResource, setCurrentResource] = useState(null);
  const [searchResourceQuery, setSearchResourceQuery] = useState('');
  const [customType, setCustomType] = useState(""); // لتخزين النوع اليدوي
  const [customLocation, setCustomLocation] = useState("");


  
  // جلب جميع الموارد من الباك اند
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/resources');
        setResources(response.data);
      } catch (error) {
        console.error("Failed to fetch resources", error);
      }
    };
    fetchResources();
  }, []);
  
  // تصفية الموارد بناءً على حقل البحث
  const filteredResources = resources.filter(resource =>
    resource.name.toLowerCase().includes(searchResourceQuery.toLowerCase()) ||
    resource.type.toLowerCase().includes(searchResourceQuery.toLowerCase()) ||   // تغيير category إلى type
    resource.location.toLowerCase().includes(searchResourceQuery.toLowerCase()) // إضافة location
  );
  
  // إضافة مورد جديد
  const handleAddResource = async () => {
    const typeToUse = newResource.type === "custom" ? customType : newResource.type;
  
    if (newResource.name && typeToUse && newResource.location) {
      try {
        const response = await axios.post('http://localhost:5000/api/resources', {
          ...newResource,
          type: typeToUse
        });
        const addedResource = response.data;
  
        setResources([...resources, addedResource]);
        setNewResource({ name: "", type: "", location: "" });
        setCustomType("");  // تفريغ النوع اليدوي
        setCustomLocation("");
        setShowAddResource(false);
      } catch (error) {
        console.error("Error adding resource", error);
        alert("حدث خطأ أثناء إضافة المورد");
      }
    } else {
      alert("يرجى ملء جميع الحقول!");
    }
  };
  
  
  // تعديل مورد
  const handleEditResource = (resource) => {
    setCurrentResource(resource);
    setShowEditResource(true);  // إظهار نافذة التعديل
  };
  
  // تأكيد التعديل
  const handleUpdateResource = async () => {
    if (currentResource.name && currentResource.type && currentResource.location) {  // تحقق من جميع الحقول
      try {
        const response = await axios.put(`http://localhost:5000/api/resources/${currentResource.id}`, currentResource);
        const updatedResource = response.data;
  
        // تحديث المورد في القائمة
        setResources(resources.map(resource => resource.id === updatedResource.id ? updatedResource : resource));
        setShowEditResource(false);
        alert("تم تعديل المورد بنجاح");
      } catch (error) {
        console.error("Error updating resource", error);
        alert("حدث خطأ أثناء تعديل المورد");
      }
    }
  };
  const handleDeleteResource = async (id) => {
    const confirmDelete = window.confirm("هل أنت متأكد أنك تريد حذف هذا المورد؟");
  
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/resources/${id}`);
        setResources(resources.filter(resource => resource.id !== id)); // تحديث القائمة بعد الحذف
        alert("تم حذف المورد بنجاح");
      } catch (error) {
        console.error("Error deleting resource", error);
        alert("حدث خطأ أثناء حذف المورد");
      }
    }
  };
  
  

// Bookings 
// 1. الحالة
const [Bookings, setBookings] = useState([]);
const [newBooking, setNewBooking] = useState({ id: '', resource_id: '', user_id: '', start_time: '', end_time: '', status: '' });
const [showAddRes, setShowAddRes] = useState(false);
const [searchResQuery, setSearchResQuery] = useState('');

// 2. جلب الحجوزات
useEffect(() => {
  axios.get('http://localhost:5000/api/bookings')
    .then(res => setBookings(res.data))
    .catch(err => console.error('Failed to fetch bookings', err));
}, []);

// 3. إضافة حجز جديد
const handleAddBooking = async () => {
  try {
    const res = await axios.post('http://localhost:5000/api/Bookings', newBooking);
    setBookings([...Bookings, res.data]);
    setShowAddRes(false);
    setNewBooking({ id: '', resource_id: '', user_id: '', start_time: '', end_time: '' });
  } catch (err) {
    console.error('Error adding Booking', err);
    alert('حدث خطأ أثناء إضافة الحجز');
  }
};

// 4. حذف حجز
const handleDeleteBooking = async (id) => {
  if (!window.confirm('هل تريد إلغاء هذا الحجز؟')) return;
  try {
    await axios.delete(`http://localhost:5000/api/Bookings/${id}`);
    setBookings(Bookings.filter(r => r.id !== id));
  } catch (err) {
    console.error('Error deleting Booking', err);
    alert('حدث خطأ أثناء إلغاء الحجز');
  }
};
const toggleActive = async (id, newStatus) => {
  try {
    await axios.patch(`http://localhost:5000/api/resources/${id}/active`, { is_active: newStatus });
    setResources(resources.map(r => r.id === id ? { ...r, is_active: newStatus } : r));
  } catch (err) {
    console.error("Error toggling resource", err);
  }
};

const [error, setError] = useState(null);

useEffect(() => {
  // تأكد من وجود التوكن في localStorage
  const token = localStorage.getItem('token');
  console.log("📦 Token being sent:", token); // تحقق من أن التوكن موجود فعلاً
  if (token) {
    axios.get('http://localhost:5000/api/bookings', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setBookings(response.data); // تحديث البيانات المعروضة
      })
      .catch(error => {
        console.error('❌ Error fetching bookings:', error); // اطبع التفاصيل
        setError(error.message); // التعامل مع الأخطاء
      });
  } else {
    setError('Token not found'); // في حال لم يكن التوكن موجودًا
  }
}, []); // يقوم بالتنفيذ مرة واحدة عند تحميل الصفحة

// Notification 
const [maintenanceNotifications, setMaintenanceNotifications] = useState([
  "⚙️Alert: Faulty device in lab 3",
  "🚨 A device in the library needs urgent repair"
]);

const [notifications, setNotifications] = useState([
"🔔 A new Booking request is pending!",
"🔔 A new Booking has been approved.",
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
      setBookings([
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
        <button className={activeTab === "Booking" ? "active" : ""} onClick={() => setActiveTab("Booking")}>
          <FaClipboardList className="icon" /> Booking
        </button>
        <button className={activeTab === "history" ? "active" : ""} onClick={() => handleTabClick("history")}>
          <FaHistory /> Booking History
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
                <h3>Bookings Statistics</h3>
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
              <option value="maintenance">Maintenance</option>

            </select>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={handleAddUser}>Confirm</button>
              <button className="delete-btn" onClick={() => setShowAddUser(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة منبثقة لتعديل بيانات المستخدم */}
      {showEditUser && (
  <div className="modal-overlay">
    <div className="modal">
      <h3>Edit User</h3>
      <input
        type="text"
        placeholder="Full Name"
        value={currentUser?.name || ''}
        onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={currentUser?.email || ''}
        onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
      />
      <select
        value={currentUser?.role || ''}
        onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
      >
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
        <option value="admin">Admin</option>
        <option value="maintenance">Maintenance</option>
      </select>

      {/* حقل تعديل كلمة السر */}
      <input
        type="password"
        placeholder="New Password"
        value={currentUser?.newPassword || ''}
        onChange={(e) => setCurrentUser({ ...currentUser, newPassword: e.target.value })}
      />

      <div className="modal-buttons">
        <button className="confirm-btn" onClick={handleUpdateUser}>Confirm</button>
        <button className="delete-btn" onClick={() => setShowEditUser(false)}>Cancel</button>
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
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEditUser(user)}>✏️ Edit</button>
                <button className="delete-btn" onClick={() => handleDeleteUser(user.id)}>🗑️ Delete</button>
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
        placeholder="🔍 Search by name, type, status, or location..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />

      {/* ➕ زر الإضافة */}
      <button className="add-resource-btn" onClick={() => setShowAddResource(true)}>➕ Add Resource</button>

      {/* نافذة الإضافة */}
      {showAddResource && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Resource</h3>
            <select
              value={newResource.type}
              onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
            >
              <option value="">-- Select Type --</option>
              <option value="Meeting Room">Meeting Room</option>
              <option value="Classroom">Classroom</option>
              <option value="Lab">Lab</option>
              <option value="Projector">Projector</option>
              <option value="Computer">Computer</option>
              <option value="Camera">Camera</option>
              <option value="Microphone">Microphone</option>
              <option value="Speaker">Speaker</option>
              <option value="custom">➕ Add New Type</option>
            </select>
            
            {/* عرض حقل الإدخال إذا اختار المستخدم "custom" */}
            {newResource.type === "custom" && (
              <input
                type="text"
                placeholder="Enter new type"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
              />
            )}
            <input
              type="text"
              placeholder="Resource Name"
              value={newResource.name}
              onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
            />
            <select
              value={newResource.location}
              onChange={(e) => setNewResource({ ...newResource, location: e.target.value })}
            >
              <option value="">-- Select Location --</option>
              <option value="College A">College A</option>
              <option value="College B">College B</option>
              <option value="College C">College C</option>
              <option value="custom">➕ Add New Location</option>
            </select>
            
            {/* إدخال مكان مخصص */}
            {newResource.location === "custom" && (
              <input
                type="text"
                placeholder="Enter new location"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
              />
            )}


            <div className="modal-buttons">
              <button className="confirm-btn" onClick={handleAddResource}>Confirm</button>
              <button className="delete-btn" onClick={() => setShowAddResource(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة التعديل */}
{showEditResource && currentResource && (
  <div className="modal-overlay">
    <div className="modal">
      <h3>Edit Resource</h3>
      <select
        value={newResource.type}
        onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
      >
        <option value="">-- Select Type --</option>
        <option value="Meeting Room">Meeting Room</option>
        <option value="Classroom">Classroom</option>
        <option value="Lab">Lab</option>
        <option value="Projector">Projector</option>
        <option value="Computer">Computer</option>
        <option value="Camera">Camera</option>
        <option value="Microphone">Microphone</option>
        <option value="Speaker">Speaker</option>
        <option value="custom">➕ Add New Type</option>
      </select>
      
      {/* عرض حقل الإدخال إذا اختار المستخدم "custom" */}
      {newResource.type === "custom" && (
        <input
          type="text"
          placeholder="Enter new type"
          value={customType}
          onChange={(e) => setCustomType(e.target.value)}
        />
      )}
      <input
        type="text"
        placeholder="Resource Name"
        value={currentResource.name}
        onChange={e => setCurrentResource({ ...currentResource, name: e.target.value })}
      />
      <select
              value={newResource.location}
              onChange={(e) => setNewResource({ ...newResource, location: e.target.value })}
            >
              <option value="">-- Select Location --</option>
              <option value="College A">College A</option>
              <option value="College B">College B</option>
              <option value="College C">College C</option>
              <option value="custom">➕ Add New Location</option>
            </select>
            
            {/* إدخال مكان مخصص */}
            {newResource.location === "custom" && (
              <input
                type="text"
                placeholder="Enter new location"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
              />
            )}
      <div className="modal-buttons">
        <button className="confirm-btn" onClick={handleUpdateResource}>
          Update
        </button>
        <button
          className="delete-btn"
          onClick={() => {
            setShowEditResource(false);
            setCurrentResource(null); // اختياري لتنظيف المورد الحالي
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


      {/* جدول الموارد */}
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Name</th>
            <th>Location</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {resources
            .filter((resource) =>
              resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              resource.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
              resource.location.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((resource, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{resource.type}</td>
                <td>{resource.name}</td>
                <td>{resource.location}</td>
      
                {/* ✅ خانة تفعيل / تعطيل */}
                <td>
                  <input
                    type="checkbox"
                    checked={resource.is_active}
                    onChange={() => toggleActive(resource.id, !resource.is_active)}
                  />
                </td>
      
                <td>
                  <button onClick={() => handleEditResource(resource)}>✏️ Edit</button>
                  <button onClick={() => handleDeleteResource(resource.id)}>🗑️ Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  </div>
)}

{activeTab === "Booking" && <BookingForm />}
{activeTab === "history" && <HistoryBooking />}
{activeTab === "reports" && (
  <div className="reports-container active">
    <h2>Reports</h2>
    <button className="report-btn" onClick={() => setReportType("usage")}>
      Create Report Usage
    </button>
    <button className="report-btn" onClick={() => setReportType("Booking")}>
      Create Report Booking
    </button>

    {reportType && (
  <div className="report-writing">
    <h3>{reportType === "usage" ? "Usage Report" : "Booking Report"}</h3>

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
        <label>Booking Report:</label>
        <textarea
          id="reportText"
          placeholder="Write your Booking report here..."
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
          alert("Please write the Booking report!");
          return;
        }

        alert("📊 Booking report saved successfully! (simulated)");
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








