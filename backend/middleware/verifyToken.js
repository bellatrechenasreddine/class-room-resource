const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded user:', decoded);  // تسجيل قيمة التوكن
    req.user = decoded; // نخزن بيانات المستخدم المستخرجة من التوكن
    next();
  } catch (err) {
    console.error('Token verification error:', err);  // تسجيل أي خطأ
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;