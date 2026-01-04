import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

import {
  getAllStands,
  getMyStands,
  createStand,
  getStandDetails,
  updateStand,
  deleteStand,
} from "../controllers/stands.controller.js";

import { uploadStandCover } from "../controllers/stands.upload.controller.js";

const router = express.Router();

// ✅ TEST
router.get("/test", (req, res) => {
  res.json({ ok: true, route: "stands works ✅" });
});

// ✅ PUBLIC
router.get("/", getAllStands);
router.get("/:id", getStandDetails);

// ✅ COOP protected
router.get("/me/list", authMiddleware, getMyStands);
router.post("/", authMiddleware, createStand);

// ✅ upload cover
router.post(
  "/:standId/cover",
  authMiddleware,
  upload.single("cover"),
  uploadStandCover
);

// ✅ UPDATE + DELETE (better inside controller)
router.put("/:id", authMiddleware, updateStand);
router.delete("/:id", authMiddleware, deleteStand);

export default router;
