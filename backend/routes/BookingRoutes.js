const express = require('express');
const router = express.Router();
const pool = require('../db');
const verifyToken = require('../middleware/verifyToken'); 

// ✅ جلب الحجوزات الخاصة بالمستخدم المسجل فقط
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role; // تأكد أن هذا الحقل يأتي مع التوكن

    let query;
    let params;

    if (role === 'admin') {
      // إذا كان أدمن، اجلب كل الحجوزات
      query = `
        SELECT bookings.id, 
              bookings.resource_id, 
              bookings.start_time, 
              bookings.end_time, 
              bookings.booking_date, 
              resources.name AS resource_name,  
              resources.location AS resource_location  
        FROM bookings 
        JOIN resources ON bookings.resource_id = resources.id
      `;
      params = [];
    } else {
      // غير ذلك (طالب أو أستاذ)، اجلب فقط حجوزات المستخدم الحالي
      query = `
        SELECT bookings.id, 
            bookings.resource_id, 
            bookings.start_time, 
            bookings.end_time, 
            bookings.booking_date, 
            resources.name AS resource_name,  
            resources.location AS resource_location  
        FROM bookings 
        JOIN resources ON bookings.resource_id = resources.id
        WHERE bookings.user_id = $1
      `;
      params = [userId];
    }

    const bookings = await pool.query(query, params);
    res.json(bookings.rows);
  } catch (error) {
    console.error('Error fetching bookings:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// ✅ إضافة حجز جديد
router.post('/', verifyToken, async (req, res) => {
  const { resource_id, start_time, end_time, booking_date } = req.body;
  const user_id = req.user.id;

  if (!user_id) {
    return res.status(400).json({ message: 'User ID is missing in the request.' });
  }

  if (!resource_id || !start_time || !end_time || !booking_date) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const resourceCheck = await pool.query(
      'SELECT is_active FROM resources WHERE id = $1',
      [resource_id]
    );

    if (resourceCheck.rows.length === 0 || !resourceCheck.rows[0].is_active) {
      return res.status(400).json({ message: 'Resource is not available for booking' });
    }

    const conflictQuery = `
      SELECT start_time, end_time FROM bookings 
      WHERE resource_id = $1 
        AND booking_date = $2
        AND NOT (
          end_time <= $3 OR start_time >= $4
        );
    `;
    const conflictResult = await pool.query(conflictQuery, [
      resource_id,
      booking_date,
      start_time,
      end_time
    ]);

    if (conflictResult.rows.length > 0) {
      const c = conflictResult.rows[0];
      return res.status(409).json({
        message: `⚠️ This resource is already booked on ${booking_date} from ${c.start_time} to ${c.end_time}. Please choose another time.`,
      });
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

// ✅ حذف حجز
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

// ✅ تعديل حجز مع التحقق من التداخل
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { start_time, end_time, booking_date, resource_id } = req.body;

  if (!start_time || !end_time || !booking_date || !resource_id) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    const conflictQuery = `
      SELECT * FROM bookings
      WHERE resource_id = $1
        AND booking_date = $2
        AND id <> $5
        AND NOT (
          end_time <= $3 OR start_time >= $4
        )
    `;
    const conflictResult = await pool.query(conflictQuery, [
      resource_id,
      booking_date,
      start_time,
      end_time,
      id
    ]);

    if (conflictResult.rows.length > 0) {
      const c = conflictResult.rows[0];
      return res.status(409).json({
        message: `⚠️ Time conflict: This resource is already booked on ${booking_date} from ${c.start_time} to ${c.end_time}.`
      });
    }

    const updatedBooking = await pool.query(
      `UPDATE bookings
      SET start_time = $1,
          end_time = $2,
          booking_date = $3,
          resource_id = $4
      WHERE id = $5
       RETURNING *`,
      [start_time, end_time, booking_date, resource_id, id]
    );

    if (updatedBooking.rowCount === 0) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    res.json(updatedBooking.rows[0]);
  } catch (err) {
    console.error('Error updating booking:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
