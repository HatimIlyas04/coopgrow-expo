import db from "../config/db.js";

export const uploadStandCover = async (req, res) => {
  try {
    const standId = req.params.standId;
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const coverUrl = req.file.path; // ✅ Cloudinary URL

    await pool.query("UPDATE stands SET cover_image=? WHERE id=?", [coverUrl, standId]);

    res.json({ message: "Cover upload ✅", cover_image: coverUrl });
  } catch (err) {
    console.error("UPLOAD COVER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
