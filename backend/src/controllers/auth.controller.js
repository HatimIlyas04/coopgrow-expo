import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }

    const [exists] = await pool.query("SELECT id FROM users WHERE email=?", [email]);
    if (exists.length) return res.status(400).json({ message: "Email déjà utilisé" });

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (full_name, email, password, role, is_approved) VALUES (?, ?, ?, 'COOP', 0)",
      [full_name, email, hashed]
    );

    res.json({ message: "Inscription réussie ✅" });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body);

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    const [rows] = await pool.query("SELECT * FROM users WHERE email=?", [email]);
    console.log("USER FOUND:", rows.length);

    if (!rows.length) return res.status(401).json({ message: "Email incorrect" });

    const user = rows[0];

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Mot de passe incorrect" });

    if (!process.env.JWT_SECRET) {
      console.log("JWT_SECRET is missing!");
      return res.status(500).json({ message: "JWT_SECRET missing in env" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    delete user.password;

    res.json({ token, user });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
