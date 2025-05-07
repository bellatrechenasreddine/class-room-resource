import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./HistoryBooking.css";

const HistoryBooking = () => {
  const [bookingHistory, setBookingHistory] = useState([]);
  const [resources, setResources] = useState([]);
  const [showEditBooking, setShowEditBooking] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    // جلب الحجوزات الخاصة بالمستخدم
    axios.get("http://localhost:5000/api/bookings", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => setBookingHistory(response.data))
      .catch((error) => console.error("Error fetching booking history:", error));
  
    // جلب الموارد
    axios.get("http://localhost:5000/api/resources")
      .then((response) => setResources(response.data))
      .catch((error) => console.error("Error fetching resources:", error));
  }, []);
  

  const getResourceDetails = (id) => {
    const resource = resources.find((r) => r.id === id);
    return resource ? `${resource.name} (${resource.location})` : `Resource #${id}`;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const handleEdit = (booking) => {
    setShowEditBooking(true);
    setCurrentBooking(booking);
  };
  
const handleDelete = (id) => {
  const token = localStorage.getItem('token');
  axios.delete(`http://localhost:5000/api/bookings/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(() => {
      setBookingHistory(bookingHistory.filter(booking => booking.id !== id));
      alert('Booking has been deleted successfully!');
    })
    .catch((error) => {
      console.error("Error deleting booking:", error);
      alert('Error deleting booking!');
    });
};

const handleUpdateBooking = () => {
  const token = localStorage.getItem('token');
  const formattedDate = new Date(currentBooking.booking_date).toISOString().split('T')[0];

  axios.put(`http://localhost:5000/api/bookings/${currentBooking.id}`, {
    start_time: currentBooking.start_time,
    end_time: currentBooking.end_time,
    booking_date: formattedDate,
    resource_id: currentBooking.resource_id,
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then((res) => {
      setBookingHistory(bookingHistory.map(b => b.id === currentBooking.id ? res.data : b));
      alert('Booking has been updated successfully!');
      setShowEditBooking(false);
    })
    .catch((error) => {
      console.error("Error updating booking:", error);
      if (error.response && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert('Error updating booking!');
      }
    });
};


  return (
    <div className="booking-content">
      <div className="booking-history">
        <h3>📅 Booking History</h3>
        <table>
          <thead>
            <tr>
              <th>Resource</th>
              <th>Date</th>
              <th>Time</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookingHistory.map((booking) => (
              <tr key={booking.id}>
                <td>{getResourceDetails(booking.resource_id)}</td>
                <td>{formatDate(booking.booking_date)}</td>
                <td>{booking.start_time} - {booking.end_time}</td>
                <td>
                  {(() => {
                    const start = new Date(`1970-01-01T${booking.start_time}`);
                    const end = new Date(`1970-01-01T${booking.end_time}`);
                    const diff = (end - start) / (1000 * 60);
                    return `${diff} min`;
                  })()}
                </td>
                <td>
                  <button onClick={() => handleEdit(booking)}>Edit</button>{' '}
                  <button onClick={() => handleDelete(booking.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEditBooking && currentBooking && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Booking</h3>
            <label>Resource:</label>
            <select
              value={currentBooking.resource_id}
              onChange={(e) => setCurrentBooking({ ...currentBooking, resource_id: (e.target.value) })}
            >
              {resources.map(resource => (
                <option key={resource.id} value={resource.id}>
                  {resource.name} ({resource.location})
                </option>
              ))}
            </select>

            <label>Booking Date:</label>
            <input
              type="date"
              value={currentBooking.booking_date ? currentBooking.booking_date.split('T')[0] : ''}
              onChange={(e) => setCurrentBooking({ ...currentBooking, booking_date: e.target.value })}
            />

            <label>Start Time:</label>
            <input
              type="time"
              value={currentBooking.start_time}
              onChange={(e) => setCurrentBooking({ ...currentBooking, start_time: e.target.value })}
            />

            <label>End Time:</label>
            <input
              type="time"
              value={currentBooking.end_time}
              onChange={(e) => setCurrentBooking({ ...currentBooking, end_time: e.target.value })}
            />

            <div className="modal-buttons">
              <button className="confirm-btn" onClick={handleUpdateBooking}>
                Update
              </button>
              <button
                className="delete-btn"
                onClick={() => {
                  setShowEditBooking(false);
                  setCurrentBooking(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryBooking;
