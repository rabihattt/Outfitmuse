
import express from "express";

import {
    addWardrobeItem,
    getWardrobeItems,
    updateWardrobeItem,
    deleteWardrobeItem
} from "../controllers/wardrobeController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Add clothing item
router.post(
    "/",
    authMiddleware,
    upload.single("image"),
    addWardrobeItem
);

// Get all wardrobe items
router.get(
    "/",
    authMiddleware,
    getWardrobeItems
);

// Update clothing item
router.put(
    "/:id",
    authMiddleware,
    upload.single("image"),
    updateWardrobeItem
);

// Delete clothing item
router.delete(
    "/:id",
    authMiddleware,
    deleteWardrobeItem
);

export default router;
