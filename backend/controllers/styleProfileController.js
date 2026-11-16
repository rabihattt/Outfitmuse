
import StyleProfile from "../models/StyleProfile.js";

// CREATE STYLE PROFILE
export const createStyleProfile = async (req, res) => {
    try {
        const {
            height,
            bodyShape,
            preferredStyles,
            favoriteColors,
            dislikedColorsPatterns,
            preferredClothingItems,
            preferredFits,
            comfortableOutfitType,
            preferredOccasions,
            fashionInspirations
        } = req.body;

        // Validate required fields
        if (!height || !bodyShape || !comfortableOutfitType) {
            return res.status(400).json({
                message: "Please complete all required questions"
            });
        }

        // Validate multiple selection fields
        const selectionFields = [
            preferredStyles,
            favoriteColors,
            dislikedColorsPatterns,
            preferredClothingItems,
            preferredFits,
            preferredOccasions,
            fashionInspirations
        ];

        if (
            selectionFields.some(
                field => !Array.isArray(field) || field.length === 0
            )
        ) {
            return res.status(400).json({
                message: "Please select at least one option for each multiple-selection question"
            });
        }

        // Check special dislike option
        if (
            dislikedColorsPatterns.includes("No specific dislikes") &&
            dislikedColorsPatterns.length > 1
        ) {
            return res.status(400).json({
                message: "No specific dislikes cannot be selected with other options"
            });
        }

        // Check if profile already exists
        const existingProfile = await StyleProfile.findOne({
            userId: req.user.id
        });

        if (existingProfile) {
            return res.status(409).json({
                message: "Your style profile has already been completed"
            });
        }

        // Save profile to MongoDB
        const profile = await StyleProfile.create({
            userId: req.user.id,
            height,
            bodyShape,
            preferredStyles,
            favoriteColors,
            dislikedColorsPatterns,
            preferredClothingItems,
            preferredFits,
            comfortableOutfitType,
            preferredOccasions,
            fashionInspirations
        });

        return res.status(201).json({
            message: "Style profile created successfully",
            profile
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to create style profile",
            error: error.message
        });
    }
};


// GET USER STYLE PROFILE
export const getStyleProfile = async (req, res) => {
    try {
        const profile = await StyleProfile.findOne({
            userId: req.user.id
        });

        if (!profile) {
            return res.status(404).json({
                message: "Style profile not found"
            });
        }

        return res.status(200).json({
            message: "Style profile retrieved successfully",
            profile
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve style profile",
            error: error.message
        });
    }
};


// CHECK QUESTIONNAIRE COMPLETION STATUS
export const checkStyleProfileStatus = async (req, res) => {
    try {
        const profile = await StyleProfile.findOne({
            userId: req.user.id
        }).select("_id");

        return res.status(200).json({
            completed: !!profile
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to check style profile status",
            error: error.message
        });
    }
};
