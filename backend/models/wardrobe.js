
import mongoose from "mongoose";

const wardrobeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            enum: [
                "Tops",
                "Bottoms",
                "Dresses",
                "Outerwear",
                "Shoes",
                "Bags",
                "Accessories"
            ]
        },

        color: {
            type: String,
            default: "",
            trim: true
        },

        season: {
            type: String,
            default: "All Season"
        },

        occasion: {
            type: String,
            default: "Casual"
        },

        imageUrl: {
            type: String,
            required: true
        },

        imagePublicId: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const Wardrobe = mongoose.model("Wardrobe", wardrobeSchema);

export default Wardrobe;
