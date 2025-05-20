import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ReportForm.css";

const ReportForm = () => {
  const [bookedResources, setBookedResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState("");
  const [issueType, setIssueType] = useState("");
  const [customIssue, setCustomIssue] = useState("");
  const [issueDescription, setIssueDescription] = useState("");

  const userId = localStorage.getItem("userId"); // Make sure userId is stored after login

  useEffect(() => {
    axios
      .get("/api/bookings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setBookedResources(
          res.data.map((b) => ({
            id: b.resource_id,
            name: b.resource_name,
            location: b.resource_location  // ← تأكد أن هذا الحقل موجود فعلاً في الـ API
          }))
        );
      })
      .catch((err) => {
        console.error("Error fetching booked resources", err);
      });
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  const finalIssueType = issueType === "other" ? customIssue : issueType;

  // تحقق من القيم قبل الإرسال
  const reportData = {
    resource_id: selectedResource,
    reported_by: userId,
    issue_title: finalIssueType,
    issue_description: issueDescription || "No extra details", // حتى لا تكون فارغة
  };

  console.log("🟡 Sending Report:", reportData); // ← طباعة البيانات قبل الإرسال

  try {
    await axios.post("/api/maintenance/", reportData);

    alert("🟢 Report submitted successfully!");
    setSelectedResource("");
    setIssueType("");
    setCustomIssue("");
    setIssueDescription("");
  } catch (error) {
    console.error("🔴 Failed to submit report", error);
    alert("🔴 Failed to submit report.");
  }
};


  return (
    <div className="booking-content">
      <div className="report-form">
        <h3>📝 Report a Problem</h3>
        <form onSubmit={handleSubmit}>
          <label>🔧 Resource you want to report:</label>
          <select
            value={selectedResource}
            onChange={(e) => setSelectedResource(e.target.value)}
            required
          >
            <option value="">-- Select a booked resource --</option>
            {bookedResources.map((res, index) => (
              <option key={`${res.id}-${index}`} value={res.id}>
                {res.name} ({res.location})
              </option>
            ))}
          </select>

          <label>⚠️ Type of Issue:</label>
          <select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            required
          >
            <option value="">-- Select issue type --</option>
            <option value="Broken screen">Broken screen</option>
            <option value="Does not turn on">Does not turn on</option>
            <option value="Network issue">Network issue</option>
            <option value="other">Other</option>
          </select>

          {issueType === "other" && (
            <>
              <label>Specify the issue type:</label>
              <input
                type="text"
                value={customIssue}
                onChange={(e) => setCustomIssue(e.target.value)}
                placeholder="Describe the type of issue"
              />
            </>
          )}

          <label>Description (optional):</label>
          <textarea
            rows="3"
            placeholder="Provide additional details (optional)..."
            value={issueDescription}
            onChange={(e) => setIssueDescription(e.target.value)}
          />

          <button type="submit" className="submit-report-btn">
            📤 Submit Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;
