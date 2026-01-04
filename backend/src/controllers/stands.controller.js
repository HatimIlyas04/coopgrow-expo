import pool from "../config/db.js";

export const updateStand = async (req, res) => {
  try {
    const standId = Number(req.params.id);
    const { stand_name, description, category, address } = req.body;

    const [rows] = await pool.query(
      "SELECT * FROM stands WHERE id=? AND user_id=?",
      [standId, req.user.id]
    );
    if (!rows.length) return res.status(403).json({ message: "Stand غير تابع لك" });

    await pool.query(
      "UPDATE stands SET stand_name=?, description=?, category=?, address=? WHERE id=?",
      [stand_name, description, category, address, standId]
    );

    res.json({ message: "✅ Stand updated" });
  } catch (err) {
    console.error("UPDATE STAND ERROR:", err);
    res.status(500).json({ message: "Erreur update stand" });
  }
};

export const deleteStand = async (req, res) => {
  try {
    const standId = Number(req.params.id);

    const [rows] = await pool.query(
      "SELECT * FROM stands WHERE id=? AND user_id=?",
      [standId, req.user.id]
    );
    if (!rows.length) return res.status(403).json({ message: "Stand غير تابع لك" });

    await pool.query("DELETE FROM requests WHERE stand_id=?", [standId]);
    await pool.query("DELETE FROM products WHERE stand_id=?", [standId]);
    await pool.query("DELETE FROM stands WHERE id=?", [standId]);

    res.json({ message: "✅ Stand deleted" });
  } catch (err) {
    console.error("DELETE STAND ERROR:", err);
    res.status(500).json({ message: "Erreur delete stand" });
  }
};
