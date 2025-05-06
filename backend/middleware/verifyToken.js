const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // 👈 يجب أن يكون أولاً
  const token = authHeader && authHeader.split(' ')[1]; // 👈 ثم هذا
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("❌ Token verification error:", err);
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  });
};

module.exports = verifyToken;
