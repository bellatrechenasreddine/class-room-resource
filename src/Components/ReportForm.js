import React, { useState } from "react";
import "./ReportForm.css";

const ReportForm = () => {
 const [issueDescription, setIssueDescription] = useState("");
  const handleReportSubmit = (e) => {
    e.preventDefault();
    alert(`Report submitted: ${issueDescription}`);
    setIssueDescription("");
  };

  return (
    <div className="booking-content">
      

      {/* 📢 نموذج الإبلاغ عن مشكلة */}
      <div className="report-form">
        <h3>📝 Report a Problem</h3>
        <form onSubmit={handleReportSubmit}>
          <label>Issue Description:</label>
          <textarea
            rows="3"
            placeholder="Describe the issue..."
            value={issueDescription}
            onChange={(e) => setIssueDescription(e.target.value)}
            required
          />
          <button type="submit" className="submit-report-btn">📤 Submit Report</button>
        </form>
      </div>
    </div>
  );
}

export default ReportForm;
;
