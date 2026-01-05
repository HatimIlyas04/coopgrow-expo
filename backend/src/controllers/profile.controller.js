import db from "../config/db.js";
import { fullImageUrl } from "../utils/url.js";

export async function getMyProfile(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT id, full_name, email, phone, whatsapp, city, role, is_approved, logo, bio
       FROM users WHERE id=?`,
      [req.user.id]
    );

    if (!rows.length) return res.status(404).json({ message: "Utilisateur introuvable" });

    const user = rows[0];
    user.logo = fullImageUrl(req, user.logo);

    return res.json(user);
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

    const filePath = `/uploads/${req.file.filename}`;

    await db.query("UPDATE users SET logo=? WHERE id=?", [filePath, req.user.id]);

    return res.json({
      message: "Logo upload ✅",
      logo: fullImageUrl(req, filePath),
    });
  } catch (err) {
    console.error("UPLOAD LOGO ERROR:", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
