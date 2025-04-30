import React, { useState, useRef } from "react";
import "./BookingForm.css";

const resourceOptions = {
  "PC": ["PC 1", "PC 2", "PC 3"],
  "DataShow": ["Projector 1", "Projector 2"],
  "Microphone": ["Microphone 1", "Microphone 2"],
  "Speakers": ["Speaker 1", "Speaker 2"],
  "Camera": ["Camera 1", "Camera 2"],
  "Classroom": ["Classroom A", "Classroom B", "Classroom C"],
  "Lecture Hall": ["Lecture Hall 1", "Lecture Hall 2"],
  "Computer Lab": ["Computer Lab 1", "Computer Lab 2"],
  "Science Lab": ["Physics Lab", "Chemistry Lab", "Biology Lab"],
  "Meeting Room": ["Meeting Room 1", "Meeting Room 2"],
  "Library Space": ["Library Section A", "Library Section B"],
  "Board": ["Whiteboard 1", "Whiteboard 2"]
};

const BookingForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [resources, setResources] = useState([]);
  const carouselRef = useRef(null);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setResources(resourceOptions[category] || []);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="booking-container">
      {/* 🖼️ اختيار المورد عبر الصور */}
      {!selectedCategory && (
        <div className="resource-carousel">
          <div ref={carouselRef} className="resource-track">
            {Object.keys(resourceOptions).map((category, index) => (
              <div key={index} className="resource-card" onClick={() => handleCategoryChange(category)}>
                <img src={`/images/${category.toLowerCase().replace(/\s+/g, "-")}.png`} alt={category} />
                <p>{category}</p>
              </div>
            ))}
          </div>

          {/* أزرار التحكم بالتمرير */}
          <div className="carousel-buttons">
  <button className="carousel-btn left" onClick={scrollLeft}>⬅</button>
  <button className="carousel-btn right" onClick={scrollRight}>➡</button>
</div>

        </div> 
      )}

      {/* ✅ الفورم يظهر بعد اختيار المورد */}
      {selectedCategory && (
        <form className="booking-form" onSubmit={handleSubmit}>
        <h2>📌 Booking Form</h2>
        <p className="form-description">Fill in the details below to book a resource.</p>
      
        <div className="form-group">
          <label>Resource Category</label>
          <select onChange={(e) => handleCategoryChange(e.target.value)} value={selectedCategory} required>
            <option value="">Select a category</option>
            {Object.keys(resourceOptions).map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>
      
        <div className="form-group">
          <label>Resource Name</label>
          <select disabled={!selectedCategory} required>
            <option value="">Select a resource</option>
            {resources.map((res, index) => (
              <option key={index}>{res}</option>
            ))}
          </select>
        </div>
      
        {/* <div className="form-group date-time">
          <div>
            <label>Booking Date</label>
            <input type="date" required />
          </div>
          <div>
            <label>Booking Time</label>
            <input type="time" required />
          </div>
        </div> */}
        <div className="booking-form">
  {/* Booking Date - في الأعلى وتتوسطهم */}
  <div style={{ textAlign: "center", marginBottom: "15px" }}>
    <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
      Booking Date
    </label>
    <input type="date" required style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }} />
  </div>

  {/* Start and End Time */}
  <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
    <div>
      <label>Start Time</label>
      <input type="time" required />
    </div>
    <div>
      <label>End Time</label>
      <input type="time" required />
    </div>
  </div>
</div>

    
      
        <div className="form-buttons">
          <button type="submit" className="submit-btn">📩 Submit</button>
          <button type="reset" className="reset-btn" onClick={() => setSelectedCategory("")}>❌ Reset</button>
        </div>
      </form>
      
      )}

      {/* 🔹 نافذة التأكيد (Modal) */}
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
