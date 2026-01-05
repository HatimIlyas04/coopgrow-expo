import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { uploadCloud } from "../middleware/uploadCloud.js";
import { getMyProfile, updateMyProfile, uploadLogo } from "../controllers/profile.controller.js";

const router = Router();

router.get("/me", authMiddleware, getMyProfile);
router.put("/me", authMiddleware, updateMyProfile);

// ✅ LOGO UPLOAD TO CLOUDINARY
router.post("/me/logo", authMiddleware, uploadCloud.single("logo"), uploadLogo);

export default router;
