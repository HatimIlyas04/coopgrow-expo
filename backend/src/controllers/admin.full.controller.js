import db from "../config/db.js";

/* ---------------- USERS ---------------- */
export const getAllUsers = async (_req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, full_name, email, city, phone, whatsapp, role, status, created_at FROM users ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Erreur chargement users", err });
  }
};

/* ---------------- STANDS ---------------- */
export const getAllStands = async (_req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT s.*, u.full_name, u.phone, u.whatsapp 
       FROM stands s 
       LEFT JOIN users u ON u.id = s.user_id 
       ORDER BY s.id DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Erreur chargement stands", err });
  }
};

export const updateStandAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const { stand_name, city, category, address, description } = req.body;

    await db.query(
      `UPDATE stands 
       SET stand_name=?, city=?, category=?, address=?, description=? 
       WHERE id=?`,
      [stand_name, city, category, address, description, id]
    );

    res.json({ message: "✅ Stand modifié" });
  } catch (err) {
    res.status(500).json({ message: "Erreur modification stand", err });
  }
};

/* ---------------- PRODUCTS ---------------- */
export const getAllProducts = async (_req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, s.stand_name 
       FROM products p 
       LEFT JOIN stands s ON s.id = p.stand_id 
       ORDER BY p.id DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Erreur chargement produits", err });
  }
};

export const updateProductAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description, price } = req.body;

    await db.query(
      `UPDATE products 
       SET title=?, description=?, price=? 
       WHERE id=?`,
      [title, description, price, id]
    );

    res.json({ message: "✅ Produit modifié" });
  } catch (err) {
    res.status(500).json({ message: "Erreur modification produit", err });
  }
};

export const deleteProductAdmin = async (req, res) => {
  try {
    const id = req.params.id;

    await db.query("DELETE FROM products WHERE id=?", [id]);

    res.json({ message: "✅ Produit supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur suppression produit", err });
  }
};
