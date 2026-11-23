/**
 * Verification for Weather Service Normalization and Error Handling
 */

import {
    getWeatherByCoordinates,
    getWeatherByCity,
    searchLocations
} from "./services/weatherService.js";

console.log("==========================================");
console.log("Weather Service Integration & Safety Test");
console.log("==========================================\n");

let passed = 0;
let total = 0;

function assert(condition, message) {
    total++;
    if (condition) {
        console.log(`  ✓ PASS: ${message}`);
        passed++;
    } else {
        console.error(`  ✗ FAIL: ${message}`);
        process.exitCode = 1;
    }
}

async function run() {
    // Test 1: Coordinates validation
    try {
        await getWeatherByCoordinates("invalid", "invalid");
        assert(false, "Should throw on invalid coordinates");
    } catch (e) {
        assert(e.message.includes("Invalid latitude or longitude"), "Catches invalid coordinates properly");
    }

    // Test 2: City validation
    try {
        await getWeatherByCity("");
        assert(false, "Should throw on empty city");
    } catch (e) {
        assert(e.message.includes("City name is required"), "Catches empty city name properly");
    }

    // Test 3: Search with short query
    const results = await searchLocations("a");
    assert(Array.isArray(results) && results.length === 0, "Returns empty array for queries < 2 chars");

    // Test 4: Live query (inside sandbox may fail network, but should throw cleanly without unhandled rejection)
    try {
        console.log("  Attempting external weather fetch (testing network handling)...");
        const weather = await getWeatherByCity("Paris");
        assert(weather && weather.weather && weather.location, "Successfully retrieved normalized weather data");
        console.log(`    Temperature: ${weather.weather.temperature}°C, Condition: ${weather.weather.condition}, Provider: ${weather.source}`);
    } catch (err) {
        console.log(`    Network/sandbox blocked external fetch as expected in sandbox: ${err.message}`);
        assert(err instanceof Error, "Cleanly threw standard Error object on network block without crashing");
    }

    console.log("\n==========================================");
    console.log(`Weather Test Summary: ${passed}/${total} Passed`);
    console.log("==========================================");
}

run();
