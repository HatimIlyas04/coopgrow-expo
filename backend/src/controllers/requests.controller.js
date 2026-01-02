// backend/src/controllers/requests.controller.js
import pool from "../config/db.js";

// ✅ Visitor create request
export const createRequest = async (req, res) => {
  try {
    const {
      stand_id,
      product_id,
      visitor_name,
      visitor_phone,
      visitor_email,
      visitor_city,
      qty,
      visitor_message,
    } = req.body;

    if (!stand_id) return res.status(400).json({ message: "stand_id obligatoire" });
    if (!visitor_name) return res.status(400).json({ message: "Nom obligatoire" });
    if (!visitor_phone) return res.status(400).json({ message: "Téléphone obligatoire" });

    await pool.query(
      `INSERT INTO requests
      (stand_id, product_id, visitor_name, visitor_phone, visitor_email, visitor_city, qty, visitor_message)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        stand_id,
        product_id || null,
        visitor_name,
        visitor_phone,
        visitor_email || null,
        visitor_city || null,
        qty || null,
        visitor_message || null,
      ]
    );

    res.json({ message: "✅ Demande envoyée" });
  } catch (err) {
    console.error("CREATE REQUEST ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Coop: get my requests
export const getMyRequests = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        r.*,
        s.stand_name,
        p.title AS product_title,
        p.image AS product_image
      FROM requests r
      JOIN stands s ON s.id = r.stand_id
      LEFT JOIN products p ON p.id = r.product_id
      WHERE s.user_id = ?
      ORDER BY r.created_at DESC
      `,
      [req.user.id]
    );

    res.json(rows);
  } catch (err) {
    console.error("GET MY REQUESTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Admin: get all requests
export const getAllRequests = async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        r.*,
        s.stand_name,
        u.full_name AS coop_name,
        u.phone AS coop_phone,
        u.whatsapp AS coop_whatsapp,
        p.title AS product_title
      FROM requests r
      JOIN stands s ON s.id = r.stand_id
      JOIN users u ON u.id = s.user_id
      LEFT JOIN products p ON p.id = r.product_id
      ORDER BY r.created_at DESC
      `
    );

    res.json(rows);
  } catch (err) {
    console.error("GET ALL REQUESTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Coop: update status
export const updateRequestStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    if (!["NEW", "CONTACTED", "CLOSED"].includes(status)) {
      return res.status(400).json({ message: "Status invalide" });
    }

    // ownership check
    const [rows] = await pool.query(
      `
      SELECT r.id FROM requests r
      JOIN stands s ON s.id = r.stand_id
      WHERE r.id=? AND s.user_id=?
      `,
      [id, req.user.id]
    );

    if (!rows.length) return res.status(404).json({ message: "Demande introuvable" });

    await pool.query("UPDATE requests SET status=? WHERE id=?", [status, id]);

    res.json({ message: "Status mis à jour" });
  } catch (err) {
    console.error("UPDATE REQUEST STATUS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
