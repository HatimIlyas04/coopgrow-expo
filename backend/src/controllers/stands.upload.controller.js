import db from "../config/db.js";

export async function uploadStandCover(req, res) {
  try {
    const { standId } = req.params;
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // ensure stand belongs to this coop
    const [rows] = await db.query("SELECT id FROM stands WHERE id=? AND user_id=?", [
      standId,
      req.user.id,
    ]);
    if (!rows.length) return res.status(403).json({ message: "Not your stand" });

    const filePath = `/uploads/${req.file.filename}`;
    await db.query("UPDATE stands SET cover_image=? WHERE id=?", [filePath, standId]);

    return res.json({ message: "Cover updated ✅", cover_image: filePath });
  } catch (err) {
    console.error("UPLOAD STAND COVER ERROR:", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
