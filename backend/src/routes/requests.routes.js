import express from "express";
import { authMiddleware, adminOnly } from "../middleware/auth.js";
import {
  createRequest,
  getMyRequests,
  getAllRequests,
  updateRequestStatus,
} from "../controllers/requests.controller.js";

const router = express.Router();

// visiteur -> créer une demande
router.post("/", createRequest);

// coop -> voir ses demandes
router.get("/my", authMiddleware, getMyRequests);

// admin -> toutes les demandes
router.get("/all", authMiddleware, adminOnly, getAllRequests);

// coop -> update status
router.put("/:id/status", authMiddleware, updateRequestStatus);

export default router;
