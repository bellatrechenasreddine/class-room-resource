import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MaintenancePage.css";

const MaintenancePage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIssueDescription, setSelectedIssueDescription] = useState("");

  const navigate = useNavigate();

  // جلب بيانات الصيانة من API
  const fetchMaintenanceRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/maintenance");
      setRequests(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load maintenance requests.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceRequests();
  }, []);

  // تغيير حالة الحل (تبديل بين محلول وغير محلول)
  const toggleResolved = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/maintenance/resolve/${id}`);
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? res.data : req))
      );
    } catch (err) {
      alert("Error updating resolve status.");
    }
  };

  // حذف بلاغ الصيانة
  const deleteRequest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/maintenance/${id}`);
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (err) {
      alert("Error deleting report.");
    }
  };

  // فتح نافذة التفاصيل
  const openModal = (description) => {
    setSelectedIssueDescription(description);
    setModalOpen(true);
  };

  // إغلاق النافذة
  const closeModal = () => {
    setModalOpen(false);
    setSelectedIssueDescription("");
  };

  // تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem("token"); // عدل حسب ما تستخدم
    localStorage.removeItem("username");
    navigate("/login");
  };

  if (loading) return <p>Loading maintenance requests...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="maintenance-page">
      <h2>🛠 Maintenance Requests</h2>
      <table className="maintenance-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Resource</th>
            <th>Reported By</th>
            <th>Issue Title</th>
            <th>Date Reported</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td>{req.id}</td>
              <td>{req.resource_name || req.resource_id}</td>
              <td>{req.reporter_name || req.reported_by}</td>
              <td>{req.issue_title}</td>
              <td>{new Date(req.date_reported).toLocaleDateString()}</td>
              <td>{req.date_resolved ? "Resolved" : "Unresolved"}</td>
              <td>
                <button onClick={() => toggleResolved(req.id)}>🔄 Change</button>
                <button onClick={() => deleteRequest(req.id)}>🗑️ Delete</button>
                <button onClick={() => openModal(req.issue_description)}>🔍 More Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* زر تسجيل الخروج تحت الجدول بالمنتصف */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            borderRadius: "5px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
          }}
        >
          Logout
        </button>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Issue Description</h3>
            <p>{selectedIssueDescription}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenancePage;
