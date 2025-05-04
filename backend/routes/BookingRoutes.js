const express = require('express');
const router = express.Router();
const pool = require('../db');
const verifyToken = require('../middleware/verifyToken'); // تأكد من مسار الملف الصحيح
// جلب كل الحجوزات
router.get('/', async (req, res) => {
  try {
    const resources = await pool.query('SELECT * FROM resources WHERE is_active = true');
    res.json(resources.rows); // إرجاع فقط الموارد المفعلّة
  } catch (error) {
    console.error('Error fetching resources:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// إضافة حجز جديد
router.post('/', verifyToken, async (req, res) => {
  console.log('Received booking data:', req.body); // ✅ أضف هذا
  const { resource_id, start_time, end_time, booking_date } = req.body;
  const user_id = req.user.id; // استخراج id من التوكن

  // التحقق من وجود user_id في الطلب
  if (!user_id) {
    return res.status(400).json({ message: 'User ID is missing in the request.' });
  }

  // التحقق من وجود كل الحقول المطلوبة
  if (!resource_id || !start_time || !end_time || !booking_date) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    // تحقق من حالة المورد قبل السماح بالحجز
    const resourceCheck = await pool.query(
      'SELECT is_active FROM resources WHERE id = $1',
      [resource_id]
    );

    if (resourceCheck.rows.length === 0 || !resourceCheck.rows[0].is_active) {
      return res.status(400).json({ message: 'Resource is not available for booking' });
    }

    const inserted = await pool.query(
      `INSERT INTO bookings (resource_id, user_id, start_time, end_time, booking_date)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [resource_id, user_id, start_time, end_time, booking_date]
    );
    res.status(201).json(inserted.rows[0]);
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// حذف/إلغاء حجز
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM bookings WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    console.error('Error deleting Booking:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// (اختياري) تعديل حجز — مثل تغيير التوقيت أو الحالة
router.put('/:id', async (req, res) => {
  const { start_time, end_time } = req.body;
  try {
    const updated = await pool.query(
      `UPDATE bookings
      SET start_time = COALESCE($1, start_time),
          end_time   = COALESCE($2, end_time)
       WHERE id = $3 RETURNING *`,
      [start_time, end_time, req.params.id]
    );
    if (updated.rowCount === 0) return res.status(404).json({ message: 'Booking not found' });
    res.json(updated.rows[0]);
  } catch (err) {
    console.error('Error updating Booking:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
