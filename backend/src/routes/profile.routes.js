import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { getMyProfile, updateMyProfile, uploadLogo } from "../controllers/profile.controller.js";

const router = Router();

router.get("/me", authMiddleware, getMyProfile);
router.put("/me", authMiddleware, updateMyProfile);
router.post("/me/logo", authMiddleware, upload.single("logo"), uploadLogo);

export default router;
