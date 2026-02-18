import pool from "../config/db.js";
import { getUploadedUrl } from "../utils/uploadUrl.js";
import { fullImageUrl } from "../utils/url.js";

export const uploadStandCover = async (req, res) => {
  try {
    const standId = req.params.id; // ✅ matches /stands/:id/cover
    if (!req.file) return res.status(400).json({ message: "Image requise" });

    const coverUrl = getUploadedUrl(req); // ✅ Cloudinary URL or /uploads fallback
    if (!coverUrl) return res.status(400).json({ message: "Upload failed" });

    // ✅ Protect: only owner can update
    const [result] = await pool.query(
      "UPDATE stands SET cover_image=? WHERE id=? AND user_id=?",
      [coverUrl, standId, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Stand introuvable ou pas à vous" });
    }

    res.json({ message: "Cover upload ✅", cover_image: fullImageUrl(req, coverUrl) });
  } catch (err) {
    console.error("UPLOAD COVER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const uploadStandLogo = async (req, res) => {
  try {
    const standId = req.params.id; // ✅ matches /stands/:id/logo
    if (!req.file) return res.status(400).json({ message: "Image requise" });

    const logoUrl = getUploadedUrl(req);
    if (!logoUrl) return res.status(400).json({ message: "Upload failed" });

    const [result] = await pool.query(
      "UPDATE stands SET logo=? WHERE id=? AND user_id=?",
      [logoUrl, standId, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Stand introuvable ou pas à vous" });
    }

    res.json({ message: "Logo upload ✅", logo: fullImageUrl(req, logoUrl) });
  } catch (err) {
    console.error("UPLOAD LOGO ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
