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

    res.status(201).json(newMaintenance.rows[0]);
  } catch (err) {
    console.error("Error creating maintenance request:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// 📄 جلب كل بلاغات الصيانة مع أسماء المستخدمين والموارد (ان أمكن)
router.get("/", async (req, res) => {
  try {
    // مثال لجلب البيانات مع JOIN لأسماء الموارد والمبلغين (إذا تريد)
    const result = await pool.query(`
      SELECT m.*, r.name AS resource_name, u.name AS reporter_name
      FROM maintenances m
      LEFT JOIN resources r ON m.resource_id = r.id
      LEFT JOIN users u ON m.reported_by = u.id
      ORDER BY m.id DESC
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

// 🔄 تغيير حالة حل العطل (تبديل تاريخ الحل)
router.put("/resolve/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const current = await pool.query("SELECT date_resolved FROM maintenances WHERE id = $1", [id]);
    const resolved = current.rows[0]?.date_resolved;

    const newValue = resolved ? null : new Date().toISOString().split("T")[0];
    const updated = await pool.query(
      "UPDATE maintenances SET date_resolved = $1 WHERE id = $2 RETURNING *",
      [newValue, id]
    );

    res.json(updated.rows[0]);
  } catch (err) {
    console.error("Error updating resolve status:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
