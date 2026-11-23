/**
 * Weather Service for OutfitMuse Geo-Contextual Smart Styling
 *
 * Integrates external Weather APIs:
 * 1. OpenWeatherMap (Primary when process.env.OPENWEATHER_API_KEY is configured)
 * 2. Open-Meteo (Automatic resilient fallback requiring no API key)
 *
 * Provides real-time environmental data:
 * - Current temperature & Feels-like temperature
 * - Weather condition & description
 * - Humidity (%) & Wind speed (km/h)
 * - Rain probability & Precipitation info
 * - Appropriate weather icon representations
 */

// Mapping Open-Meteo WMO weather codes to human descriptions and semantic categories
const WMO_CODE_MAP = {
    0: { condition: "Clear Sky", category: "clear", description: "Clear, radiant sky", icon: "sun" },
    1: { condition: "Mainly Clear", category: "clear", description: "Mainly clear with luminous light", icon: "sun" },
    2: { condition: "Partly Cloudy", category: "cloudy", description: "Partly cloudy with soft shadows", icon: "cloud-sun" },
    3: { condition: "Overcast", category: "cloudy", description: "Overcast with diffused light", icon: "cloud" },
    45: { condition: "Fog", category: "fog", description: "Misty and foggy atmosphere", icon: "cloud-fog" },
    48: { condition: "Depositing Rime Fog", category: "fog", description: "Dense chilly rime fog", icon: "cloud-fog" },
    51: { condition: "Light Drizzle", category: "rainy", description: "Delicate light drizzle", icon: "cloud-drizzle" },
    53: { condition: "Moderate Drizzle", category: "rainy", description: "Consistent soft drizzle", icon: "cloud-drizzle" },
    55: { condition: "Dense Drizzle", category: "rainy", description: "Dense damp drizzle", icon: "cloud-drizzle" },
    56: { condition: "Freezing Drizzle", category: "rainy", description: "Icy freezing drizzle", icon: "cloud-snow" },
    57: { condition: "Dense Freezing Drizzle", category: "rainy", description: "Heavy freezing drizzle", icon: "cloud-snow" },
    61: { condition: "Slight Rain", category: "rainy", description: "Gentle intermittent rain", icon: "cloud-rain" },
    63: { condition: "Moderate Rain", category: "rainy", description: "Steadily falling rain", icon: "cloud-rain" },
    65: { condition: "Heavy Rain", category: "rainy", description: "Heavy torrential rainfall", icon: "cloud-rain-heavy" },
    66: { condition: "Freezing Rain", category: "rainy", description: "Chilling freezing rain", icon: "cloud-snow" },
    67: { condition: "Heavy Freezing Rain", category: "rainy", description: "Heavy icy downpour", icon: "cloud-snow" },
    71: { condition: "Slight Snow Fall", category: "snowy", description: "Gentle falling snowflakes", icon: "snowflake" },
    73: { condition: "Moderate Snow Fall", category: "snowy", description: "Steadily gathering snow", icon: "snowflake" },
    75: { condition: "Heavy Snow Fall", category: "snowy", description: "Dense snowfall coverage", icon: "snowflake" },
    77: { condition: "Snow Grains", category: "snowy", description: "Crisp frozen snow grains", icon: "snowflake" },
    80: { condition: "Slight Rain Showers", category: "rainy", description: "Passing brief rain showers", icon: "cloud-rain" },
    81: { condition: "Moderate Rain Showers", category: "rainy", description: "Frequent passing showers", icon: "cloud-rain" },
    82: { condition: "Violent Rain Showers", category: "stormy", description: "Intense sudden rain downpours", icon: "cloud-lightning" },
    85: { condition: "Slight Snow Showers", category: "snowy", description: "Light flurries passing through", icon: "snowflake" },
    86: { condition: "Heavy Snow Showers", category: "snowy", description: "Brisk heavy snow flurries", icon: "snowflake" },
    95: { condition: "Thunderstorm", category: "stormy", description: "Electrifying thunderstorm with rumbles", icon: "cloud-lightning" },
    96: { condition: "Thunderstorm with Slight Hail", category: "stormy", description: "Thunderstorm with brisk hail", icon: "cloud-lightning" },
    99: { condition: "Thunderstorm with Heavy Hail", category: "stormy", description: "Severe thunderstorm with heavy hail", icon: "cloud-lightning" }
};

/**
 * Determine weather thermal category
 */
const getThermalCategory = (temp, feelsLike, conditionCat) => {
    const effectiveTemp = feelsLike !== undefined ? feelsLike : temp;
    if (conditionCat === "rainy" || conditionCat === "stormy") {
        return "rainy";
    }
    if (effectiveTemp >= 27) return "hot";
    if (effectiveTemp >= 21) return "warm";
    if (effectiveTemp >= 16) return "mild";
    if (effectiveTemp >= 9) return "cool";
    return "cold";
};

/**
 * Normalize OpenWeatherMap response
 */
const normalizeOpenWeatherData = (data, customName) => {
    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const humidity = data.main.humidity;
    const windSpeed = Math.round((data.wind?.speed || 0) * 3.6); // convert m/s to km/h
    const weatherObj = data.weather?.[0] || {};
    const mainCondition = weatherObj.main || "Clear";
    const description = weatherObj.description ? weatherObj.description.charAt(0).toUpperCase() + weatherObj.description.slice(1) : "Pleasant atmospheric conditions";
    const iconCode = weatherObj.icon || "01d";
    const rain1h = data.rain ? (data.rain["1h"] || 0) : 0;
    const rainProbability = rain1h > 0 ? Math.min(100, Math.round(rain1h * 30 + 50)) : (mainCondition.toLowerCase().includes("rain") ? 75 : 10);

    let category = "clear";
    let icon = "sun";
    const lower = mainCondition.toLowerCase();
    if (lower.includes("rain") || lower.includes("drizzle")) {
        category = "rainy";
        icon = "cloud-rain";
    } else if (lower.includes("thunder") || lower.includes("storm")) {
        category = "stormy";
        icon = "cloud-lightning";
    } else if (lower.includes("snow")) {
        category = "snowy";
        icon = "snowflake";
    } else if (lower.includes("cloud")) {
        category = "cloudy";
        icon = "cloud-sun";
    } else if (lower.includes("fog") || lower.includes("mist") || lower.includes("haze")) {
        category = "fog";
        icon = "cloud-fog";
    }

    const thermalCategory = getThermalCategory(temp, feelsLike, category);

    return {
        location: {
            name: customName || data.name || "Selected Location",
            country: data.sys?.country || "",
            lat: data.coord?.lat,
            lon: data.coord?.lon
        },
        weather: {
            temperature: temp,
            feelsLike,
            condition: mainCondition,
            conditionCategory: category,
            thermalCategory,
            description,
            icon,
            openWeatherIconCode: iconCode,
            humidity,
            windSpeed,
            rainProbability,
            precipitation: rain1h,
            isDay: iconCode.endsWith("d"),
            fetchedAt: new Date().toISOString()
        },
        source: "OpenWeatherMap"
    };
};

/**
 * Normalize Open-Meteo response
 */
const normalizeOpenMeteoData = (data, locationInfo) => {
    const current = data.current || {};
    const temp = Math.round(current.temperature_2m ?? 20);
    const feelsLike = Math.round(current.apparent_temperature ?? temp);
    const humidity = Math.round(current.relative_humidity_2m ?? 50);
    const windSpeed = Math.round(current.wind_speed_10m ?? 10);
    const precipitation = current.precipitation ?? current.rain ?? 0;
    const weatherCode = current.weather_code ?? 0;
    const wmo = WMO_CODE_MAP[weatherCode] || { condition: "Clear", category: "clear", description: "Luminous pleasant sky", icon: "sun" };

    // Hourly rain probability if available
    let rainProbability = precipitation > 0 ? 80 : 15;
    if (data.hourly && Array.isArray(data.hourly.precipitation_probability) && data.hourly.precipitation_probability.length > 0) {
        rainProbability = Math.round(data.hourly.precipitation_probability[0] ?? rainProbability);
    }

    const isDay = current.is_day !== undefined ? Boolean(current.is_day) : true;
    const thermalCategory = getThermalCategory(temp, feelsLike, wmo.category);

    return {
        location: {
            name: locationInfo?.name || "Selected Location",
            country: locationInfo?.country || "",
            admin1: locationInfo?.admin1 || "",
            lat: data.latitude,
            lon: data.longitude
        },
        weather: {
            temperature: temp,
            feelsLike,
            condition: wmo.condition,
            conditionCategory: wmo.category,
            thermalCategory,
            description: wmo.description,
            icon: wmo.icon,
            openWeatherIconCode: null,
            humidity,
            windSpeed,
            rainProbability,
            precipitation,
            isDay,
            fetchedAt: new Date().toISOString()
        },
        source: "Open-Meteo"
    };
};

/**
 * Fetch weather from OpenWeatherMap by coordinates
 */
const fetchFromOpenWeatherByCoords = async (lat, lon, apiKey, customName) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) {
        throw new Error(`OpenWeatherMap returned status ${res.status}`);
    }
    const data = await res.json();
    return normalizeOpenWeatherData(data, customName);
};

/**
 * Fetch weather from OpenWeatherMap by city name
 */
const fetchFromOpenWeatherByCity = async (city, apiKey) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) {
        throw new Error(`OpenWeatherMap returned status ${res.status}`);
    }
    const data = await res.json();
    return normalizeOpenWeatherData(data);
};

/**
 * Fetch weather from Open-Meteo by coordinates
 */
const fetchFromOpenMeteoByCoords = async (lat, lon, locationInfo) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m&hourly=precipitation_probability&timezone=auto`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) {
        throw new Error(`Open-Meteo returned status ${res.status}`);
    }
    const data = await res.json();
    return normalizeOpenMeteoData(data, locationInfo);
};

/**
 * Resolve city name to coordinates using Open-Meteo Geocoding
 */
export const geocodeCity = async (cityName) => {
    const trimmed = cityName?.trim();
    if (!trimmed) {
        throw new Error("City name is required for geocoding");
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;

    // Try OpenWeatherMap Geocoding if API key exists
    if (apiKey) {
        try {
            const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(trimmed)}&limit=1&appid=${apiKey}`;
            const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
            if (res.ok) {
                const results = await res.json();
                if (Array.isArray(results) && results.length > 0) {
                    return {
                        name: results[0].name,
                        country: results[0].country,
                        state: results[0].state || "",
                        lat: results[0].lat,
                        lon: results[0].lon
                    };
                }
            }
        } catch (err) {
            console.warn("OpenWeatherMap geocoding failed, falling back to Open-Meteo:", err.message);
        }
    }

    // Fallback: Open-Meteo Geocoding
    const omUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=1&language=en&format=json`;
    const omRes = await fetch(omUrl, { signal: AbortSignal.timeout(5000) });
    if (!omRes.ok) {
        throw new Error(`Geocoding search failed with status ${omRes.status}`);
    }
    const omData = await omRes.json();
    if (!omData.results || omData.results.length === 0) {
        throw new Error(`Location "${trimmed}" was not found`);
    }

    const top = omData.results[0];
    return {
        name: top.name,
        country: top.country_code || top.country || "",
        admin1: top.admin1 || "",
        lat: top.latitude,
        lon: top.longitude
    };
};

/**
 * Search locations for autocomplete
 */
export const searchLocations = async (query) => {
    const trimmed = query?.trim();
    if (!trimmed || trimmed.length < 2) {
        return [];
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;

    // Try OpenWeatherMap Geocoding if API key is present
    if (apiKey) {
        try {
            const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(trimmed)}&limit=6&appid=${apiKey}`;
            const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
            if (res.ok) {
                const list = await res.json();
                if (Array.isArray(list) && list.length > 0) {
                    return list.map((item) => ({
                        id: `${item.lat}_${item.lon}`,
                        name: item.name,
                        state: item.state || "",
                        country: item.country || "",
                        lat: item.lat,
                        lon: item.lon,
                        displayName: `${item.name}${item.state ? `, ${item.state}` : ""}${item.country ? `, ${item.country}` : ""}`
                    }));
                }
            }
        } catch (err) {
            console.warn("OpenWeather search fallback triggered:", err.message);
        }
    }

    // Use Open-Meteo Geocoding API
    const omUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=6&language=en&format=json`;
    const res = await fetch(omUrl, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) {
        throw new Error(`Geocoding failed: ${res.statusText}`);
    }
    const data = await res.json();
    if (!data.results) return [];

    return data.results.map((item) => ({
        id: item.id || `${item.latitude}_${item.longitude}`,
        name: item.name,
        state: item.admin1 || "",
        country: item.country || item.country_code || "",
        lat: item.latitude,
        lon: item.longitude,
        displayName: `${item.name}${item.admin1 ? `, ${item.admin1}` : ""}${item.country ? `, ${item.country}` : ""}`
    }));
};

/**
 * Get weather by coordinates
 */
export const getWeatherByCoordinates = async (lat, lon, customLocationInfo = null) => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
        throw new Error("Invalid latitude or longitude coordinates provided");
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;

    // 1. Try OpenWeatherMap if key is configured
    if (apiKey) {
        try {
            return await fetchFromOpenWeatherByCoords(latitude, longitude, apiKey, customLocationInfo?.name);
        } catch (err) {
            console.warn("OpenWeatherMap fetch failed, falling back to Open-Meteo:", err.message);
        }
    }

    // 2. Open-Meteo fallback
    return await fetchFromOpenMeteoByCoords(latitude, longitude, customLocationInfo);
};

/**
 * Get weather by city name
 */
export const getWeatherByCity = async (cityName) => {
    const trimmed = cityName?.trim();
    if (!trimmed) {
        throw new Error("City name is required");
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;

    // 1. Try OpenWeatherMap direct city lookup
    if (apiKey) {
        try {
            return await fetchFromOpenWeatherByCity(trimmed, apiKey);
        } catch (err) {
            console.warn("OpenWeatherMap city lookup failed, trying geocoding + Open-Meteo:", err.message);
        }
    }

    // 2. Geocode city and fetch with Open-Meteo
    const coords = await geocodeCity(trimmed);
    return await fetchFromOpenMeteoByCoords(coords.lat, coords.lon, coords);
};
