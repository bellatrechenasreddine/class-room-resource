// تحميل المتغيرات البيئية من ملف .env
require('dotenv').config();

// استيراد المكتبات المطلوبة
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();

// إعدادات CORS
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
};
app.use(cors(corsOptions));

// استيراد المسارات
const auth = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const resourcesRouter = require('./routes/resources');
const BookingRoutes = require('./routes/BookingRoutes');
const statsRoutes = require('./routes/stats');

// تمكين استقبال JSON
app.use(express.json());

// تعريف نقاط النهاية (Routes)
app.use('/api/users', userRoutes);
app.use('/api/auth', auth);
app.use('/api/resources', resourcesRouter);
app.use('/api/bookings', BookingRoutes);
app.use('/api', statsRoutes);

// تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
