
import Wardrobe from "../models/wardrobe.js";
import cloudinary from "../config/cloudinary.js";

// Helper: Upload image to Cloudinary
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "outfitmuse/wardrobe",
                resource_type: "image"
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        stream.end(buffer);
    });
};

// Helper: Get authenticated user ID
const getUserId = (req) => {
    return req.user?.id || req.user?._id || req.userId;
};

// 1. ADD CLOTHING ITEM
export const addWardrobeItem = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                message: "User authentication required"
            });
        }

        const { name, category, color, season, occasion } = req.body;

        if (!name || !category || !req.file) {
            return res.status(400).json({
                message: "Name, category and image are required"
            });
        }

        // Check Cloudinary configuration
        if (
            !process.env.CLOUDINARY_CLOUD_NAME ||
            !process.env.CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET
        ) {
            return res.status(500).json({
                message: "Cloudinary configuration is missing"
            });
        }

        // Upload image
        const image = await uploadToCloudinary(req.file.buffer);

        // Save item in MongoDB
        const wardrobeItem = await Wardrobe.create({
            userId,
            name,
            category,
            color,
            season,
            occasion,
            imageUrl: image.secure_url,
            imagePublicId: image.public_id
        });

        return res.status(201).json({
            message: "Clothing item uploaded successfully",
            item: wardrobeItem
        });

    } catch (error) {
        console.error("Wardrobe Upload Error:", error);

        return res.status(500).json({
            message: "Failed to upload clothing item",
            error: error.message
        });
    }
};

// 2. GET USER'S WARDROBE
export const getWardrobeItems = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                message: "User authentication required"
            });
        }

        const items = await Wardrobe.find({ userId })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Wardrobe items fetched successfully",
            items
        });

    } catch (error) {
        console.error("Get Wardrobe Error:", error);

        return res.status(500).json({
            message: "Failed to fetch wardrobe items",
            error: error.message
        });
    }
};

// 3. UPDATE CLOTHING ITEM
export const updateWardrobeItem = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                message: "User authentication required"
            });
        }

        const item = await Wardrobe.findOne({
            _id: req.params.id,
            userId
        });

        if (!item) {
            return res.status(404).json({
                message: "Wardrobe item not found"
            });
        }

        const { name, category, color, season, occasion } = req.body;

        if (name !== undefined) item.name = name;
        if (category !== undefined) item.category = category;
        if (color !== undefined) item.color = color;
        if (season !== undefined) item.season = season;
        if (occasion !== undefined) item.occasion = occasion;

        if (req.file) {
            const image = await uploadToCloudinary(req.file.buffer);

            if (item.imagePublicId) {
                await cloudinary.uploader.destroy(item.imagePublicId);
            }

            item.imageUrl = image.secure_url;
            item.imagePublicId = image.public_id;
        }

        await item.save();

        return res.status(200).json({
            message: "Wardrobe item updated successfully",
            item
        });

    } catch (error) {
        console.error("Update Wardrobe Error:", error);

        return res.status(500).json({
            message: "Failed to update wardrobe item",
            error: error.message
        });
    }
};

// 4. DELETE CLOTHING ITEM
export const deleteWardrobeItem = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                message: "User authentication required"
            });
        }

        const item = await Wardrobe.findOne({
            _id: req.params.id,
            userId
        });

        if (!item) {
            return res.status(404).json({
                message: "Wardrobe item not found"
            });
        }

        if (item.imagePublicId) {
            await cloudinary.uploader.destroy(item.imagePublicId);
        }

        await item.deleteOne();

        return res.status(200).json({
            message: "Wardrobe item deleted successfully"
        });

    } catch (error) {
        console.error("Delete Wardrobe Error:", error);

        return res.status(500).json({
            message: "Failed to delete wardrobe item",
            error: error.message
        });
    }
};
