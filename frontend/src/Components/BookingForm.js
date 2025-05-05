import React, { useState, useEffect} from 'react';
import { useRef } from 'react';
import axios from 'axios';
import "./BookingForm.css";

const BookingForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);
  const scrollRef = useRef();
  
  const scrollLeft = () => {
    carouselRef.current.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  };
  const scrollResources = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction, behavior: 'smooth' });
    }
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

  // Group resources by type
  const groupedResources = resources.reduce((acc, resource) => {
    if (!acc[resource.type]) {
      acc[resource.type] = [];
    }
    acc[resource.type].push(resource);
    return acc;
  }, {});

  const handleResourceClick = (resourceType) => {
    setSelectedResource(resourceType);
  };

  const handleSpecificResourceClick = (resource) => {
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
      setShowModal(true); // Show modal on success
  
      setTimeout(() => {
        setShowModal(false);
      }, 3000);
    } catch (error) {
      console.error('Error creating booking:', error);
  
      // عرض رسالة خطأ مناسبة للمستخدم
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
      {/* ✅ Display resource types */}
      {!selectedResource && (
        <div className="carousel-wrapper">
        <button className="scroll-btn" onClick={scrollLeft}>⬅️</button>
        <div className="carousel" ref={carouselRef}>
          {Object.keys(groupedResources).map((resourceType) => (
            <div key={resourceType} className="resource-card" onClick={() => handleResourceClick(resourceType)}>
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

      {/* ✅ Show resources list after selecting resource type */}
      {selectedResource && !selectedResource.id && (
        <> 
          <div className="resource-list-wrapper">
            <button className="scroll-btn left" onClick={() => scrollResources(-200)}>⬅️</button>
      
            <div className="resource-list" ref={scrollRef}>
              {groupedResources[selectedResource].map((resource) => (
                <div key={resource.id} className="resource-card" onClick={() => handleSpecificResourceClick(resource)}>
                  <img
                    src={`/images/${resource.type.toLowerCase().replace(/\s+/g, "")}.png`}
                    alt={resource.name}
                    style={{ width: '100px', height: '100px', cursor: 'pointer' }}
                  />
                  <p>{resource.name}  {resource.location}</p>
                </div>
              ))}
            </div>
      
            <button className="scroll-btn right" onClick={() => scrollResources(200)}>➡️</button>
          </div>
        </>
      )}


      {/* ✅ Form appears after selecting a specific resource */}
      {selectedResource && selectedResource.id && (
        <form className="booking-form" onSubmit={handleSubmit}>
          <h2>📌 Booking Form</h2>
          <p className="form-description">Fill in the details below to book a resource.</p>

          <div className="form-group">
            <label>Selected Resource</label>
            <input type="text" value={selectedResource.name} readOnly />
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
