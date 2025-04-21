// import React, { useState } from "react";
// import "./ReportForm.css";

// const ReportForm = () => {
//  const [issueDescription, setIssueDescription] = useState("");
//   const handleReportSubmit = (e) => {
//     e.preventDefault();
//     alert(`Report submitted: ${issueDescription}`);
//     setIssueDescription("");
//   };

//   return (
//     <div className="booking-content">
      

//       {/* 📢 نموذج الإبلاغ عن مشكلة */}
//       <div className="report-form">
//         <h3>📝 Report a Problem</h3>
//         <form onSubmit={handleReportSubmit}>
//           <label>Issue Description:</label>
//           <textarea
//             rows="3"
//             placeholder="Describe the issue..."
//             value={issueDescription}
//             onChange={(e) => setIssueDescription(e.target.value)}
//             required
//           />
//           <button type="submit" className="submit-report-btn">📤 Submit Report</button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default ReportForm;

import React, { useState } from "react";
import resourceOptions from "./resourceOptions"; // استيراد الموارد
import "./ReportForm.css";

const ReportForm = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedResource, setSelectedResource] = useState("");
  const [issueDescription, setIssueDescription] = useState("");

  const handleReportSubmit = (e) => {
    e.preventDefault();
    alert(`Report submitted for ${selectedResource} in ${selectedCategory}: ${issueDescription}`);
    setSelectedCategory("");
    setSelectedResource("");
    setIssueDescription("");
  };

  return (
    <div className="booking-content">
      <div className="report-form">
        <h3>📝 Report a Problem</h3>
        <form onSubmit={handleReportSubmit}>
          {/* اختيار الفئة */}
          <label>Resource Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedResource(""); // تصفير المورد عند تغيير الفئة
            }}
            required
          >
            <option value="">Select a category</option>
            {Object.keys(resourceOptions).map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>

          {/* اختيار المورد */}
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

          <button type="submit" className="submit-report-btn">📤 Submit Report</button>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;
