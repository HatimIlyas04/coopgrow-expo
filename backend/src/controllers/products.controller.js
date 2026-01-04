import pool from "../config/db.js";

// ✅ Create product
export const createProduct = async (req, res) => {
  try {
    const { stand_id, title, description, price } = req.body;

    if (!stand_id) return res.status(400).json({ message: "stand_id obligatoire" });
    if (!title) return res.status(400).json({ message: "title is required" });

    // ✅ verify stand belongs to current coop
    const [sRows] = await pool.query(
      "SELECT * FROM stands WHERE id=? AND user_id=?",
      [stand_id, req.user.id]
    );
    if (!sRows.length) {
      return res.status(403).json({ message: "Stand introuvable ou pas à vous" });
    }

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

// ✅ Update product
export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description, price, stock, is_visible } = req.body;

    // ✅ Check ownership
    const [rows] = await pool.query(
      `
      SELECT p.* FROM products p
      JOIN stands s ON s.id=p.stand_id
      WHERE p.id=? AND s.user_id=?
      `,
      [id, req.user.id]
    );

    if (!rows.length) return res.status(404).json({ message: "Produit introuvable" });

    await pool.query(
      `UPDATE products SET
        title=?,
        description=?,
        price=?,
        stock=?,
        is_visible=?
      WHERE id=?`,
      [
        title ?? rows[0].title,
        description ?? rows[0].description,
        price ?? rows[0].price,
        stock ?? rows[0].stock,
        is_visible ?? rows[0].is_visible,
        id,
      ]
    );

    res.json({ message: "Produit modifié ✅" });
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete product
export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const [rows] = await pool.query(
      `
      SELECT p.* FROM products p
      JOIN stands s ON s.id=p.stand_id
      WHERE p.id=? AND s.user_id=?
      `,
      [id, req.user.id]
    );

    if (!rows.length) return res.status(404).json({ message: "Produit introuvable" });

    await pool.query("DELETE FROM products WHERE id=?", [id]);
    res.json({ message: "Produit supprimé ✅" });
  } catch (err) {
    console.error("DELETE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ My products (all products for my stand)
export const getMyProducts = async (req, res) => {
  try {
    const [stand] = await pool.query("SELECT id FROM stands WHERE user_id=?", [req.user.id]);
    if (!stand.length) return res.json([]);

    const [products] = await pool.query(
      "SELECT * FROM products WHERE stand_id=? ORDER BY created_at DESC",
      [stand[0].id]
    );

    res.json(products);
  } catch (err) {
    console.error("GET MY PRODUCTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Upload product image (Cloudinary)
export const uploadProductImage = async (req, res) => {
  try {
    const id = req.params.id;
    if (!req.file) return res.status(400).json({ message: "Image requise" });

    // ✅ Cloudinary URL
    const imageUrl = req.file.path;

    await pool.query("UPDATE products SET image=? WHERE id=?", [imageUrl, id]);

    res.json({ message: "Image upload ok ✅", image: imageUrl });
  } catch (err) {
    console.error("UPLOAD PRODUCT IMAGE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
