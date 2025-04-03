// import React from "react";
// import "./NotificationBox.css"; // تأكد من وجود ملف CSS

// const NotificationBox = ({ notifications }) => {
//   return (

//     <div className="notification-dropdown">
//       <h3>📢 الإشعارات</h3>
//       <ul>
//         {notifications.length > 0 ? (
//           notifications.map((notif, index) => (
//             <li key={index}>{notif}</li>
//           ))
//         ) : (
//           <li>لا توجد إشعارات جديدة</li>
//         )}
//       </ul>
//     </div>
//   );
// };

// export default NotificationBox;

import React from "react";
import "./NotificationBox.css"; // تأكد من وجود ملف CSS

const NotificationBox = ({ notifications = [], maintenanceNotifications = [], showMaintenance = true,showNotification = true }) => {
    return (
      
      <div className="notification-dropdown">
        {showNotification && (
        <>
        <h3 className="notification-header">📢 الإشعارات</h3>
        <ul className="notification-list">
          {notifications.length > 0 ? (
            notifications.map((notif, index) => <li key={index}>{notif}</li>)
          ) : (
            <li>لا توجد إشعارات</li>
          )}
        </ul>
        </>
        )}
        {/* إظهار إشعارات الصيانة فقط إذا كان showMaintenance = true */}
        {showMaintenance && (
          <>
            <h3 className="maintenance-header">🛠️ إشعارات الصيانة</h3>
            <ul className="maintenance-list">
              {maintenanceNotifications.length > 0 ? (
                maintenanceNotifications.map((notif, index) => <li key={index}>{notif}</li>)
              ) : (
                <li>لا توجد إشعارات صيانة</li>
              )}
            </ul>
          </>
        )}
      </div>
    );
};

export default NotificationBox;
