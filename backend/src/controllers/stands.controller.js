import pool from "../config/db.js";

/**
 * GET /api/stands
 * Public: returns approved stands + coop basic info (logo, city, etc)
 */
export const getAllStands = async (_req, res) => {
  try {
    const [stands] = await pool.query(`
      SELECT 
        s.*,
        u.full_name AS coop_name,
        u.phone AS coop_phone,
        u.whatsapp AS coop_whatsapp,
        u.city,
        u.logo
      FROM stands s
      JOIN users u ON u.id = s.user_id
      WHERE s.is_approved = 1
      ORDER BY s.created_at DESC
    `);

    res.json(stands);
  } catch (err) {
    console.error("GET ALL STANDS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/stands/:id
 * Public: details of one stand + coop info
 */
export const getStandDetails = async (req, res) => {
  try {
    const standId = req.params.id;

    const [standRows] = await pool.query(
      `
      SELECT 
        s.*,
        u.full_name AS coop_name,
        u.phone AS coop_phone,
        u.whatsapp AS coop_whatsapp,
        u.city,
        u.logo,
        u.bio
      FROM stands s
      JOIN users u ON u.id = s.user_id
      WHERE s.id = ?
      `,
      [standId]
    );

    if (!standRows.length) {
      return res.status(404).json({ message: "Stand not found" });
    }

    res.json(standRows[0]);
  } catch (err) {
    console.error("GET STAND DETAILS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/stands (COOP)
 */
export const createStand = async (req, res) => {
  try {
    const { stand_name, description, category, address, cover_image } = req.body;
    if (!stand_name) return res.status(400).json({ message: "Stand name is required" });

    const [result] = await pool.query(
      `
      INSERT INTO stands (user_id, stand_name, description, category, address, cover_image, is_approved)
      VALUES (?, ?, ?, ?, ?, ?, 0)
      `,
      [
        req.user.id,
        stand_name,
        description || null,
        category || null,
        address || null,
        cover_image || null,
      ]
    );

    res.json({ message: "Stand created, pending approval.", stand_id: result.insertId });
  } catch (err) {
    console.error("CREATE STAND ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyStands = async (req, res) => {
  try {
    const [stands] = await pool.query(
      `
      SELECT s.*, u.full_name, u.phone, u.whatsapp, u.city, u.logo
      FROM stands s
      JOIN users u ON u.id = s.user_id
      WHERE s.user_id = ?
      ORDER BY s.created_at DESC
      `,
      [req.user.id]
    );
    res.json(stands);
  } catch (err) {
    console.error("GET MY STANDS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
