import pool from "../config/db.js";
import { fullImageUrl } from "../utils/url.js";

export const createProduct = async (req, res) => {
  try {
    const { stand_id, title, description, price } = req.body;
    if (!stand_id) return res.status(400).json({ message: "stand_id obligatoire" });
    if (!title) return res.status(400).json({ message: "title is required" });

    const [sRows] = await pool.query(
      "SELECT * FROM stands WHERE id=? AND user_id=?",
      [stand_id, req.user.id]
    );
    if (!sRows.length) return res.status(403).json({ message: "Stand introuvable ou pas à vous" });

    const [result] = await pool.query(
      `INSERT INTO products (stand_id, title, description, price, image)
       VALUES (?, ?, ?, ?, NULL)`,
      [stand_id, title, description || null, price || null]
    );

    res.json({ message: "ok", product_id: result.insertId });
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyProducts = async (req, res) => {
  try {
    const [stand] = await pool.query("SELECT id FROM stands WHERE user_id=?", [req.user.id]);
    if (!stand.length) return res.json([]);

    const [products] = await pool.query(
      "SELECT * FROM products WHERE stand_id=? ORDER BY created_at DESC",
      [stand[0].id]
    );

    const fixed = products.map((p) => ({
      ...p,
      image: fullImageUrl(req, p.image),
    }));

    res.json(fixed);
  } catch (err) {
    console.error("GET MY PRODUCTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const uploadProductImage = async (req, res) => {
  try {
    const id = req.params.id;
    if (!req.file) return res.status(400).json({ message: "Image requise" });

    const imagePath = `/uploads/${req.file.filename}`;
    await pool.query("UPDATE products SET image=? WHERE id=?", [imagePath, id]);

    res.json({
      message: "Image upload ok",
      image: fullImageUrl(req, imagePath),
    });
  } catch (err) {
    console.error("UPLOAD PRODUCT IMAGE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ ADD THIS (it was missing)
export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    // ensure user owns the stand
    const [stand] = await pool.query("SELECT id FROM stands WHERE user_id=?", [req.user.id]);
    if (!stand.length) return res.status(403).json({ message: "Stand introuvable" });

    const [result] = await pool.query(
      "DELETE FROM products WHERE id=? AND stand_id=?",
      [id, stand[0].id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product introuvable" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("DELETE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description, price, is_visible } = req.body;

    // تأكد المستخدم عندو stand
    const [stand] = await pool.query("SELECT id FROM stands WHERE user_id=?", [req.user.id]);
    if (!stand.length) return res.status(403).json({ message: "Stand introuvable" });

    const fields = [];
    const values = [];

    if (title !== undefined) {
      fields.push("title=?");
      values.push(title);
    }
    if (description !== undefined) {
      fields.push("description=?");
      values.push(description);
    }
    if (price !== undefined) {
      fields.push("price=?");
      values.push(price);
    }
    if (is_visible !== undefined) {
      fields.push("is_visible=?");
      values.push(is_visible ? 1 : 0);
    }

    if (!fields.length) {
      return res.status(400).json({ message: "Aucun champ à modifier" });
    }

    values.push(id, stand[0].id);

    const [result] = await pool.query(
      `UPDATE products SET ${fields.join(", ")} WHERE id=? AND stand_id=?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product introuvable" });
    }

    res.json({ message: "Product updated successfully" });
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
