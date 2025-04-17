const bcrypt = require('bcryptjs');
const pool = require('./db');  // تأكد من أنك قد قمت بربط الاتصال بقاعدة البيانات

async function hashPasswordForUsers() {
  // الحصول على جميع المستخدمين من قاعدة البيانات
  const users = await pool.query('SELECT * FROM users');

  // المرور على كل مستخدم وتشفير كلمة مروره
  for (let user of users.rows) {
    const salt = await bcrypt.genSalt(10);  // توليد "salt" لتشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(user.password, salt);  // تشفير كلمة المرور
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, user.id]);  // تحديث كلمة المرور المشفرة
    console.log(`Updated password for ${user.email}`);  // طباعة إشعار في الكونسول
  }
}

// استدعاء الوظيفة لتحديث كلمات المرور
hashPasswordForUsers();
