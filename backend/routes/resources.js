const express = require('express');
const router = express.Router();
const pool = require('../db');  // الاتصال بقاعدة البيانات

// جلب كل الموارد (بما فيها غير النشطة)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *,
        CAST(regexp_replace(name, '\\D', '', 'g') AS INTEGER) AS name_number
      FROM resources
      ORDER BY
        CASE type
          WHEN 'Meeting Room' THEN 1
          WHEN 'Classroom' THEN 2
          WHEN 'Lab' THEN 3
          WHEN 'Projector' THEN 4
          WHEN 'Computer' THEN 5
          WHEN 'Camera' THEN 6
          WHEN 'Microphone' THEN 7
          WHEN 'Speaker' THEN 8
          ELSE 9
        END,
        name_number,
        CASE location
          WHEN 'College A' THEN 1
          WHEN 'College B' THEN 2
          WHEN 'College C' THEN 3
          ELSE 4
        END
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching resources:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// جلب الموارد المتاحة (النشطة فقط) حسب النوع والتاريخ والوقت
router.get('/available', async (req, res) => {
  const { date, start, end, type } = req.query;

  if (!date || !start || !end || !type) {
    return res.status(400).json({ message: 'Missing required query parameters.' });
  }

  try {
    const query = `
      SELECT *
      FROM resources
      WHERE type = $1
        AND is_active = true
        AND id NOT IN (
          SELECT resource_id
          FROM bookings
          WHERE booking_date = $2
            AND (
              (start_time < $4 AND end_time > $3)
            )
        )
      ORDER BY
        CASE type
          WHEN 'Meeting Room' THEN 1
          WHEN 'Classroom' THEN 2
          WHEN 'Lab' THEN 3
          WHEN 'Projector' THEN 4
          WHEN 'Computer' THEN 5
          WHEN 'Camera' THEN 6
          WHEN 'Microphone' THEN 7
          WHEN 'Speaker' THEN 8
          ELSE 9
        END,
        CAST(regexp_replace(name, '\\D', '', 'g') AS INTEGER),
        CASE location
          WHEN 'College A' THEN 1
          WHEN 'College B' THEN 2
          WHEN 'College C' THEN 3
          ELSE 4
        END
    `;

    const values = [type.trim(), date, start, end];

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching available resources:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// إضافة مورد جديد
router.post('/', async (req, res) => {
  try {
    const { name, type, location } = req.body;
    if (!name || !type || !location) {
      return res.status(400).json({ message: 'Please provide name, type, and location' });
    }

    const newResource = await pool.query(
      'INSERT INTO resources (name, type, location) VALUES ($1, $2, $3) RETURNING *',
      [name, type, location]
    );

    res.status(201).json(newResource.rows[0]);
  } catch (error) {
    console.error('Error adding resource:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// تعديل مورد
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, type, location } = req.body;

  if (!name || !type || !location) {
    return res.status(400).json({ message: 'Please provide name, type, and location' });
  }

  try {
    const resource = await pool.query('SELECT * FROM resources WHERE id = $1', [id]);
    if (resource.rows.length === 0) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    const updatedResource = await pool.query(
      'UPDATE resources SET name = $1, type = $2, location = $3 WHERE id = $4 RETURNING *',
      [name, type, location, id]
    );

    res.json(updatedResource.rows[0]);
  } catch (error) {
    console.error('Error updating resource:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// حذف مورد
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const resource = await pool.query('SELECT * FROM resources WHERE id = $1', [id]);
    if (resource.rows.length === 0) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    await pool.query('DELETE FROM resources WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
console.error('Error deleting resource:', error.message);
res.status(500).json({ message: 'Internal server error' });
}
});

module.exports = router;
