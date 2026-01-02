import db from "../config/db.js";

export async function uploadProductImage(req, res) {
  try {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // ensure product belongs to coop
    const [rows] = await db.query(
      `SELECT p.id
       FROM products p
       JOIN stands s ON s.id = p.stand_id
       WHERE p.id=? AND s.user_id=?`,
      [id, req.user.id]
    );
    if (!rows.length) return res.status(403).json({ message: "Not your product" });

    const filePath = `/uploads/${req.file.filename}`;
    await db.query("UPDATE products SET image=? WHERE id=?", [filePath, id]);

    return res.json({ message: "Image uploaded ✅", image: filePath });
  } catch (err) {
    console.error("UPLOAD PRODUCT IMAGE ERROR:", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
