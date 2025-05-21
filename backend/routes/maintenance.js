const express = require("express");
const router = express.Router();
const pool = require("../db");

// 📥 إرسال بلاغ صيانة جديد مع issue_title
router.post("/", async (req, res) => {
  const { resource_id, reported_by, issue_title, issue_description } = req.body;

  if (!resource_id || !reported_by || !issue_title || !issue_description) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const date_reported = new Date().toISOString().split("T")[0];

    const newMaintenance = await pool.query(
      `INSERT INTO maintenances (resource_id, reported_by, issue_title, issue_description, date_reported)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [resource_id, reported_by, issue_title, issue_description, date_reported]
    );

    // 🟠 جعل المورد غير نشط
    await pool.query(
      `UPDATE resources SET is_active = false WHERE id = $1`,
      [resource_id]
    );

    res.status(201).json(newMaintenance.rows[0]);
  } catch (err) {
    console.error("Error creating maintenance request:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// 📄 جلب كل بلاغات الصيانة
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.*, r.name AS resource_name, r.location AS resource_location, u.name AS reporter_name
      FROM maintenances m
      JOIN resources r ON m.resource_id = r.id
      JOIN users u ON m.reported_by = u.id;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching maintenance requests:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// 🧹 حذف بلاغ صيانة
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM maintenances WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting maintenance request:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔄 تغيير حالة حل العطل
router.put('/resolve/:id', async (req, res) => {
  const id = req.params.id;
  try {
    // 1. جلب بلاغ الصيانة
    const reportResult = await pool.query('SELECT * FROM maintenances WHERE id = $1', [id]);
    if (reportResult.rows.length === 0) {
      return res.status(404).json({ message: 'Maintenance request not found' });
    }
    const report = reportResult.rows[0];

    // 2. تغيير date_resolved
    const newDateResolved = report.date_resolved ? null : new Date();

    // 3. تحديث التاريخ
    await pool.query(
      'UPDATE maintenances SET date_resolved = $1 WHERE id = $2',
      [newDateResolved, id]
    );

    // 4. تفعيل أو تعطيل المورد حسب الحالة
    await pool.query(
      'UPDATE resources SET is_active = $1 WHERE id = $2',
      [newDateResolved ? true : false, report.resource_id]
    );

    // 5. إعادة إرسال السطر كامل مع JOIN لتفادي ظهور الأرقام فقط
    const updatedFull = await pool.query(`
      SELECT m.*, r.name AS resource_name, r.location AS resource_location, u.name AS reporter_name
      FROM maintenances m
      JOIN resources r ON m.resource_id = r.id
      JOIN users u ON m.reported_by = u.id
      WHERE m.id = $1;
    `, [id]);

    res.json(updatedFull.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
