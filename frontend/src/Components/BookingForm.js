import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import "./BookingForm.css";

const BookingForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [resources, setResources] = useState([]);
  const [availableResources, setAvailableResources] = useState([]);
  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const carouselRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const scrollLeft = () => {
    carouselRef.current.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  };

  useEffect(() => {
    axios.get('http://localhost:5000/api/resources')
      .then(response => {
        const cleaned = response.data.map(r => ({
          ...r,
          type: r.type.trim(),
        }));
        setResources(cleaned);
        setLoading(false);
      })
      .catch(error => {
        console.error('❌ Error fetching resources:', error);
        setLoading(false);
      });
  }, []);

  const groupedResources = resources.reduce((acc, resource) => {
    if (!acc[resource.type]) {
      acc[resource.type] = [];
    }
    acc[resource.type].push(resource);
    return acc;
  }, {});

  const handleResourceTypeClick = (resourceType) => {
    setSelectedType(resourceType);
    setBookingDate('');
    setStartTime('');
    setEndTime('');
    setSelectedResource(null);
    setAvailableResources([]);
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setBookingDate(date);
    filterAvailableResources(date, startTime, endTime);
  };

  const handleStartTimeChange = (e) => {
    const time = e.target.value;
    setStartTime(time);
    filterAvailableResources(bookingDate, time, endTime);
  };

  const handleEndTimeChange = (e) => {
    const time = e.target.value;
    setEndTime(time);
    filterAvailableResources(bookingDate, startTime, time);
  };

  const filterAvailableResources = async (date, start, end) => {
    if (!date || !start || !end || !selectedType) return;

    try {
      const response = await axios.get('http://localhost:5000/api/resources/available', {
        params: {
          date,
          start,
          end,
          type: selectedType
        }
      });

      setAvailableResources(response.data);
      setSelectedResource(response.data[0] || null);
    } catch (err) {
      console.error("Error fetching available resources", err);
      setAvailableResources([]);
      setSelectedResource(null);
    }
  };

  const handleResourceChange = (e) => {
    const resourceId = parseInt(e.target.value);
    const resource = availableResources.find(r => r.id === resourceId);
    setSelectedResource(resource);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const startDate = new Date(bookingDate + 'T' + startTime + ':00');
    const endDate = new Date(bookingDate + 'T' + endTime + ':00');

    if (endDate <= startDate) {
      alert("⚠️ The end time must be after the start time.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first.");
      return;
    }

    const bookingData = {
      resource_id: selectedResource.id,
      booking_date: bookingDate,
      start_time: startDate.toTimeString().split(' ')[0],
      end_time: endDate.toTimeString().split(' ')[0],
    };

    try {
      const response = await axios.post(
        'http://localhost:5000/api/bookings',
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      console.log('Booking created:', response.data);
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
    } catch (error) {
      console.error('Error creating booking:', error);
      if (error.response && error.response.status === 409) {
        const { message } = error.response.data;
        alert(`⚠️ ${message}`);
      } else {
        alert('Failed to create booking. Please try again.');
      }
    }
  };

  return (
    <div className="booking-container">

      {/* ✅ Step 1: Select resource type */}
      {!selectedType && (
        <div className="carousel-wrapper">
          <button className="scroll-btn" onClick={scrollLeft}>⬅️</button>
          <div className="carousel" ref={carouselRef}>
            {Object.keys(groupedResources).map((resourceType) => (
              <div key={resourceType} className="resource-card" onClick={() => handleResourceTypeClick(resourceType)}>
                <img
                  src={`/images/${resourceType.toLowerCase().replace(/\s+/g, "")}.png`}
                  alt={resourceType}
                  style={{ width: '100px', height: '100px', cursor: 'pointer' }}
                />
                <p>{resourceType}</p>
              </div>
            ))}
          </div>
          <button className="scroll-btn" onClick={scrollRight}>➡️</button>
        </div>
      )}

      {/* ✅ Step 2: Booking Form */}
      {selectedType && (
        <form className="booking-form" onSubmit={handleSubmit}>
          <h2>📌 Booking Form</h2>
          <p className="form-description">Select a time and see available resources.</p>

          {/* التاريخ */}
          <div style={{ textAlign: "center", marginBottom: "15px" }}>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
              Booking Date
            </label>
            <input
              type="date"
              name="bookingDate"
              value={bookingDate}
              onChange={handleDateChange}
              required
              style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
            />
          </div>

          {/* الوقت */}
          <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginBottom: "15px" }}>
            <div>
              <label>Start Time</label>
              <input type="time" name="startTime" value={startTime} onChange={handleStartTimeChange} required />
            </div>
            <div>
              <label>End Time</label>
              <input type="time" name="endTime" value={endTime} onChange={handleEndTimeChange} required />
            </div>
          </div>

          {/* الموارد المتاحة */}
          <div className="form-group">
            <label>Available Resources</label>
            <select name="resource" value={selectedResource?.id || ''} onChange={handleResourceChange} required>
              {availableResources.length > 0 ? (
                availableResources.map((resource) => (
                  <option key={resource.id} value={resource.id}>
                    {resource.name} - {resource.location}
                  </option>
                ))
              ) : (
                <option disabled>No available resources</option>
              )}
            </select>
          </div>

          {/* الأزرار */}
          <div className="form-buttons">
            <button type="submit" className="submit-btn">📩 Submit</button>
            <button
              type="button"
              className="reset-btn"
              onClick={() => {
                setSelectedType(null);
                setSelectedResource(null);
              }}
            >
              ❌ Cancel
            </button>
          </div>
        </form>
      )}

      {/* ✅ Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <span className="thumbs-up">👍</span>
            <h3>Booking Confirmed!</h3>
            <p>Your booking request has been sent successfully.</p>
            <button className="close-btn" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingForm;
