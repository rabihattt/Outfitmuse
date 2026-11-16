
import express from "express";

import {
    createStyleProfile,
    getStyleProfile,
    checkStyleProfileStatus
} from "../controllers/styleProfileController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Style Profile
router.post("/", authMiddleware, createStyleProfile);

// Get User Style Profile
router.get("/", authMiddleware, getStyleProfile);

// Check Profile Completion Status
router.get("/status", authMiddleware, checkStyleProfileStatus);

export default router;
