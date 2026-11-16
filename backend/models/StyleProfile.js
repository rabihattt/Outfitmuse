
import mongoose from "mongoose";

const styleProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        height: {
            type: String,
            required: true,
            trim: true
        },

        bodyShape: {
            type: String,
            enum: [
                "Hourglass",
                "Pear / Triangle",
                "Apple / Oval",
                "Rectangle",
                "Inverted Triangle",
                "Not sure"
            ],
            required: true
        },

        preferredStyles: [{
            type: String,
            enum: [
                "Casual",
                "Minimalist",
                "Elegant / Chic",
                "Streetwear",
                "Vintage",
                "Old Money",
                "Bohemian",
                "Traditional"
            ]
        }],

        favoriteColors: [{
            type: String,
            enum: [
                "Pastel colors",
                "Neutral colors",
                "Earthy tones",
                "Bright / Vibrant colors",
                "Dark colors",
                "Monochrome"
            ]
        }],

        dislikedColorsPatterns: [{
            type: String,
            enum: [
                "Neon colors",
                "Bright colors",
                "Dark colors",
                "Floral prints",
                "Stripes / Checks",
                "Bold patterns",
                "No specific dislikes"
            ]
        }],

        preferredClothingItems: [{
            type: String,
            enum: [
                "T-shirts",
                "Shirts",
                "Tops",
                "Kurtis",
                "Dresses",
                "Jeans",
                "Trousers",
                "Skirts",
                "Sarees",
                "Salwar Kameez"
            ]
        }],

        preferredFits: [{
            type: String,
            enum: [
                "Oversized",
                "Relaxed fit",
                "Regular fit",
                "Slim fit",
                "Body fit"
            ]
        }],

        comfortableOutfitType: {
            type: String,
            enum: [
                "Simple and comfortable",
                "Trendy and fashionable",
                "Elegant and sophisticated",
                "Bold and experimental",
                "Modest and traditional"
            ],
            required: true
        },

        preferredOccasions: [{
            type: String,
            enum: [
                "University",
                "Office",
                "Casual outing",
                "Party",
                "Wedding",
                "Formal events",
                "Travel"
            ]
        }],

        fashionInspirations: [{
            type: String,
            enum: [
                "Pinterest / Fashion moodboards",
                "Instagram fashion trends",
                "Celebrities / Influencers",
                "Movies / TV show characters",
                "Korean fashion / K-fashion",
                "Traditional cultural fashion",
                "Personal creativity",
                "Seasonal fashion trends"
            ]
        }]
    },
    {
        timestamps: true
    }
);

const StyleProfile = mongoose.model(
    "StyleProfile",
    styleProfileSchema
);

export default StyleProfile;
