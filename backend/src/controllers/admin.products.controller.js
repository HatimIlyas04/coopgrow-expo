import db from "../config/db.js";

/* ✅ GET ALL PRODUCTS */
export const getAllProducts = async (_req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, s.stand_name
      FROM products p
      LEFT JOIN stands s ON s.id = p.stand_id
      ORDER BY p.id DESC
    `);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: "Erreur getAllProducts" });
  }
};

/* ✅ UPDATE PRODUCT */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price, description } = req.body;

    await db.query(
      "UPDATE products SET title=?, price=?, description=? WHERE id=?",
      [title, price, description, id]
    );

    res.json({ message: "✅ Produit modifié" });
  } catch (e) {
    res.status(500).json({ message: "Erreur updateProduct" });
  }
};

/* ✅ DELETE PRODUCT */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM products WHERE id=?", [id]);
    res.json({ message: "✅ Produit supprimé" });
  } catch (e) {
    res.status(500).json({ message: "Erreur deleteProduct" });
  }
};
