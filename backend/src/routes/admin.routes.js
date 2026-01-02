import express from "express";
import { authMiddleware, adminOnly } from "../middleware/auth.js";

import { getStats, deleteStand } from "../controllers/admin.stats.controller.js";

import {
  getPendingStands,
  approveStand,
  rejectStand,
  getAllStands,
  updateStand,
} from "../controllers/admin.controller.js";

import {
  getPendingUsers,
  approveUser,
  rejectUser,
  getAllUsers,
} from "../controllers/admin.users.controller.js";

import {
  getAllProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/admin.products.controller.js";

const router = express.Router();

/* ✅ STATS */
router.get("/stats", authMiddleware, adminOnly, getStats);

/* ✅ USERS */
router.get("/users/pending", authMiddleware, adminOnly, getPendingUsers);
router.put("/users/:id/approve", authMiddleware, adminOnly, approveUser);
router.put("/users/:id/reject", authMiddleware, adminOnly, rejectUser);
router.get("/users/all", authMiddleware, adminOnly, getAllUsers);
// router.get("/all", authMiddleware, adminOnly, getAllRequests);


/* ✅ STANDS */
router.get("/stands/pending", authMiddleware, adminOnly, getPendingStands);
router.put("/stands/:id/approve", authMiddleware, adminOnly, approveStand);
router.put("/stands/:id/reject", authMiddleware, adminOnly, rejectStand);
router.get("/stands/all", authMiddleware, adminOnly, getAllStands);
router.put("/stands/:id", authMiddleware, adminOnly, updateStand);
router.delete("/stands/:id", authMiddleware, adminOnly, deleteStand);

/* ✅ PRODUCTS */
router.get("/products/all", authMiddleware, adminOnly, getAllProducts);
router.put("/products/:id", authMiddleware, adminOnly, updateProduct);
router.delete("/products/:id", authMiddleware, adminOnly, deleteProduct);

export default router;
