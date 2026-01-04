import db from "../config/db.js";

export async function getMyProfile(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT id, full_name, email, phone, whatsapp, city, role, is_approved, logo, bio
       FROM users WHERE id=?`,
      [req.user.id]
    );

    if (!rows.length) return res.status(404).json({ message: "Utilisateur introuvable" });

    return res.json(rows[0]);
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

export async function updateMyProfile(req, res) {
  try {
    const { full_name, phone, whatsapp, city, bio } = req.body;

    await db.query(
      `UPDATE users SET full_name=?, phone=?, whatsapp=?, city=?, bio=? WHERE id=?`,
      [full_name, phone, whatsapp, city, bio, req.user.id]
    );

    return res.json({ message: "Profil mis à jour ✅" });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

export async function uploadLogo(req, res) {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const imageUrl = req.file.path; // ✅ Cloudinary URL

    await db.query("UPDATE users SET logo=? WHERE id=?", [imageUrl, req.user.id]);

    return res.json({ message: "Logo upload ✅", logo: imageUrl });
  } catch (err) {
    console.error("UPLOAD LOGO ERROR:", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
