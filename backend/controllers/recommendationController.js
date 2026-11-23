import Wardrobe from "../models/wardrobe.js";
import StyleProfile from "../models/StyleProfile.js";
import User from "../models/user.js";
import { getWeatherByCoordinates, getWeatherByCity } from "../services/weatherService.js";
import { synthesizeWeatherRecommendations } from "../services/recommendationEngine.js";

/**
 * GET or POST /api/recommendations
 * Synthesizes intelligent geo-contextual outfit recommendations
 */
export const getRecommendations = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        // Extract parameters from query or body
        const lat = req.query.lat || req.body?.lat;
        const lon = req.query.lon || req.body?.lon;
        const city = req.query.city || req.body?.city;
        const occasion = req.query.occasion || req.body?.occasion || "All";
        let weatherContext = req.body?.weather || null;

        // 1. Fetch user wardrobe items
        const wardrobeItems = await Wardrobe.find({ userId }).sort({ createdAt: -1 });

        // 2. Fetch user style profile
        const styleProfile = await StyleProfile.findOne({ userId });

        // 3. Resolve weather context if not already supplied
        if (!weatherContext) {
            try {
                if (lat !== undefined && lon !== undefined && lat !== "" && lon !== "") {
                    const result = await getWeatherByCoordinates(lat, lon);
                    weatherContext = { ...result.weather, location: result.location };
                } else if (city && city.trim()) {
                    const result = await getWeatherByCity(city.trim());
                    weatherContext = { ...result.weather, location: result.location };
                } else {
                    // Check user's preferred location
                    const user = await User.findById(userId).select("preferredLocation");
                    if (user?.preferredLocation?.lat && user?.preferredLocation?.lon) {
                        const result = await getWeatherByCoordinates(
                            user.preferredLocation.lat,
                            user.preferredLocation.lon,
                            user.preferredLocation
                        );
                        weatherContext = { ...result.weather, location: result.location };
                    } else if (user?.preferredLocation?.name) {
                        const result = await getWeatherByCity(user.preferredLocation.name);
                        weatherContext = { ...result.weather, location: result.location };
                    } else {
                        // Fallback location
                        const result = await getWeatherByCity("Paris");
                        weatherContext = { ...result.weather, location: result.location };
                    }
                }
            } catch (weatherErr) {
                console.warn("Live weather retrieval failed in recommendations, applying resilient fallback context:", weatherErr.message);
                // Resilient fallback context ensuring recommendations never break
                weatherContext = {
                    temperature: 20,
                    feelsLike: 20,
                    condition: "Mild & Luminous",
                    conditionCategory: "clear",
                    thermalCategory: "mild",
                    description: "Pleasant seasonal conditions",
                    icon: "sun",
                    humidity: 50,
                    windSpeed: 10,
                    rainProbability: 10,
                    precipitation: 0,
                    location: { name: city || "Current Location", country: "" },
                    isFallback: true
                };
            }
        }

        // 4. Synthesize weather-aware recommendation capsules
        const capsules = synthesizeWeatherRecommendations(
            wardrobeItems,
            styleProfile,
            weatherContext,
            occasion
        );

        return res.status(200).json({
            success: true,
            weather: weatherContext,
            capsules,
            wardrobeCount: wardrobeItems.length,
            occasion
        });

    } catch (error) {
        console.error("Recommendations Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate outfit recommendations",
            error: error.message
        });
    }
};
