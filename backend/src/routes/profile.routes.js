import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { uploadCloud } from "../middleware/uploadCloud.js";

import { getMyProfile, updateMyProfile, uploadLogo } from "../controllers/profile.controller.js";

const router = Router();

// ✅ Profile
router.get("/me", authMiddleware, getMyProfile);
router.put("/me", authMiddleware, updateMyProfile);

// ✅ Upload logo (Cloudinary)
router.post("/me/logo", authMiddleware, uploadCloud.single("logo"), uploadLogo);

export default router;
