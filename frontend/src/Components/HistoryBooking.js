import React, { useState } from "react";
import "./HistoryBooking.css";

const HistoryBooking = () => {
  const [bookingHistory] = useState([
    { id: 1, resource: "Projector", date: "2025-04-01", time: "10:00 AM", duration: "2h" },
    { id: 2, resource: "Laptop", date: "2025-03-28", time: "02:00 PM", duration: "3h" }
  ]);

 

  return (
    <div className="booking-content">
      {/* 📝 جدول الحجوزات السابقة */}
      <div className="booking-history">
        <h3>📅 Booking History</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Resource</th>
              <th>Date</th>
              <th>Time</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {bookingHistory.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.resource}</td>
                <td>{booking.date}</td>
                <td>{booking.time}</td>
                <td>{booking.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

   
    </div>
  );
};

export default HistoryBooking;
