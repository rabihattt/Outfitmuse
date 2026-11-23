import User from "../models/user.js";
import {
    getWeatherByCoordinates,
    getWeatherByCity,
    searchLocations
} from "../services/weatherService.js";

/**
 * GET /api/weather/current
 * Fetch current real-time weather by (lat, lon) or city name
 */
export const getCurrentWeather = async (req, res) => {
    try {
        const { lat, lon, city } = req.query;

        let weatherData = null;

        if (lat !== undefined && lon !== undefined && lat !== "" && lon !== "") {
            weatherData = await getWeatherByCoordinates(lat, lon);
        } else if (city && city.trim()) {
            weatherData = await getWeatherByCity(city.trim());
        } else if (req.user?.id) {
            // Check if user has saved preferred location
            const user = await User.findById(req.user.id).select("preferredLocation");
            if (user?.preferredLocation?.lat && user?.preferredLocation?.lon) {
                weatherData = await getWeatherByCoordinates(
                    user.preferredLocation.lat,
                    user.preferredLocation.lon,
                    user.preferredLocation
                );
            } else if (user?.preferredLocation?.name) {
                weatherData = await getWeatherByCity(user.preferredLocation.name);
            }
        }

        // Default fallback city if no location specified
        if (!weatherData) {
            weatherData = await getWeatherByCity("Paris");
        }

        return res.status(200).json({
            success: true,
            data: weatherData
        });
    } catch (error) {
        console.error("Weather Controller Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Unable to retrieve real-time weather information",
            error: error.message
        });
    }
};

/**
 * GET /api/weather/search
 * Autocomplete / search locations by name
 */
export const searchCities = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query || query.trim().length < 2) {
            return res.status(200).json({
                success: true,
                results: []
            });
        }

        const results = await searchLocations(query.trim());
        return res.status(200).json({
            success: true,
            results
        });
    } catch (error) {
        console.error("Location Search Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Location search failed",
            error: error.message
        });
    }
};

/**
 * POST /api/weather/user-location
 * Save user's selected location to profile
 */
export const saveUserLocation = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const { name, lat, lon, country } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Location name is required"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                preferredLocation: {
                    name,
                    lat: lat !== undefined ? Number(lat) : null,
                    lon: lon !== undefined ? Number(lon) : null,
                    country: country || ""
                }
            },
            { new: true }
        ).select("preferredLocation");

        return res.status(200).json({
            success: true,
            message: "Preferred location saved successfully",
            preferredLocation: updatedUser.preferredLocation
        });
    } catch (error) {
        console.error("Save Location Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to save preferred location",
            error: error.message
        });
    }
};

/**
 * GET /api/weather/user-location
 * Get user's saved location
 */
export const getUserLocation = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const user = await User.findById(userId).select("preferredLocation");
        return res.status(200).json({
            success: true,
            preferredLocation: user?.preferredLocation || null
        });
    } catch (error) {
        console.error("Get Location Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve preferred location",
            error: error.message
        });
    }
};
