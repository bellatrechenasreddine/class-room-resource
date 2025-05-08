// routes/stats.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const verifyToken = require('../middleware/verifyToken');

router.get('/bookings/stats', verifyToken, async (req, res) => {
  const { id: userId, role } = req.user; // استخراج role أيضًا من التوكن

  try {
    let query;
    let params = [];

    if (role === 'admin') {
      // إذا كان الأدمن، اجلب كل الحجوزات
      query = `
        SELECT r.type, COUNT(b.id) AS booking_count
        FROM bookings b
        JOIN resources r ON b.resource_id = r.id
        GROUP BY r.type
        ORDER BY booking_count DESC;
      `;
    } else {
      // إذا كان أستاذ أو طالب، اجلب حجوزاته فقط
      query = `
        SELECT r.type, COUNT(b.id) AS booking_count
        FROM bookings b
        JOIN resources r ON b.resource_id = r.id
        WHERE b.user_id = $1
        GROUP BY r.type
        ORDER BY booking_count DESC;
      `;
      params = [userId];
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching booking statistics:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = router;
