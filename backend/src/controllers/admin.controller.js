import db from "../config/db.js";

export const getPendingStands = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT s.*, u.full_name, u.email, u.phone, u.whatsapp, u.city
       FROM stands s
       JOIN users u ON u.id = s.user_id
       WHERE s.is_approved = 0
       ORDER BY s.id DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error pending stands", error: err.message });
  }
};

export const approveStand = async (req, res) => {
  try {
    const { id } = req.params;
    const [r] = await db.query("UPDATE stands SET is_approved = 1 WHERE id = ?", [id]);
    if (r.affectedRows === 0) return res.status(404).json({ message: "Stand not found" });
    res.json({ message: "Stand approved" });
  } catch (err) {
    res.status(500).json({ message: "Error approve", error: err.message });
  }
};

export const rejectStand = async (req, res) => {
  try {
    const { id } = req.params;
    const [r] = await db.query("UPDATE stands SET is_approved = -1 WHERE id = ?", [id]);
    if (r.affectedRows === 0) return res.status(404).json({ message: "Stand not found" });
    res.json({ message: "Stand rejected" });
  } catch (err) {
    res.status(500).json({ message: "Error reject", error: err.message });
  }
};

export const getAllStands = async (_req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, u.full_name, u.phone, u.whatsapp
      FROM stands s
      LEFT JOIN users u ON u.id = s.user_id
      ORDER BY s.id DESC
    `);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: "Erreur getAllStands" });
  }
};

export const updateStand = async (req, res) => {
  try {
    const { id } = req.params;
    const { stand_name, city, category, address, description } = req.body;

    await db.query(
      "UPDATE stands SET stand_name=?, city=?, category=?, address=?, description=? WHERE id=?",
      [stand_name, city, category, address, description, id]
    );

    res.json({ message: "✅ Stand modifié" });
  } catch (e) {
    res.status(500).json({ message: "Erreur updateStand" });
  }
};
