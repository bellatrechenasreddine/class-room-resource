const express = require('express');
const router = express.Router();
const pool = require('../db');

// جلب كل الحجوزات
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reservations ORDER BY start_time');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching reservations:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// إضافة حجز جديد
router.post('/', async (req, res) => {
  const { resource_id, user_id, start_time, end_time } = req.body;
  if (!resource_id || !user_id || !start_time || !end_time) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }
  try {
    const inserted = await pool.query(
      `INSERT INTO reservations (resource_id, user_id, start_time, end_time)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [resource_id, user_id, start_time, end_time]
    );
    res.status(201).json(inserted.rows[0]);
  } catch (err) {
    console.error('Error creating reservation:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// حذف/إلغاء حجز
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM reservations WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Reservation not found' });
    res.json({ message: 'Reservation cancelled' });
  } catch (err) {
    console.error('Error deleting reservation:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// (اختياري) تعديل حجز — مثل تغيير التوقيت أو الحالة
router.put('/:id', async (req, res) => {
  const { start_time, end_time, status } = req.body;
  try {
    const updated = await pool.query(
      `UPDATE reservations
       SET start_time = COALESCE($1, start_time),
           end_time   = COALESCE($2, end_time),
           status     = COALESCE($3, status)
       WHERE id = $4 RETURNING *`,
      [start_time, end_time, status, req.params.id]
    );
    if (updated.rowCount === 0) return res.status(404).json({ message: 'Reservation not found' });
    res.json(updated.rows[0]);
  } catch (err) {
    console.error('Error updating reservation:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
