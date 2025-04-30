// تحميل المتغيرات البيئية من ملف .env
require('dotenv').config();
// استيراد المكتبات المطلوبة
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const pool = require('./db');
const app = express();

// إعدادات CORS
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
};
app.use(cors(corsOptions));
const userRoutes = require('./routes/userRoutes');// استيراد API المستخدمين
const resourcesRouter = require('./routes/resources');  // استيراد API الموارد

const BookingRoutes = require('./routes/BookingRoutes');
// تمكين استقبال JSON
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/resources', resourcesRouter);
app.use('/api/Bookings', BookingRoutes);


// مسار تسجيل الدخول
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // البحث عن المستخدم
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      console.log("❌ المستخدم غير موجود");
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];

    console.log("📧 البريد:", email);
    console.log("🔐 كلمة المرور المدخلة:", password);
    console.log("🔐 كلمة المرور في قاعدة البيانات:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("❌ كلمة المرور غير صحيحة");
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // توليد التوكن
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log("✅ تسجيل دخول ناجح");
    res.json({ token });

  } catch (err) {
    console.error("💥 خطأ في السيرفر:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

