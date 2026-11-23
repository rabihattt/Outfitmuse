/**
 * Verification Test Suite for OutfitMuse Geo-Contextual Smart Styling
 * Tests all 9 scenarios and algorithmic rules
 */

import { synthesizeWeatherRecommendations } from "./services/recommendationEngine.js";

// Sample mock wardrobe items
const sampleWardrobe = [
    {
        _id: "item-1",
        name: "Breezy White Linen Blouse",
        category: "Tops",
        color: "White",
        season: "Summer",
        occasion: "Casual"
    },
    {
        _id: "item-2",
        name: "Fine Ribbed Merino Cashmere Turtleneck",
        category: "Tops",
        color: "Plum",
        season: "Winter",
        occasion: "Office"
    },
    {
        _id: "item-3",
        name: "Wide-Leg Light Cotton Chino Pant",
        category: "Bottoms",
        color: "Beige",
        season: "Summer",
        occasion: "Casual"
    },
    {
        _id: "item-4",
        name: "Heavy Pleated Flannel Trousers",
        category: "Bottoms",
        color: "Charcoal",
        season: "Winter",
        occasion: "Office"
    },
    {
        _id: "item-5",
        name: "Water-Repellent Double Trench Coat",
        category: "Outerwear",
        color: "Camel",
        season: "All Season",
        occasion: "Casual"
    },
    {
        _id: "item-6",
        name: "Insulated Wool Wrap Overcoat",
        category: "Outerwear",
        color: "Plum",
        season: "Winter",
        occasion: "Office"
    },
    {
        _id: "item-7",
        name: "Open-Toe Canvas Espadrille Sandals",
        category: "Shoes",
        color: "Sand",
        season: "Summer",
        occasion: "Casual"
    },
    {
        _id: "item-8",
        name: "Polished Waterproof Leather Chelsea Boots",
        category: "Shoes",
        color: "Black",
        season: "All Season",
        occasion: "Office"
    },
    {
        _id: "item-9",
        name: "Fluid Silk Crepe Slip Dress",
        category: "Dresses",
        color: "Pastel Rose",
        season: "Summer",
        occasion: "Party"
    }
];

const sampleStyleProfile = {
    favoriteColors: ["Pastel colors", "Neutral colors", "Monochrome"],
    dislikedColorsPatterns: ["Neon colors"],
    preferredOccasions: ["Casual outing", "Office"],
    preferredFits: ["Relaxed fit"]
};

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
    totalTests++;
    if (condition) {
        console.log(`  ✓ PASS: ${message}`);
        passedTests++;
    } else {
        console.error(`  ✗ FAIL: ${message}`);
        process.exitCode = 1;
    }
}

console.log("=================================================");
console.log("OutfitMuse Geo-Contextual Smart Styling Test Run");
console.log("=================================================\n");

// Scenario 1: High Temperature (32°C Hot Summer)
console.log("Test Scenario 1: High Temperature (32°C Hot Summer)");
{
    const hotWeather = {
        temperature: 32,
        feelsLike: 35,
        condition: "Clear",
        conditionCategory: "clear",
        thermalCategory: "hot",
        description: "Radiant sunshine",
        humidity: 60,
        windSpeed: 8,
        rainProbability: 5,
        location: { name: "Tokyo", country: "Japan" }
    };

    const capsules = synthesizeWeatherRecommendations(sampleWardrobe, sampleStyleProfile, hotWeather, "All");
    assert(capsules.length > 0, "Generates recommendations for hot weather");

    const primaryCapsule = capsules[0];
    const topItem = primaryCapsule.items.find(i => i.category === "Tops");
    assert(topItem?.name.includes("Linen"), `Prioritizes lightweight linen top (got: ${topItem?.name})`);

    const hasHeavyOuterwear = primaryCapsule.items.some(i => i.name.includes("Wool Wrap Overcoat"));
    assert(!hasHeavyOuterwear, "Avoids heavy winter wool coat in high heat");

    assert(primaryCapsule.weatherExplanation.includes("32°C") || primaryCapsule.weatherExplanation.toLowerCase().includes("heat") || primaryCapsule.weatherExplanation.toLowerCase().includes("lightweight"), 
        `Weather explanation mentions temperature or lightweight suitability: "${primaryCapsule.weatherExplanation}"`);
}

// Scenario 2: Rainy Weather (16°C with Rain Showers)
console.log("\nTest Scenario 2: Rainy Conditions (16°C Rain Showers)");
{
    const rainyWeather = {
        temperature: 16,
        feelsLike: 14,
        condition: "Rain",
        conditionCategory: "rainy",
        thermalCategory: "rainy",
        description: "Moderate rain showers",
        humidity: 88,
        windSpeed: 20,
        rainProbability: 85,
        precipitation: 4.2,
        location: { name: "London", country: "UK" }
    };

    const capsules = synthesizeWeatherRecommendations(sampleWardrobe, sampleStyleProfile, rainyWeather, "All");
    assert(capsules.length > 0, "Generates recommendations for rainy weather");

    const primaryCapsule = capsules[0];
    const hasTrench = primaryCapsule.items.some(i => i.name.includes("Trench"));
    assert(hasTrench, "Prioritizes water-repellent trench coat for rain");

    const shoes = primaryCapsule.items.find(i => i.category === "Shoes");
    assert(shoes?.name.includes("Boot") || shoes?.name.includes("Leather"), 
        `Selects protective boots over open sandals (got: ${shoes?.name})`);

    const hasSandals = primaryCapsule.items.some(i => i.name.includes("Sandals"));
    assert(!hasSandals, "Strictly avoids open canvas sandals in rainy weather");

    assert(primaryCapsule.weatherExplanation.toLowerCase().includes("rain") || primaryCapsule.weatherExplanation.toLowerCase().includes("wet") || primaryCapsule.weatherExplanation.includes("16°C"),
        `Explanation mentions rain/wet condition suitability: "${primaryCapsule.weatherExplanation}"`);
}

// Scenario 3: Cool / Chilly Weather (8°C Winter Chill)
console.log("\nTest Scenario 3: Cool / Cold Temperature (8°C Cold Chill)");
{
    const coldWeather = {
        temperature: 8,
        feelsLike: 5,
        condition: "Overcast",
        conditionCategory: "cloudy",
        thermalCategory: "cold",
        description: "Brisk chilly overcast",
        humidity: 65,
        windSpeed: 22,
        rainProbability: 20,
        location: { name: "Paris", country: "France" }
    };

    const capsules = synthesizeWeatherRecommendations(sampleWardrobe, sampleStyleProfile, coldWeather, "All");
    assert(capsules.length > 0, "Generates recommendations for cool/cold weather");

    const primaryCapsule = capsules[0];
    const hasWarmOuterwear = primaryCapsule.items.some(i => i.category === "Outerwear");
    assert(hasWarmOuterwear, "Prioritizes warm layering with outerwear");

    const top = primaryCapsule.items.find(i => i.category === "Tops");
    assert(top?.name.includes("Cashmere") || top?.name.includes("Turtleneck"), 
        `Prioritizes warm cashmere knitwear (got: ${top?.name})`);

    assert(primaryCapsule.weatherExplanation.toLowerCase().includes("cool") || primaryCapsule.weatherExplanation.toLowerCase().includes("cold") || primaryCapsule.weatherExplanation.toLowerCase().includes("layering"),
        `Explanation recommends layering/thermal protection: "${primaryCapsule.weatherExplanation}"`);
}

// Scenario 4: User Wardrobe Constraint (Never recommends unowned items)
console.log("\nTest Scenario 4: User Wardrobe Constraint");
{
    const mildWeather = {
        temperature: 21,
        feelsLike: 21,
        condition: "Partly Cloudy",
        conditionCategory: "cloudy",
        thermalCategory: "mild",
        humidity: 50,
        windSpeed: 10,
        rainProbability: 10,
        location: { name: "Milan", country: "Italy" }
    };

    const capsules = synthesizeWeatherRecommendations(sampleWardrobe, sampleStyleProfile, mildWeather, "All");
    const sampleIds = new Set(sampleWardrobe.map(i => i._id));

    let allItemsOwned = true;
    for (const cap of capsules) {
        if (cap.items) {
            for (const item of cap.items) {
                if (!sampleIds.has(item._id)) {
                    allItemsOwned = false;
                }
            }
        }
    }
    assert(allItemsOwned, "All recommended items are strictly from the user's uploaded wardrobe");
}

// Scenario 5: Resilience (Weather API Failure does not crash)
console.log("\nTest Scenario 5: Weather API Failure Resilience");
{
    // Calling with null or empty weather
    const capsulesWithNullWeather = synthesizeWeatherRecommendations(sampleWardrobe, sampleStyleProfile, null, "All");
    assert(capsulesWithNullWeather.length > 0, "Continues generating recommendations when weather is null");

    const capsulesWithEmptyWeather = synthesizeWeatherRecommendations(sampleWardrobe, sampleStyleProfile, {}, "All");
    assert(capsulesWithEmptyWeather.length > 0, "Continues generating recommendations when weather is empty object");

    // Calling with empty wardrobe provides inspiration preview capsules gracefully
    const capsulesWithEmptyWardrobe = synthesizeWeatherRecommendations([], sampleStyleProfile, null, "All");
    assert(capsulesWithEmptyWardrobe.length > 0 && capsulesWithEmptyWardrobe[0].isPreview, 
        "Gracefully provides inspiration preview capsules when wardrobe is empty");
}

// Scenario 6: Occasion Filter & Style Profile Integration
console.log("\nTest Scenario 6: Occasion Filter Integration");
{
    const mildWeather = {
        temperature: 22,
        feelsLike: 22,
        condition: "Clear",
        conditionCategory: "clear",
        thermalCategory: "warm",
        humidity: 50,
        windSpeed: 10,
        rainProbability: 10
    };

    const officeCapsules = synthesizeWeatherRecommendations(sampleWardrobe, sampleStyleProfile, mildWeather, "Office");
    assert(officeCapsules.length > 0, "Generates occasion-filtered recommendations");
    const allMatchOccasion = officeCapsules.every(c => c.occasion.toLowerCase() === "office");
    assert(allMatchOccasion, "Every returned capsule respects the requested 'Office' occasion");
}

console.log("\n=================================================");
console.log(`Test Summary: ${passedTests}/${totalTests} Tests Passed`);
console.log("=================================================");

if (passedTests === totalTests) {
    console.log("All Geo-Contextual Smart Styling tests passed successfully!\n");
    process.exit(0);
} else {
    console.error("Some tests failed!\n");
    process.exit(1);
}
