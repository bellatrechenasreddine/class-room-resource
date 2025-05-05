// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import "./BookingForm.css";

// const BookingForm = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [resources, setResources] = useState([]);
//   const carouselRef = useRef(null);
//   const [loading, setLoading] = useState(true);
//   const [filteredResources, setFilteredResources] = useState([]);


//   const handleCategoryChange = (category) => {
//     setSelectedCategory(category);
//     if (category === "") {
//       setFilteredResources(resources);
//     } else {
//       const filtered = resources.filter(resource => resource.type.trim() === category.trim());
//       console.log("🔎 الموارد بعد الفلترة:", filtered);
//       setFilteredResources(filtered);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setShowModal(true);
//   };

//   const scrollLeft = () => {
//     if (carouselRef.current) {
//       carouselRef.current.scrollBy({ left: -200, behavior: "smooth" });
//     }
//   };

//   const scrollRight = () => {
//     if (carouselRef.current) {
//       carouselRef.current.scrollBy({ left: 200, behavior: "smooth" });
//     }
//   };

  
//   useEffect(() => {
//     axios.get('http://localhost:5000/api/resources')
//       .then(response => {
//         const cleaned = response.data.map(r => ({
//           ...r,
//           type: r.type.trim(), // ← إزالة الفراغات أو التاب
//         }));
//         console.log('🔍 الموارد المسترجعة:', cleaned);
//         setResources(cleaned);
//         setFilteredResources(cleaned);
//         setLoading(false);
//       })
//       .catch(error => {
//         console.error('خطأ أثناء جلب الموارد:', error);
//         setLoading(false);
//       });
//   }, []);
  
//   const handleResourceClick = (resource) => {
//     setSelectedCategory(resource.type.trim());
//     setSelectedResource(resource);
//   };
  

//   return (
//     <div className="booking-container">
//     <div className="resource-gallery">
//   {resources.map((res) => (
//     <div key={res.id} className="resource-card" onClick={() => handleResourceClick(res)}>
//       <img
//         src={getImagePath(res.type)}
//         alt={res.name}
//         style={{ width: '100px', height: '100px', cursor: 'pointer' }}
//       />
//       <p>{res.name}</p>
//     </div>
//   ))}
// </div>

//       {/* 🖼️ اختيار المورد عبر الصور */}
//       {!selectedCategory && (
//         <div className="resource-carousel">
//           <div ref={carouselRef} className="resource-track">
//           {filteredResources.map((resource, index) => (
//             <div key={resource.id || index} className="resource-card">
//               <img src={`/images/${resource.type.toLowerCase().replace(/\s+/g, "")}.png`} alt={resource.type} />
//               <p>{resource.type}</p>
//               <p>{resource.location}</p>
//             </div>
//           ))}
//           </div>

//           {/* أزرار التحكم بالتمرير */}
//           <div className="carousel-buttons">
//                 <button className="carousel-btn left" onClick={scrollLeft}>⬅</button>
//                 <button className="carousel-btn right" onClick={scrollRight}>➡</button>
//           </div>

//         </div> 
//       )}
//       {/* ✅ هذا خارج الشرط لكي يظهر دائمًا */}
//       <div className="form-group">
//           <label>Resource Category</label>
//           <select onChange={(e) => handleCategoryChange(e.target.value)} value={selectedCategory} required>
//             <option value="">Select a category</option>
//               {[...new Set(resources.map(resource => resource.type.trim()))].map((type, index) => (
//             <option key={index} value={type}>{type}</option>
//               ))}
//           </select>
//       </div>
//       {/* ✅ الفورم يظهر بعد اختيار المورد */}
//       {selectedCategory && (
//         <form className="booking-form" onSubmit={handleSubmit}>
//         <h2>📌 Booking Form</h2>
//         <p className="form-description">Fill in the details below to book a resource.</p>
      
//         <div className="form-group">
//           <label>Resource Category</label>
//           <select onChange={(e) => handleCategoryChange(e.target.value)} value={selectedCategory} required>
//   <option value="">Select a category</option>
//   {[...new Set(resources.map(resource => resource.type.trim()))].map((type, index) => (
//     <option key={index} value={type}>{type}</option>
//   ))}
// </select>

//         </div>
      
//         <div className="form-group">
//   <label>Resource Name</label>
//   <select disabled={!selectedCategory} required>
//     <option value="">Select a resource</option>
//     {filteredResources.map((res, index) => (
//       <option key={index} value={res.id}>{res.name}</option>
//     ))}
//   </select>
// </div>

      
//         {/* <div className="form-group date-time">
//           <div>
//             <label>Booking Date</label>
//             <input type="date" required />
//           </div>
//           <div>
//             <label>Booking Time</label>
//             <input type="time" required />
//           </div>
//         </div> */}
//         <div className="booking-form">
//   {/* Booking Date - في الأعلى وتتوسطهم */}
//   <div style={{ textAlign: "center", marginBottom: "15px" }}>
//     <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
//       Booking Date
//     </label>
//     <input type="date" required style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }} />
//   </div>

//   {/* Start and End Time */}
//   <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
//     <div>
//       <label>Start Time</label>
//       <input type="time" required />
//     </div>
//     <div>
//       <label>End Time</label>
//       <input type="time" required />
//     </div>
//   </div>
// </div>

    
      
//         <div className="form-buttons">
//           <button type="submit" className="submit-btn">📩 Submit</button>
//           <button type="reset" className="reset-btn" onClick={() => setSelectedCategory("")}>❌ Reset</button>
//         </div>
//       </form>
      
//       )}

//       {/* 🔹 نافذة التأكيد (Modal) */}
//       {showModal && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <span className="thumbs-up">👍</span>
//             <h3>Booking Confirmed!</h3>
//             <p>Your booking request has been sent successfully.</p>
//             <button className="close-btn" onClick={() => setShowModal(false)}>Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BookingForm;
// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import "./BookingForm.css";

// const BookingForm = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [selectedResource, setSelectedResource] = useState(null);
//   const [resources, setResources] = useState([]);
//   const carouselRef = useRef(null);
//   const [loading, setLoading] = useState(true);
//   const [errorMessage, setErrorMessage] = useState('');


//   // لإخفاء الرسالة بعد 5 ثواني تلقائياً
// useEffect(() => {
//   if (errorMessage) {
//     const timer = setTimeout(() => {
//       setErrorMessage('');
//     }, 5000); // الرسائل تختفي بعد 5 ثواني

//     return () => clearTimeout(timer); // تنظيف المؤقت عند تغيّر الرسالة
//   }
// }, [errorMessage]);


//   const scrollLeft = () => {
//     if (carouselRef.current) {
//       carouselRef.current.scrollBy({ left: -200, behavior: "smooth" });
//     }
//   };

//   const scrollRight = () => {
//     if (carouselRef.current) {
//       carouselRef.current.scrollBy({ left: 200, behavior: "smooth" });
//     }
//   };

//   const getImagePath = (type) => {
//     return `/images/${type.toLowerCase().replace(/\s+/g, "")}.png`;
//   };

//   useEffect(() => {
//     axios.get('http://localhost:5000/api/resources')
//       .then(response => {
//         const cleaned = response.data.map(r => ({
//           ...r,
//           type: r.type.trim(),
//         }));
//         setResources(cleaned);
//         setLoading(false);
//       })
//       .catch(error => {
//         console.error('❌ خطأ أثناء جلب الموارد:', error);
//         setLoading(false);
//       });
//   }, []);

//   const handleResourceClick = (resource) => {
//     setSelectedResource(resource);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     const formData = new FormData(e.target);
//     const bookingDate = formData.get('bookingDate');
//     const startTime = formData.get('startTime');
//     const endTime = formData.get('endTime');
  
//     const startDate = new Date(bookingDate + 'T' + startTime + ':00');
//     const endDate = new Date(bookingDate + 'T' + endTime + ':00');
  
//     if (endDate <= startDate) {
//       alert("⚠️ وقت النهاية يجب أن يكون بعد وقت البداية.");
//       return;
//     }
  
//     const token = localStorage.getItem("token");
//     if (!token) {
//       alert("يرجى تسجيل الدخول أولاً");
//       return;
//     }
  
//     const bookingData = {
//       resource_id: selectedResource.id,
//       booking_date: bookingDate,
//       start_time: startDate.toTimeString().split(' ')[0],
//       end_time: endDate.toTimeString().split(' ')[0],
//     };
  
//     try {
//       const response = await axios.post(
//         'http://localhost:5000/api/bookings',
//         bookingData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           }
//         }
//       );
  
//       console.log('Booking created:', response.data);
//       setErrorMessage('');
//       setShowModal(true); // عرض المودال عند النجاح
  
//       // إغلاق المودال تلقائياً بعد 3 ثواني
//       setTimeout(() => {
//         setShowModal(false);
//       }, 3000);
      
//     } catch (error) {
//       console.error('Error creating booking:', error);
//       setErrorMessage('Failed to create booking. Please try again.');
//     }
//   };
  


//   return (
//     <div className="booking-container">
//       {/* ✅ معرض الصور لاختيار المورد */}
//       {!selectedResource && (
//         <div className="resource-gallery">
//           {resources.map((res) => (
//             <div key={res.id} className="resource-card" onClick={() => handleResourceClick(res)}>
//               <img
//                 src={getImagePath(res.type)}
//                 alt={res.name}
//                 style={{ width: '100px', height: '100px', cursor: 'pointer' }}
//               />
//               <p>{res.name}</p>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* ✅ الفورم يظهر بعد اختيار مورد */}
//       {selectedResource && (
//         <form className="booking-form" onSubmit={handleSubmit}>
//           <h2>📌 Booking Form</h2>
//           <p className="form-description">Fill in the details below to book a resource.</p>

//           <div className="form-group">
//             <label>Selected Resource</label>
//             <input type="text" value={selectedResource.name} readOnly />
//           </div>
//           <div style={{ textAlign: "center", marginBottom: "15px" }}>
//             <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
//               Booking Date
//             </label>
//             <input type="date" name="bookingDate" required style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }} />
//           </div>

//           <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
//             <div>
//               <label>Start Time</label>
//               <input type="time" name="startTime" required />
//             </div>
//             <div>
//               <label>End Time</label>
//               <input type="time" name="endTime" required />
//             </div>
//           </div>


//           <div className="form-buttons">
//             <button type="submit" className="submit-btn">📩 Submit</button>
//             <button
//               type="button"
//               className="reset-btn"
//               onClick={() => {
//                 setSelectedResource(null);
//                 setShowModal(false);
//               }}
//             >
//               ❌ Cancel
//             </button>
//           </div>
//         </form>
//       )}
       
//       {/* ✅ نافذة تأكيد بعد الحجز */}
    
//       {showModal && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <span className="thumbs-up">👍</span>
//             <h3>Booking Confirmed!</h3>
//             <p>Your booking request has been sent successfully.</p>
//             <button className="close-btn" onClick={() => setShowModal(false)}>Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BookingForm;

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
