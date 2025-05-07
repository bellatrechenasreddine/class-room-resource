import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import "./BookingForm.css";

const BookingForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);

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
    const defaultResource = groupedResources[resourceType]?.[0];
    setSelectedResource(defaultResource || null);
  };

  const handleResourceChange = (e) => {
    const resourceId = parseInt(e.target.value);
    const resource = groupedResources[selectedType].find(r => r.id === resourceId);
    setSelectedResource(resource);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const bookingDate = formData.get('bookingDate');
    const startTime = formData.get('startTime');
    const endTime = formData.get('endTime');

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
      {/* ✅ Resource type selection */}
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

      {/* ✅ Booking form after selecting resource type */}
      {selectedType && selectedResource && (
        <form className="booking-form" onSubmit={handleSubmit}>
          <h2>📌 Booking Form</h2>
          <p className="form-description">Select a resource and fill in the details below.</p>

          <div className="form-group">
            <label>Choose Resource</label>
            <select name="resource" value={selectedResource.id} onChange={handleResourceChange} required>
              {groupedResources[selectedType].map((resource) => (
                <option key={resource.id} value={resource.id}>
                  {resource.name} - {resource.location}
                </option>
              ))}
            </select>
          </div>

          <div style={{ textAlign: "center", marginBottom: "15px" }}>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
              Booking Date
            </label>
            <input type="date" name="bookingDate" required style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }} />
          </div>

          <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
            <div>
              <label>Start Time</label>
              <input type="time" name="startTime" required />
            </div>
            <div>
              <label>End Time</label>
              <input type="time" name="endTime" required />
            </div>
          </div>

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

      {/* ✅ Confirmation Modal */}
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
