const jwt = require('jsonwebtoken');

// Middleware للتحقق من JWT
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // نخزن بيانات المستخدم في الطلب
    next(); // نكمل للـ route
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
}

module.exports = verifyToken;
