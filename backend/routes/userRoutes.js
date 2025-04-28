const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db'); // الاتصال بقاعدة البيانات

// ✅ جلب جميع المستخدمين
router.get('/', async (req, res) => { // استخدم '/' فقط هنا
  try {
    const users = await pool.query('SELECT * FROM users');
    
    // التأكد من وجود المستخدمين في قاعدة البيانات
    if (users.rows.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.json(users.rows);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ إضافة مستخدم جديد
router.post('/', async (req, res) => {
  try {
    const { name, email, role } = req.body;

    // تحقق من البيانات المدخلة
    if (!name || !email || !role) {
      return res.status(400).json({ message: 'Please provide name, email, and role' });
    }

    // توليد كلمة مرور افتراضية بناءً على الاسم
    const generatedPassword = name.split(' ')[0].toLowerCase() + '123';

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    // إضافة المستخدم إلى قاعدة البيانات
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, hashedPassword, role]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.error('Error adding user:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ حذف مستخدم
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

    if (deletedUser.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ تعديل بيانات مستخدم
router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, role, newPassword } = req.body;
  
      // تحقق من البيانات المدخلة
      if (!name || !email || !role) {
        return res.status(400).json({ message: 'Please provide name, email, and role' });
      }
  
      let updatedPassword = null;
  
      // إذا تم توفير كلمة مرور جديدة
      if (newPassword) {
        updatedPassword = await bcrypt.hash(newPassword, 10); // تشفير كلمة السر الجديدة
      }
  
      // تعديل بيانات المستخدم في قاعدة البيانات
      const updateQuery = `
        UPDATE users
        SET name = $1, email = $2, role = $3, password = COALESCE($4, password) -- إذا لم يتم تقديم كلمة مرور جديدة، ستظل القديمة كما هي
        WHERE id = $5
        RETURNING *`;
      const updatedUser = await pool.query(updateQuery, [name, email, role, updatedPassword, id]);
  
      if (updatedUser.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json(updatedUser.rows[0]);
    } catch (error) {
      console.error('Error updating user:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

module.exports = router;
