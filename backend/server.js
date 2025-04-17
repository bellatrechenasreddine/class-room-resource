require("dotenv").config();  // تحميل متغيرات البيئة من ملف .env
const express = require('express');  // استيراد مكتبة Express
const jwt = require('jsonwebtoken');  // استيراد JWT
const bcrypt = require('bcryptjs');  // استيراد مكتبة bcrypt لمقارنة كلمات السر
const pool = require('./db');  // استيراد قاعدة البيانات (عادة ما يكون pool من pg)
const cors = require('cors');  // استيراد CORS
const verifyToken = require('./middleware/verifyToken');  // استيراد Middleware للتحقق من التوكن

const app = express();
const corsOptions = {
    origin: 'http://localhost:3003', // عنوان الواجهة
    credentials: true,
  };
  
// تفعيل CORS لجميع المصادر
app.use(cors());  // تأكد من أن CORS يتم تفعيله قبل المسارات الأخرى

app.use(express.json());  // لتحويل بيانات الـ JSON المرسلة في الطلبات

// مسار تسجيل الدخول
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  console.log("📧 Email received:", `"${email}"`);
  console.log("📧 Email received:", email);
  console.log("🔐 Password received:", password);


  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // البحث عن المستخدم في قاعدة البيانات باستخدام البريد الإلكتروني
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = userResult.rows[0];

    // التحقق من كلمة المرور باستخدام bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔐 Password from user input:", password);
    console.log("🔐 Password from database:", user.password);
    console.log("🔍 Match result:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // توليد JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },  // يمكن إضافة معلومات أخرى في الـ payload
      process.env.JWT_SECRET,  // سر التوكن من ملف .env
      { expiresIn: '1h' }  // تحديد مدة صلاحية التوكن (ساعة واحدة في هذا المثال)
    );

    // إرسال التوكن للمستخدم
    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// تحديد المنفذ الذي سيعمل عليه السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
