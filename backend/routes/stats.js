// routes/stats.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const verifyToken = require('../middleware/verifyToken');

router.get('/bookings/stats', verifyToken, async (req, res) => {
  try {
    const query = `
      SELECT r.type, COUNT(b.id) AS booking_count
      FROM bookings b
      JOIN resources r ON b.resource_id = r.id
      GROUP BY r.type
      ORDER BY booking_count DESC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching booking statistics:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
