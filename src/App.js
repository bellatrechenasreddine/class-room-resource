// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "./Components/Login";
// import AdminDashboard from "./Components/AdminDashboard";

// import TeacherDashboard from "./Components/TeacherDashboard";

// import StudentDashboard from "./Components/StudentDashboard";

// import "./styles.css"; // ✅ استيراد ملف CSS


// function App() {
//   return (

//     //// iphone
    
//     //////
//     <Router>
//       <Routes>
//         {/* صفحة تسجيل الدخول */}
//         <Route path="/" element={<Login />} />
        
//         {/* لوحة تحكم المسؤول */}
//         <Route path="/admin-dashboard" element={<AdminDashboard />} />

//         {/* مسارات إضافية للمسؤول */}
//         <Route path="/admin/resources" element={<h2>Resource Management Page</h2>} />
//         <Route path="/admin/reservations" element={<h2>Reservations Page</h2>} />
//         <Route path="/admin/maintenance" element={<h2>Maintenance Page</h2>} />
//         <Route path="/admin/reports" element={<h2>Reports Page</h2>} />

//         {/* ✅ لوحة تحكم الأستاذ */}
//         <Route path="/teacher-dashboard" element={<TeacherDashboard />} />

//            {/* ✅ لوحة تحكم التلميذ */}
//         <Route path="/student-dashboard" element={<StudentDashboard />} />

//       </Routes>
//     </Router>

   
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import AdminDashboard from "./Components/AdminDashboard";
import TeacherDashboard from "./Components/TeacherDashboard";
import StudentDashboard from "./Components/StudentDashboard";
import ResetPassword from "./Components/ResetPassword"; // ✅ استيراد صفحة إعادة تعيين كلمة المرور

import "./styles.css"; // ✅ استيراد ملف CSS
   


function App() {
  return (
    <Router>
      <Routes>
      <Route path="/login" element={<Login />} />
        {/* صفحة تسجيل الدخول */}
        <Route path="/" element={<Login />} />

        {/* ✅ إضافة مسار صفحة إعادة تعيين كلمة المرور */}
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* لوحة تحكم المسؤول */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/resources" element={<h2>Resource Management Page</h2>} />
        <Route path="/admin/reservations" element={<h2>Reservations Page</h2>} />
        <Route path="/admin/maintenance" element={<h2>Maintenance Page</h2>} />
        <Route path="/admin/reports" element={<h2>Reports Page</h2>} />

        {/* ✅ لوحة تحكم الأستاذ */}
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />

        {/* ✅ لوحة تحكم التلميذ */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
