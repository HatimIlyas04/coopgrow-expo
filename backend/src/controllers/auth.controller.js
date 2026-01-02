import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function register(req, res) {
  try {
    const { full_name, email, password, phone, whatsapp, city } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ message: "Champs obligatoires manquants." });
    }

    const [exists] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (exists.length) {
      return res.status(400).json({ message: "Cet email existe déjà." });
    }

    const hash = await bcrypt.hash(password, 10);

    // COOP accounts start as pending (is_approved = 0)
    const [result] = await db.query(
      `INSERT INTO users (full_name, email, password_hash, role, phone, whatsapp, city, is_approved)
       VALUES (?, ?, ?, 'COOP', ?, ?, ?, 0)`,
      [full_name, email, hash, phone || null, whatsapp || null, city || null]
    );

    return res.json({
      message: "Compte créé. En attente de validation par l'administration.",
      user_id: result.insertId,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (!rows.length) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect." });
    }

    const user = rows[0];

    // block COOP login if not approved
    if (user.role === "COOP" && user.is_approved !== 1) {
      return res.status(403).json({
        message: "Votre compte est en attente de validation par l'administration.",
      });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect." });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
}
