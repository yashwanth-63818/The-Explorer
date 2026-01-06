// This service handles fetching dynamic data from 3 external sources:
// 1. Google Gemini AI (Content)
// 2. Unsplash API (Images)
// 3. REST Countries API (Facts)

const REST_COUNTRIES_URL = "https://restcountries.com/v3.1/name";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";
const UNSPLASH_API_URL = "https://api.unsplash.com/search/photos";

/**
 * Aggregates all data for a specific country.
 * @param {string} countryName 
 */
export async function getDynamicDestinationData(countryName) {
    if (!countryName) return null;

    const geminiKey = process.env.GEMINI_API_KEY?.trim();
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY?.trim();

    console.log(`[DestinationService] ------------------------------------------------`);
    console.log(`[DestinationService] Processing: ${countryName}`);
    console.log(`[DestinationService] Gemini Key: ${geminiKey ? "Present (Length: " + geminiKey.length + ")" : "MISSING"}`);
    console.log(`[DestinationService] Unsplash Key: ${unsplashKey ? "Present (Length: " + unsplashKey.length + ")" : "MISSING"}`);

    // Run APIs in parallel (Settled allows us to see individual failures)
    // We pass keys explicitly to avoid scope issues
    const [factsResult, imagesResult, aiResult] = await Promise.allSettled([
        fetchCountryFacts(countryName),
        fetchCountryImages(countryName, unsplashKey),
        fetchAIContent(countryName, geminiKey)
    ]);

    // LOG RESULTS
    if (factsResult.status === 'rejected') console.error(`[DestinationService] Facts Failed: ${factsResult.reason}`);
    if (imagesResult.status === 'rejected') console.error(`[DestinationService] Images Failed: ${imagesResult.reason}`);
    if (aiResult.status === 'rejected') console.error(`[DestinationService] Gemini Failed: ${aiResult.reason}`);

    // Process Facts (Allow partial success if Facts fail)
    const factData = factsResult.status === 'fulfilled' ? factsResult.value : {
        population: "Unknown",
        capital: "Unknown",
        currency: "Unknown",
        region: "Unknown",
        flag: "🏳️",
        languages: "Unknown"
    };

    // Process Images
    // STRICT MODE: If Unsplash fails, we return empty array.
    const imageData = imagesResult.status === 'fulfilled' ? imagesResult.value : [];

    // Process AI Content
    // STRICT MODE: If AI fails, we return NULL. The UI will show static data, BUT we logged the specific error above.
    const content = aiResult.status === 'fulfilled' ? aiResult.value : null;

    return {
        slug: countryName.toLowerCase(),
        name: countryName,
        ...factData,
        images: imageData,
        ...content,
        isDynamic: true,
        // Add error info for frontend debugging if needed
        errors: {
            ai: aiResult.status === 'rejected' ? aiResult.reason.message : null,
            images: imagesResult.status === 'rejected' ? imagesResult.reason.message : null
        }
    };
}

// ------------------------------------------------------------------
// 1. REST COUNTRIES API
// ------------------------------------------------------------------
async function fetchCountryFacts(countryName) {
    try {
        const res = await fetch(`${REST_COUNTRIES_URL}/${countryName}?fields=name,capital,currencies,population,region,flags,languages`);
        if (!res.ok) {
            if (res.status === 404) return null; // Gracefully handle non-country searches
            throw new Error(`RestCountries Status: ${res.status}`);
        }

        const data = await res.json();
        const info = data[0];

        const currencyKey = Object.keys(info.currencies || {})[0];
        const currency = currencyKey ? info.currencies[currencyKey] : { name: "Unknown", symbol: "$" };

        return {
            officialName: info.name.official,
            capital: info.capital ? info.capital[0] : "N/A",
            region: info.region,
            population: info.population.toLocaleString(),
            currency: `${currency.name} (${currency.symbol})`,
            flag: info.flags.png,
            languages: info.languages ? Object.values(info.languages).join(", ") : "Unknown"
        };
    } catch (error) {
        throw new Error(`Facts Fetch Failed: ${error.message}`);
    }
}

// ------------------------------------------------------------------
// 2. UNSPLASH API
// ------------------------------------------------------------------
async function fetchCountryImages(countryName, apiKey) {
    if (!apiKey) throw new Error("Missing Unsplash API Key");

    try {
        const url = `${UNSPLASH_API_URL}?query=${encodeURIComponent(countryName)} travel luxury&orientation=landscape&per_page=6&client_id=${apiKey}`;
        const res = await fetch(url);

        if (!res.ok) {
            // Log the actual response body for debugging
            const errText = await res.text();
            throw new Error(`Unsplash API Error ${res.status}: ${res.statusText} - ${errText}`);
        }

        const data = await res.json();
        return data.results.map(img => ({
            url: img.urls.regular,
            alt: img.alt_description || countryName,
            user: img.user.name
        }));
    } catch (error) {
        throw error;
    }
}

// ------------------------------------------------------------------
// 3. GEMINI AI API
// ------------------------------------------------------------------
async function fetchAIContent(countryName, apiKey) {
    if (!apiKey) throw new Error("Missing Gemini API Key");

    const prompt = `
    Generate a travel guide for "${countryName}" in strict JSON format.
    The tone should be "Premium Travel Magazine" - inspiring, sophisticated, and informative.
    
    Required JSON Structure:
    {
        "tagline": "A short, punchy 3-5 word slogan for the country",
        "intro": "A 2-3 sentence inspiring introduction about the destination, its vibe, and why to visit.",
        "bestPlaces": [
            { "title": "Place Name", "desc": "Short description" },
            { "title": "Place Name", "desc": "Short description" },
            { "title": "Place Name", "desc": "Short description" }
        ],
        "thingsToDo": [
            "Activity 1", "Activity 2", "Activity 3", "Activity 4", "Activity 5"
        ],
        "culturalTips": {
             "greeting": "How to say hello",
             "etiquette": "One important rule",
             "tipping": "Tipping custom"
        }
    }
    RETURN ONLY JSON. NO MARKDOWN BLOCK.
    `;

    try {
        const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Gemini API Error ${res.status}: ${errText}`);
        }

        const data = await res.json();
        const candidate = data.candidates?.[0];
        let text = candidate?.content?.parts?.[0]?.text;

        if (!text) throw new Error("Gemini returned empty text content.");

        // Clean markdown
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(text);

    } catch (error) {
        throw error;
    }
}
