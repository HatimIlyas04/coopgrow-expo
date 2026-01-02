// backend/src/routes/products.routes.js
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { upload } from "../utils/upload.js";
import pool from "../config/db.js";

import {
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  uploadProductImage,
} from "../controllers/products.controller.js";

const router = Router();

router.get("/my", authMiddleware, getMyProducts);
router.post("/", authMiddleware, createProduct);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);
router.post("/:id/image", authMiddleware, upload.single("image"), uploadProductImage);
router.get("/stand/:id", async (req, res) => {
  try {
    const standId = req.params.id;
    const [rows] = await pool.query(
      "SELECT * FROM products WHERE stand_id=? AND is_visible=1 ORDER BY created_at DESC",
      [standId]
    );
    res.json(rows);
  } catch (err) {
    console.error("GET STAND PRODUCTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// UPDATE PRODUCT
router.put("/:id", authMiddleware, async (req, res) => {
  const productId = Number(req.params.id);
  const { title, price, description } = req.body;

  try {
    // تأكد product تابع لstand ديال user
    const [rows] = await db.query(
      `SELECT p.* FROM products p
       JOIN stands s ON s.id=p.stand_id
       WHERE p.id=? AND s.user_id=?`,
      [productId, req.user.id]
    );

    if (rows.length === 0)
      return res.status(403).json({ message: "Produit غير تابع لك" });

    await db.query(
      "UPDATE products SET title=?, price=?, description=? WHERE id=?",
      [title, price, description, productId]
    );

    res.json({ message: "✅ Product updated" });
  } catch (err) {
    res.status(500).json({ message: "Erreur update product" });
  }
});



export default router;
