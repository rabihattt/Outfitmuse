/**
 * Geo-Contextual Smart Styling Recommendation Engine for OutfitMuse
 *
 * Synthesizes intelligent, weather-aware outfit capsules by evaluating:
 * 1. User Wardrobe Items (only items the user owns)
 * 2. User Style Profile (body shape, preferred styles, favorite colors, disliked colors, preferred fits)
 * 3. Real-Time Atmospheric Conditions:
 *    - Actual Temperature & Feels-Like Temperature
 *    - Weather condition (clear, cloudy, rainy, stormy, snowy, etc.)
 *    - Relative Humidity (%)
 *    - Wind Speed (km/h)
 *    - Rain probability / Precipitation
 * 4. Selected Occasion (Casual, Office, Weekend, Formal, Party, etc.)
 *
 * Computes contextual match scores and generates concise, understandable,
 * weather-grounded editorial explanations.
 */

/**
 * Determine thermal classification based on effective temperature
 */
const getThermalBand = (temperature, feelsLike) => {
    const temp = feelsLike !== undefined ? feelsLike : temperature;
    if (temp >= 26) return "hot";
    if (temp >= 20) return "warm";
    if (temp >= 15) return "mild";
    if (temp >= 9) return "cool";
    return "cold";
};

/**
 * Assess rain/wet precipitation state
 */
const isPrecipitating = (weather) => {
    if (!weather) return false;
    const cat = (weather.conditionCategory || "").toLowerCase();
    const cond = (weather.condition || "").toLowerCase();
    const prob = weather.rainProbability || 0;
    const precip = weather.precipitation || 0;

    return (
        cat === "rainy" ||
        cat === "stormy" ||
        cond.includes("rain") ||
        cond.includes("drizzle") ||
        cond.includes("shower") ||
        cond.includes("thunder") ||
        prob >= 50 ||
        precip > 0.3
    );
};

/**
 * Score an individual garment piece for current weather context
 */
const evaluateGarmentWeatherFit = (item, weather, thermalBand, raining) => {
    let score = 70; // baseline
    const name = (item.name || "").toLowerCase();
    const cat = item.category || "";
    const season = (item.season || "All Season").toLowerCase();
    const color = (item.color || "").toLowerCase();

    // 1. Season Alignment
    if (season === "all season") {
        score += 8;
    } else if (thermalBand === "hot" && season === "summer") {
        score += 18;
    } else if (thermalBand === "warm" && (season === "summer" || season === "spring")) {
        score += 15;
    } else if (thermalBand === "mild" && (season === "spring" || season === "autumn")) {
        score += 15;
    } else if (thermalBand === "cool" && (season === "autumn" || season === "winter")) {
        score += 18;
    } else if (thermalBand === "cold" && season === "winter") {
        score += 20;
    } else if (thermalBand === "hot" && season === "winter") {
        score -= 25; // Heavily penalize winter pieces in hot weather
    } else if (thermalBand === "cold" && season === "summer") {
        score -= 25; // Heavily penalize summer pieces in freezing weather
    }

    // 2. Garment Category & Keywords vs Thermal Band
    const isHeavyKeywords = ["wool", "puffer", "heavy", "fleece", "knit", "sweater", "trench", "coat", "parka", "thermal", "turtleneck"];
    const isLightKeywords = ["linen", "cotton", "breezy", "silk", "sleeveless", "crop", "short", "camisole", "t-shirt", "tee"];
    const isWaterResistantKeywords = ["trench", "leather", "rain", "boot", "waterproof", "nylon", "jacket"];

    const hasHeavy = isHeavyKeywords.some((kw) => name.includes(kw));
    const hasLight = isLightKeywords.some((kw) => name.includes(kw));
    const hasWaterResistant = isWaterResistantKeywords.some((kw) => name.includes(kw));

    if (thermalBand === "hot") {
        if (cat === "Outerwear") {
            score -= 30; // Outerwear discouraged in high heat
        }
        if (hasLight) score += 12;
        if (hasHeavy) score -= 25;
        // Light colors reflect sunlight
        if (["white", "cream", "beige", "ivory", "pastel", "light"].some((c) => color.includes(c))) {
            score += 6;
        }
    } else if (thermalBand === "warm") {
        if (cat === "Outerwear") score -= 10;
        if (hasLight) score += 8;
        if (hasHeavy) score -= 15;
    } else if (thermalBand === "cool") {
        if (cat === "Outerwear") score += 20; // Outerwear prioritized for cooling
        if (hasHeavy) score += 12;
        if (hasLight && cat !== "Tops") score -= 10;
    } else if (thermalBand === "cold") {
        if (cat === "Outerwear") score += 25; // Layering indispensable
        if (hasHeavy) score += 20;
        if (hasLight && !name.includes("tee")) score -= 20;
    }

    // 3. Rain & Wet Conditions
    if (raining) {
        if (cat === "Outerwear" && hasWaterResistant) {
            score += 25;
        }
        if (cat === "Shoes") {
            if (name.includes("sandal") || name.includes("canvas") || name.includes("open") || name.includes("flip")) {
                score -= 35; // Strongly penalize open/canvas shoes in rain
            } else if (name.includes("boot") || name.includes("leather") || name.includes("oxford") || name.includes("sneaker")) {
                score += 22; // Reward protective footwear
            }
        }
        // Avoid delicate fabrics in rain
        if (name.includes("silk") || name.includes("suede") || color.includes("white")) {
            score -= 10;
        }
    }

    // 4. Humidity (> 70%)
    if (weather?.humidity >= 70 && thermalBand !== "cold") {
        if (hasLight || name.includes("loose") || name.includes("relaxed") || cat === "Tops") {
            score += 8;
        }
        if (hasHeavy) score -= 12;
    }

    // 5. Wind Speed (> 20 km/h)
    if (weather?.windSpeed >= 20) {
        if (cat === "Outerwear") score += 12;
        if (cat === "Dresses" && name.includes("mini")) score -= 8;
    }

    return Math.max(10, Math.min(100, score));
};

/**
 * Score outfit against User Style Profile
 */
const evaluateStyleProfileMatch = (items, profile, occasion) => {
    let score = 85; // baseline style affinity
    if (!profile) return score;

    const favoriteColors = (profile.favoriteColors || []).map((c) => c.toLowerCase());
    const dislikedPatterns = (profile.dislikedColorsPatterns || []).map((d) => d.toLowerCase());
    const preferredOccasions = (profile.preferredOccasions || []).map((o) => o.toLowerCase());

    for (const item of items) {
        const itemColor = (item.color || "").toLowerCase();
        const itemOccasion = (item.occasion || "").toLowerCase();

        // Color preference alignment
        if (favoriteColors.some((fc) => itemColor.includes(fc) || fc.includes(itemColor))) {
            score += 3;
        }
        if (dislikedPatterns.some((dp) => itemColor.includes(dp) || (item.name || "").toLowerCase().includes(dp))) {
            score -= 8;
        }

        // Occasion match
        if (occasion && occasion.toLowerCase() !== "all" && itemOccasion === occasion.toLowerCase()) {
            score += 5;
        } else if (preferredOccasions.some((po) => po.includes(itemOccasion))) {
            score += 2;
        }
    }

    return Math.max(70, Math.min(99, score));
};

/**
 * Generate a dynamic, contextual explanation for an outfit
 */
const generateWeatherExplanation = (items, weather, thermalBand, raining, occasion) => {
    const temp = weather ? Math.round(weather.temperature) : 22;
    const feelsLike = weather ? Math.round(weather.feelsLike ?? temp) : temp;
    const cond = weather?.condition || "Mild";
    const wind = weather?.windSpeed || 0;
    const humidity = weather?.humidity || 50;

    const hasOuterwear = items.some((i) => i.category === "Outerwear");
    const outerwearItem = items.find((i) => i.category === "Outerwear");
    const topItem = items.find((i) => i.category === "Tops");
    const bottomItem = items.find((i) => i.category === "Bottoms");
    const dressItem = items.find((i) => i.category === "Dresses");
    const shoeItem = items.find((i) => i.category === "Shoes");

    const cityName = weather?.location?.name || "your location";

    // 1. Rainy Conditions
    if (raining) {
        if (hasOuterwear && shoeItem) {
            return `Curated for wet, rainy weather in ${cityName} (${temp}°C with precipitation). The ${outerwearItem.name} provides weather protection, while ${shoeItem.name} keeps footwear shielded from damp ground.`;
        }
        if (hasOuterwear) {
            return `Optimized for rainy atmospheric conditions in ${cityName}. The ${outerwearItem.name} shields against moisture while preserving a streamlined, comfortable aesthetic.`;
        }
        if (shoeItem) {
            return `Suitable for wet conditions at ${temp}°C. Paired with ${shoeItem.name} to prioritize practical footing and avoid delicate fabrics.`;
        }
        return `Recommended for wet, rainy conditions in ${cityName}. Prioritizes functional garments that resist humidity and moisture.`;
    }

    // 2. High Temperature (Hot)
    if (thermalBand === "hot") {
        if (dressItem) {
            return `Ideal for today's high heat of ${temp}°C (feels like ${feelsLike}°C). The ${dressItem.name} provides effortless single-piece airflow and breathability in the sun.`;
        }
        if (topItem && bottomItem) {
            return `Engineered for warm ${temp}°C temperatures. The ${topItem.name} combined with ${bottomItem.name} promotes maximum ventilation and lightweight ease.`;
        }
        if (humidity >= 65) {
            return `Recommended for high humidity (${humidity}%) and ${temp}°C warmth. Prioritizes lightweight, unrestrictive fabrics for all-day comfort.`;
        }
        return `Recommended because this lightweight combination is suitable for today's ${temp}°C heat, ensuring breathability without sacrificing style.`;
    }

    // 3. Warm / Mild
    if (thermalBand === "warm" || thermalBand === "mild") {
        if (hasOuterwear) {
            return `Tailored for comfortable ${temp}°C conditions with soft breezes. The ${outerwearItem.name} offers versatile transitional layering over ${topItem ? topItem.name : "your foundation piece"}.`;
        }
        if (dressItem) {
            return `Flourishes in today's pleasant ${temp}°C ${cond.toLowerCase()} weather, creating a balanced and luminous silhouette.`;
        }
        if (topItem && bottomItem) {
            return `Balanced for today's ${temp}°C ambient temperature. The ${topItem.name} and ${bottomItem.name} harmony delivers versatile day-to-evening poise.`;
        }
        return `Recommended for pleasant ${temp}°C weather in ${cityName}. Clean proportions suited for ${occasion || "everyday"} movement.`;
    }

    // 4. Cool Temperature
    if (thermalBand === "cool") {
        if (hasOuterwear) {
            return `Layering is recommended because the current temperature is a cool ${temp}°C (feels like ${feelsLike}°C). The ${outerwearItem.name} adds tailored thermal warmth over your foundation.`;
        }
        if (topItem && bottomItem) {
            return `Structured for brisk ${temp}°C weather. Full coverage through ${bottomItem.name} and comfortable layering keeps you insulated against cool breezes.`;
        }
        return `Layering is recommended for today's relatively cool ${temp}°C climate, ensuring refined warmth with structured lines.`;
    }

    // 5. Cold Temperature
    if (thermalBand === "cold") {
        if (hasOuterwear) {
            return `Engineered for cold ${temp}°C chills in ${cityName}. The ${outerwearItem.name} delivers essential insulation, preserving comfort and tailored elegance.`;
        }
        return `Prioritizes thermal warmth for today's crisp ${temp}°C conditions, emphasizing insulating garments suited for low temperatures.`;
    }

    // 6. Strong Wind
    if (wind >= 25) {
        return `Recommended because strong winds (${wind} km/h) are present today. Structured pieces provide wind resistance and dependable silhouette composure.`;
    }

    return `Curated for current ${temp}°C conditions in ${cityName}, harmonizing climate suitability with your aesthetic preferences.`;
};

/**
 * Generate fallback inspiration capsules when user wardrobe has few items
 */
const generateInspirationCapsules = (weather, thermalBand, raining, occasion) => {
    const temp = weather ? Math.round(weather.temperature) : 21;
    const cond = weather?.condition || "Clear";

    if (thermalBand === "hot") {
        return [
            {
                id: "weather-insp-1",
                title: "Breezy Linen & Neutral Chino Capsule",
                occasion: "Casual",
                matchScore: 97,
                isPreview: true,
                weatherSuitability: `Optimal for ${temp}°C Summer Heat`,
                weatherBadges: ["High Breathability", "Lightweight Fabric", "UV Friendly"],
                description: `A relaxed, airy ensemble configured specifically for today's ${temp}°C heat. Open weave cotton-linen keeps body temperature regulated.`,
                weatherExplanation: `Recommended because this lightweight, breathable outfit is suitable for today's ${temp}°C temperature in ${weather?.location?.name || "your city"}.`,
                stylingNotes: "Pair with leather woven slides and tortoiseshell eyewear for effortless Mediterranean flair.",
                itemsPlaceholder: [
                    { name: "Raw Linen Button-Down", category: "Tops", color: "Ivory" },
                    { name: "Wide-Leg Linen Trousers", category: "Bottoms", color: "Oatmeal" },
                    { name: "Woven Leather Slides", category: "Shoes", color: "Tan" }
                ]
            },
            {
                id: "weather-insp-2",
                title: "Sun-Luminous Silk Slip & Minimalist Slide",
                occasion: "Weekend",
                matchScore: 94,
                isPreview: true,
                weatherSuitability: `Airy Comfort at ${temp}°C`,
                weatherBadges: ["Zero-Constriction", "Sun Radiant", "Fluid Motion"],
                description: `Single-silhouette radiance capturing luminous natural light without trapped warmth.`,
                weatherExplanation: `Selected to maximize ventilation during high ${temp}°C temperatures, preventing perspiration discomfort.`,
                stylingNotes: "Add a structured straw basket bag to ground the fluid drape with organic texture.",
                itemsPlaceholder: [
                    { name: "Silk Crepe Midi Slip", category: "Dresses", color: "Champagne" },
                    { name: "Minimalist Strappy Flat", category: "Shoes", color: "Alabaster" }
                ]
            }
        ];
    }

    if (raining) {
        return [
            {
                id: "weather-insp-1",
                title: "Storm-Resistant Structured Trench Silhouette",
                occasion: "Office",
                matchScore: 98,
                isPreview: true,
                weatherSuitability: `Rain-Shielding Capsule (${temp}°C)`,
                weatherBadges: ["Water Repellent", "Sturdy Footwear", "Storm Poise"],
                description: `Architectural weather protection. A double-breasted cotton-gabardine trench shields against rainfall while maintaining high sartorial poise.`,
                weatherExplanation: `This combination is suitable for rainy weather (${temp}°C) and prioritizes footwear and outerwear appropriate for wet conditions.`,
                stylingNotes: "Fasten the belt slightly off-center to cinch the waist without buttoning fully.",
                itemsPlaceholder: [
                    { name: "Water-Repellent Double Trench", category: "Outerwear", color: "Camel" },
                    { name: "High-Rise Cropped Trouser", category: "Bottoms", color: "Charcoal" },
                    { name: "Polished Leather Chelsea Boot", category: "Shoes", color: "Black" }
                ]
            },
            {
                id: "weather-insp-2",
                title: "Urban Commute Weather Defense",
                occasion: "Casual",
                matchScore: 95,
                isPreview: true,
                weatherSuitability: "Drizzle & Moisture Proof",
                weatherBadges: ["Closed Footwear", "Dark Hems", "Compact Layering"],
                description: `Practical refinement for damp streets. Darker hemline prevents splash marks while closed leather protects feet.`,
                weatherExplanation: `Engineered for rainy streets, pairing water-resistant footwear with protected foundation layers.`,
                stylingNotes: "Carry a tonal compact umbrella to complement the monochrome palette.",
                itemsPlaceholder: [
                    { name: "Structured Windbreaker Parka", category: "Outerwear", color: "Olive" },
                    { name: "Dark Indigo Straight Denim", category: "Bottoms", color: "Indigo" },
                    { name: "Treated Leather Derby Shoes", category: "Shoes", color: "Burgundy" }
                ]
            }
        ];
    }

    if (thermalBand === "cool" || thermalBand === "cold") {
        return [
            {
                id: "weather-insp-1",
                title: "Architectural Wool Overcoat & Cashmere Layer",
                occasion: "Casual",
                matchScore: 98,
                isPreview: true,
                weatherSuitability: `Layered Thermal Harmony (${temp}°C)`,
                weatherBadges: ["Thermal Insulation", "Layered Depth", "Wind Barrier"],
                description: `Luxurious multi-layer warmth. Pairs high-gauge cashmere with structured tailoring to shield against brisk breezes.`,
                weatherExplanation: `Layering is recommended because the current temperature is relatively cool (${temp}°C) in ${weather?.location?.name || "your area"}.`,
                stylingNotes: "Allow the collar of the inner knit to peek above the lapel for deliberate tonal contrast.",
                itemsPlaceholder: [
                    { name: "Tailored Wool Overcoat", category: "Outerwear", color: "Plum" },
                    { name: "Ribbed Cashmere Mock-Neck", category: "Tops", color: "Cream" },
                    { name: "Pleated Flannel Trousers", category: "Bottoms", color: "Charcoal" }
                ]
            },
            {
                id: "weather-insp-2",
                title: "Urban Tailored Blazer & Structured Denim",
                occasion: "Office",
                matchScore: 95,
                isPreview: true,
                weatherSuitability: `Chilly Weather Poise (${temp}°C)`,
                weatherBadges: ["Structured Outerwear", "All-Day Warmth", "Office Ready"],
                description: `Sophisticated professional layering balancing interior climate control with outdoor wind defense.`,
                weatherExplanation: `The structured blazer provides comfortable insulation against cool outdoor temperatures while staying sharp indoors.`,
                stylingNotes: "Drape the blazer over the shoulders when entering heated rooms.",
                itemsPlaceholder: [
                    { name: "Oversized Double Blazer", category: "Outerwear", color: "Houndstooth" },
                    { name: "Fine Merino Crew Knit", category: "Tops", color: "Forest Green" },
                    { name: "Almond Leather Ankle Boots", category: "Shoes", color: "Espresso" }
                ]
            }
        ];
    }

    // Default Mild
    return [
        {
            id: "weather-insp-1",
            title: "Quiet Luxury Linen & Tailored Trousers",
            occasion: "Casual",
            matchScore: 97,
            isPreview: true,
            weatherSuitability: `Balanced Climate Pairing (${temp}°C)`,
            weatherBadges: ["Transitional Layer", "Breathable", "Harmonious"],
            description: `A signature pairing of relaxed proportions in neutral ivory and warm champagne, optimal for mild skies.`,
            weatherExplanation: `Suitable for today's mild ${temp}°C conditions, offering fluid movement and easy comfort.`,
            stylingNotes: "French tuck the shirt to accentuate waistline structure.",
            itemsPlaceholder: [
                { name: "Silk-Cotton Poplin Shirt", category: "Tops", color: "Ivory" },
                { name: "Wide-Leg Pleated Trousers", category: "Bottoms", color: "Champagne" },
                { name: "Leather Penny Loafers", category: "Shoes", color: "Cognac" }
            ]
        },
        {
            id: "weather-insp-2",
            title: "Architectural Trench & Clean Foundation",
            occasion: "Office",
            matchScore: 94,
            isPreview: true,
            weatherSuitability: `Transitional Poise (${temp}°C)`,
            weatherBadges: ["Versatile Flow", "Tailored Profile", "Day-to-Evening"],
            description: `Elevated layering structured for professional presence and weather versatility.`,
            weatherExplanation: `A lightweight trench provides balanced protection during mild ${temp}°C atmospheric shifts.`,
            stylingNotes: "Button middle only to create an elegant vertical silhouette line.",
            itemsPlaceholder: [
                { name: "Draped Transitional Duster", category: "Outerwear", color: "Sage" },
                { name: "High-Rise Tailored Pant", category: "Bottoms", color: "Charcoal" }
            ]
        }
    ];
};

/**
 * Synthesize Weather-Aware Outfit Recommendations from User's Wardrobe
 *
 * @param {Array} wardrobeItems - User's uploaded wardrobe items
 * @param {Object} styleProfile - User's saved style profile
 * @param {Object} weatherContext - Real-time weather data
 * @param {String} occasionFilter - Optional occasion filter ("All", "Casual", "Office", etc.)
 * @returns {Array} List of ranked recommendation capsules with weather explanations
 */
export const synthesizeWeatherRecommendations = (
    wardrobeItems = [],
    styleProfile = null,
    weatherContext = null,
    occasionFilter = "All"
) => {
    const temp = weatherContext ? weatherContext.temperature : 22;
    const feelsLike = weatherContext ? (weatherContext.feelsLike ?? temp) : temp;
    const thermalBand = getThermalBand(temp, feelsLike);
    const raining = isPrecipitating(weatherContext);

    // Group wardrobe by category
    const tops = wardrobeItems.filter((i) => i.category === "Tops");
    const bottoms = wardrobeItems.filter((i) => i.category === "Bottoms");
    const dresses = wardrobeItems.filter((i) => i.category === "Dresses");
    const outerwear = wardrobeItems.filter((i) => i.category === "Outerwear");
    const shoes = wardrobeItems.filter((i) => i.category === "Shoes");
    const bags = wardrobeItems.filter((i) => i.category === "Bags");
    const accessories = wardrobeItems.filter((i) => i.category === "Accessories");

    // Sort items inside categories by weather appropriateness and occasion
    const rankItems = (items) => {
        return [...items].sort((a, b) => {
            let scoreA = evaluateGarmentWeatherFit(a, weatherContext, thermalBand, raining);
            let scoreB = evaluateGarmentWeatherFit(b, weatherContext, thermalBand, raining);

            if (occasionFilter && occasionFilter.toLowerCase() !== "all") {
                const targetOcc = occasionFilter.toLowerCase();
                const matchA = (a.occasion || "").toLowerCase() === targetOcc;
                const matchB = (b.occasion || "").toLowerCase() === targetOcc;
                if (matchA && !matchB) scoreA += 40;
                if (!matchA && matchB) scoreB += 40;
            }

            return scoreB - scoreA;
        });
    };

    const rankedTops = rankItems(tops);
    const rankedBottoms = rankItems(bottoms);
    const rankedDresses = rankItems(dresses);
    const rankedOuterwear = rankItems(outerwear);
    const rankedShoes = rankItems(shoes);
    const rankedAccessories = rankItems([...accessories, ...bags]);

    const capsules = [];

    // Weather badge helper
    const getWeatherBadges = (thermal, isRain) => {
        const badges = [];
        if (isRain) {
            badges.push("Rain-Appropriate", "Moisture Shield");
        } else if (thermal === "hot") {
            badges.push("High Breathability", "Lightweight Fabric");
        } else if (thermal === "cool" || thermal === "cold") {
            badges.push("Thermal Layering", "Brisk Protection");
        } else {
            badges.push("Transitional Harmony", "Breathable Ease");
        }
        if (weatherContext?.windSpeed >= 20) {
            badges.push("Wind Resistant");
        }
        if (weatherContext?.humidity >= 70 && thermal !== "cold") {
            badges.push("Humidity Comfort");
        }
        return badges;
    };

    // Capsule 1: Primary Top + Bottom (+ Outerwear if cool/cold/raining)
    if (rankedTops.length > 0 && rankedBottoms.length > 0) {
        const selectedTop = rankedTops[0];
        const selectedBottom = rankedBottoms[0];
        const needsOuterwear = (thermalBand === "cool" || thermalBand === "cold" || raining) && rankedOuterwear.length > 0;
        const selectedOuterwear = needsOuterwear ? rankedOuterwear[0] : (thermalBand !== "hot" && rankedOuterwear.length > 0 ? rankedOuterwear[0] : null);
        const selectedShoe = rankedShoes.length > 0 ? rankedShoes[0] : null;

        const capsuleItems = [
            selectedTop,
            selectedBottom,
            ...(selectedOuterwear ? [selectedOuterwear] : []),
            ...(selectedShoe ? [selectedShoe] : [])
        ];

        // Compute scores
        const weatherScore = Math.round(
            capsuleItems.reduce((acc, it) => acc + evaluateGarmentWeatherFit(it, weatherContext, thermalBand, raining), 0) / capsuleItems.length
        );
        const styleScore = evaluateStyleProfileMatch(capsuleItems, styleProfile, selectedTop.occasion || "Casual");
        const finalMatchScore = Math.min(99, Math.round(styleScore * 0.55 + weatherScore * 0.45));

        const occ = (occasionFilter && occasionFilter.toLowerCase() !== "all") 
            ? occasionFilter 
            : (selectedTop.occasion || "Casual");
        const explanation = generateWeatherExplanation(capsuleItems, weatherContext, thermalBand, raining, occ);

        capsules.push({
            id: `cap-weather-1-${selectedTop._id}`,
            title: raining
                ? "Weather-Shielded Urban Silhouette"
                : thermalBand === "hot"
                ? "Breathable High-Summer Pairing"
                : thermalBand === "cool" || thermalBand === "cold"
                ? "Structured Thermal Layering"
                : "The Editorial Minimalist Look",
            occasion: occ,
            matchScore: finalMatchScore,
            weatherScore,
            weatherSuitability: raining
                ? `Protected for Rain (${temp}°C)`
                : `Optimal for ${temp}°C ${weatherContext?.condition || "Conditions"}`,
            weatherBadges: getWeatherBadges(thermalBand, raining),
            weatherExplanation: explanation,
            description: `Balanced proportions engineered for today's atmospheric conditions. Clean color synchronization and comfort calibrated to ${temp}°C.`,
            stylingNotes: needsOuterwear
                ? "Layer the outerwear loosely over your shoulders for modern editorial poise while staying warm."
                : "French tuck the top to accentuate waistline structure while maintaining unrestrictive airflow.",
            items: capsuleItems
        });
    }

    // Capsule 2: Dress Look OR Alternative Top + Bottom
    if (rankedDresses.length > 0 && thermalBand !== "cold") {
        const selectedDress = rankedDresses[0];
        const selectedOuterwear = (thermalBand === "cool" || raining) && rankedOuterwear.length > 0 ? rankedOuterwear[0] : null;
        const selectedShoe = rankedShoes.length > 0 ? rankedShoes[rankedShoes.length > 1 ? 1 : 0] : null;
        const selectedAcc = rankedAccessories.length > 0 ? rankedAccessories[0] : null;

        const capsuleItems = [
            selectedDress,
            ...(selectedOuterwear ? [selectedOuterwear] : []),
            ...(selectedShoe ? [selectedShoe] : []),
            ...(selectedAcc ? [selectedAcc] : [])
        ];

        const weatherScore = Math.round(
            capsuleItems.reduce((acc, it) => acc + evaluateGarmentWeatherFit(it, weatherContext, thermalBand, raining), 0) / capsuleItems.length
        );
        const styleScore = evaluateStyleProfileMatch(capsuleItems, styleProfile, "Office");
        const finalMatchScore = Math.min(98, Math.round(styleScore * 0.55 + weatherScore * 0.45));

        const occ = (occasionFilter && occasionFilter.toLowerCase() !== "all")
            ? occasionFilter
            : (selectedDress.occasion || "Office");
        const explanation = generateWeatherExplanation(capsuleItems, weatherContext, thermalBand, raining, occ);

        capsules.push({
            id: `cap-weather-2-${selectedDress._id}`,
            title: thermalBand === "hot" ? "Fluid Sun-Draped Elegance" : "Monochrome Haute Flow",
            occasion: occ,
            matchScore: finalMatchScore,
            weatherScore,
            weatherSuitability: `Calibrated for ${temp}°C ${weatherContext?.condition || "Atmosphere"}`,
            weatherBadges: getWeatherBadges(thermalBand, raining),
            weatherExplanation: explanation,
            description: "Sophisticated single-silhouette flow. Structured styling suited for professional presentations or gallery strolls.",
            stylingNotes: selectedOuterwear
                ? "Drape the outer layer over your shoulders to guard against sudden chilly drafts."
                : "Accentuate the clean neckline with understated metallic accessories.",
            items: capsuleItems
        });
    } else if (rankedTops.length > 1 && rankedBottoms.length > 0) {
        // Alternative Top + Bottom combination
        const selectedTop = rankedTops[1];
        const selectedBottom = rankedBottoms[rankedBottoms.length > 1 ? 1 : 0];
        const selectedOuterwear = rankedOuterwear.length > 1 ? rankedOuterwear[1] : (rankedOuterwear.length > 0 && thermalBand !== "hot" ? rankedOuterwear[0] : null);
        const selectedShoe = rankedShoes.length > 1 ? rankedShoes[1] : null;

        const capsuleItems = [
            selectedTop,
            selectedBottom,
            ...(selectedOuterwear ? [selectedOuterwear] : []),
            ...(selectedShoe ? [selectedShoe] : [])
        ];

        const weatherScore = Math.round(
            capsuleItems.reduce((acc, it) => acc + evaluateGarmentWeatherFit(it, weatherContext, thermalBand, raining), 0) / capsuleItems.length
        );
        const styleScore = evaluateStyleProfileMatch(capsuleItems, styleProfile, "Office");
        const finalMatchScore = Math.min(97, Math.round(styleScore * 0.55 + weatherScore * 0.45));

        const occ = selectedTop.occasion || "Office";
        const explanation = generateWeatherExplanation(capsuleItems, weatherContext, thermalBand, raining, occ);

        capsules.push({
            id: `cap-weather-2-${selectedTop._id}`,
            title: "Urban Contemporary Silhouette",
            occasion: occ,
            matchScore: finalMatchScore,
            weatherScore,
            weatherSuitability: `Harmonized for ${temp}°C`,
            weatherBadges: getWeatherBadges(thermalBand, raining),
            weatherExplanation: explanation,
            description: "Modern, confident styling optimized for day-to-evening versatility with tailored visual poise.",
            stylingNotes: "Roll up cuffs slightly to display delicate wrist accessories. Keep footwear understated.",
            items: capsuleItems
        });
    }

    // Capsule 3: Weekend / Casual Layering
    if (rankedTops.length > 0 && rankedBottoms.length > 1) {
        const selectedTop = rankedTops[rankedTops.length - 1];
        const selectedBottom = rankedBottoms[1];
        const selectedAcc = rankedAccessories.length > 0 ? rankedAccessories[rankedAccessories.length - 1] : null;

        const capsuleItems = [
            selectedTop,
            selectedBottom,
            ...(selectedAcc ? [selectedAcc] : [])
        ];

        const weatherScore = Math.round(
            capsuleItems.reduce((acc, it) => acc + evaluateGarmentWeatherFit(it, weatherContext, thermalBand, raining), 0) / capsuleItems.length
        );
        const styleScore = evaluateStyleProfileMatch(capsuleItems, styleProfile, "Weekend");
        const finalMatchScore = Math.min(96, Math.round(styleScore * 0.55 + weatherScore * 0.45));

        const explanation = generateWeatherExplanation(capsuleItems, weatherContext, thermalBand, raining, "Weekend");

        capsules.push({
            id: `cap-weather-3-${selectedTop._id}`,
            title: "Off-Duty Luxe Weekend",
            occasion: "Weekend",
            matchScore: finalMatchScore,
            weatherScore,
            weatherSuitability: `Relaxed Comfort at ${temp}°C`,
            weatherBadges: getWeatherBadges(thermalBand, raining),
            weatherExplanation: explanation,
            description: "Relaxed comfort without sacrificing refined aesthetic polish. Grounded in your preferred silhouette.",
            stylingNotes: "Pair with unstructured tote and slip-on loafers for effortless Parisian chic aura.",
            items: capsuleItems
        });
    }

    // Fallback: If user wardrobe has fewer items to build capsules, return curated weather inspiration capsules
    if (capsules.length === 0) {
        return generateInspirationCapsules(weatherContext, thermalBand, raining, occasionFilter);
    }

    // Filter by occasion if requested
    if (occasionFilter && occasionFilter.toLowerCase() !== "all") {
        const filtered = capsules.filter(
            (c) => c.occasion.toLowerCase() === occasionFilter.toLowerCase()
        );
        return filtered.length > 0 ? filtered : capsules;
    }

    return capsules;
};
