import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { uploadCloud } from "../middleware/uploadCloud.js";
import pool from "../config/db.js";

import {
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  uploadProductImage,
} from "../controllers/products.controller.js";

const router = Router();

// ✅ COOP routes
router.get("/my", authMiddleware, getMyProducts);
router.post("/", authMiddleware, createProduct);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);
router.post("/:id/image", authMiddleware, uploadCloud.single("image"), uploadProductImage);

// ✅ PUBLIC products by stand
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

export default router;
