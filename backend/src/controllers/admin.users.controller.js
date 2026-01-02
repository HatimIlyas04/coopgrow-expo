import db from "../config/db.js";

export async function getPendingUsers(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT id, full_name, email, phone, whatsapp, city, created_at
       FROM users
       WHERE role='COOP' AND is_approved=0
       ORDER BY id DESC`
    );
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ message: "Error pending users", error: err.message });
  }
}

export async function approveUser(req, res) {
  try {
    const { id } = req.params;
    const [r] = await db.query("UPDATE users SET is_approved=1 WHERE id=?", [id]);
    if (r.affectedRows === 0) return res.status(404).json({ message: "User not found" });
    return res.json({ message: "User approved" });
  } catch (err) {
    return res.status(500).json({ message: "Error approve user", error: err.message });
  }
}

export async function rejectUser(req, res) {
  try {
    const { id } = req.params;
    const [r] = await db.query("UPDATE users SET is_approved=-1 WHERE id=?", [id]);
    if (r.affectedRows === 0) return res.status(404).json({ message: "User not found" });
    return res.json({ message: "User rejected" });
  } catch (err) {
    return res.status(500).json({ message: "Error reject user", error: err.message });
  }
}
export const getAllUsers = async (_req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users ORDER BY id DESC");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: "Erreur getAllUsers" });
  }
};
