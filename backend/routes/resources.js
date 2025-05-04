const express = require('express');
const router = express.Router();
const pool = require('../db');  // الاتصال بقاعدة البيانات

// جلب جميع الموارد
// جلب جميع الموارد مجمعة حسب النوع
// جلب جميع الموارد (بدون تجميع)
router.get('/', async (req, res) => {
  try {
    const resources = await pool.query('SELECT * FROM resources');
    res.json(resources.rows); // مصفوفة عادية
  } catch (error) {
    console.error('Error fetching resources:', error.message);
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
  const { id } = req.params;  // استخراج الـ ID من الـ URL
  const { name, type, location } = req.body;  // استخراج البيانات الجديدة من الجسم

  if (!name || !type || !location) {
    return res.status(400).json({ message: 'Please provide name, type, and location' });
  }

  try {
    // التحقق من وجود المورد في قاعدة البيانات
    const resource = await pool.query('SELECT * FROM resources WHERE id = $1', [id]);
    if (resource.rows.length === 0) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // تحديث المورد
    const updatedResource = await pool.query(
      'UPDATE resources SET name = $1, type = $2, location = $3 WHERE id = $4 RETURNING *',
      [name, type, location, id]
    );

    res.json(updatedResource.rows[0]);  // إرسال المورد المحدث
  } catch (error) {
    console.error('Error updating resource:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// مسار حذف المورد
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM resources WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = router;
