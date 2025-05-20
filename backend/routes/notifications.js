// routes/notifications.js
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM notifications WHERE user_id = $1 ORDER BY date_sent DESC",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching notifications:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});
