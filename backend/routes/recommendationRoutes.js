import express from "express";
import { getRecommendations } from "../controllers/recommendationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/recommendations - Generate contextual outfit recommendations
router.get("/", authMiddleware, getRecommendations);

// POST /api/recommendations - Generate contextual recommendations with custom body (e.g. weather override)
router.post("/", authMiddleware, getRecommendations);

export default router;
