const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("../db"); // تأكد من إعداد اتصال قاعدة البيانات في db.js

const router = express.Router();

// مسار تسجيل الدخول
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
    return res.status(400).json({ message: "Please enter email and password" });
    }

    try {
    // التحقق من وجود المستخدم في قاعدة البيانات
    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1",
    [email]
    );

    if (user.rows.length === 0) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    // التحقق من كلمة المرور
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    // إنشاء JWT
    const token = jwt.sign(
        { id: user.rows[0].id, role: user.rows[0].role },
        process.env.JWT_SECRET,
        { expiresIn: "7h" } //انتهاء الصلاحية بعد 7 ساعات 
    );

    res.json({ token });
    } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
