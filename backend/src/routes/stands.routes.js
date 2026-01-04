import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { uploadCloud } from "../middleware/uploadCloud.js";

import {
  getAllStands,
  getMyStands,
  createStand,
  getStandDetails,
} from "../controllers/stands.controller.js";

import { uploadStandCover } from "../controllers/stands.upload.controller.js";

const router = express.Router();

// ✅ Public
router.get("/", getAllStands);
router.get("/:id", getStandDetails);

// ✅ Coop
router.get("/me/list", authMiddleware, getMyStands);
router.post("/", authMiddleware, createStand);
router.post("/:standId/cover", authMiddleware, uploadCloud.single("cover"), uploadStandCover);

export default router;
