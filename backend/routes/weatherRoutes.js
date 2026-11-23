import express from "express";
import jwt from "jsonwebtoken";
import {
    getCurrentWeather,
    searchCities,
    saveUserLocation,
    getUserLocation
} from "../controllers/weatherController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Optional authentication middleware for current weather
const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded?.id) {
                req.user = { id: decoded.id, role: decoded.role };
            }
        }
    } catch {
        // Continue unauthenticated if token invalid or absent
    }
    next();
};

// 1. Get current weather
router.get("/current", optionalAuth, getCurrentWeather);

// 2. Search locations / cities
router.get("/search", searchCities);

// 3. User location persistence
router.post("/user-location", authMiddleware, saveUserLocation);
router.get("/user-location", authMiddleware, getUserLocation);

export default router;
