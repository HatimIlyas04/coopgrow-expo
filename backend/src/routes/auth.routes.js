import express from "express";
import { register, login } from "../controllers/auth.controller.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ ok: true, route: "auth works ✅" });
});
router.get("/test", (req, res) => {
  res.json({ ok: true, message: "AUTH ROUTE WORKS ✅" });
});

router.post("/register", register);
router.post("/login", login);

export default router;
