import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MaintenancePage.css";
import NotificationBox from "../Components/NotificationBox"; // ✅ استيراد صندوق الإشعارات
import { FaBell } from "react-icons/fa"; // ✅ أيقونة الجرس

const MaintenancePage = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([
    {
      id: 1,
      resource_id: 101,
      reported_by: 2001,
      issue_description: "Projector not working",
      date_reported: "2025-04-10",
      date_resolved: "",
    },
    {
      id: 2,
      resource_id: 102,
      reported_by: 2002,
      issue_description: "Printer paper jam",
      date_reported: "2025-04-09",
      date_resolved: "2025-04-10",
    },
  ]);

  const toggleResolved = (id) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              date_resolved: req.date_resolved
                ? ""
                : new Date().toISOString().split("T")[0],
            }
          : req
      )
    );
  };

  const deleteRequest = (id) => {
    setRequests((prev) => prev.filter((req) => req.id !== id));
  };

  const handleLogout = () => {
    navigate("/login");
  };


const [maintenanceNotifications, setMaintenanceNotifications] = useState([
  "⚙️Alert: Faulty device in lab 3",
  "🚨 A device in the library needs urgent repair"
]);


  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false); // التحكم في إشعارات الصيانة


  
  return (
    <div className="maintenance-page">
      {/* ✅ أيقونة الجرس للإشعارات */}
             {/* ✅ أيقونة الجرس لفتح صندوق الإشعارات */}
       <div className="notification-icon" onClick={() => setIsMaintenanceOpen(!isMaintenanceOpen)}>
        <FaBell size={24} />
        {maintenanceNotifications.length > 0 && <span className="badge">{maintenanceNotifications.length}</span>}
      </div>

      {/* ✅ صندوق الإشعارات المنسدل */}
      {isMaintenanceOpen && <NotificationBox notifications={maintenanceNotifications} showMaintenance={false} />}
      <h2>🛠 Maintenance Requests</h2>
      <table className="maintenance-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Resource ID</th>
            <th>Reported By</th>
            <th>Issue Description</th>
            <th>Date Reported</th>
            <th>Date Resolved</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td>{req.id}</td>
              <td>{req.resource_id}</td>
              <td>{req.reported_by}</td>
              <td>{req.issue_description}</td>
              <td>{req.date_reported}</td>
              <td>{req.date_resolved || "—"}</td>
              <td>
                <button onClick={() => toggleResolved(req.id)}>🔄 Change</button>
                <button onClick={() => deleteRequest(req.id)}>🗑️ Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="logout-container">
        <button className="logout-button" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default MaintenancePage;


