// ------------------------------------------------------------------
// CONFIG
// ------------------------------------------------------------------
const REST_COUNTRIES_URL = "https://restcountries.com/v3.1/name";
const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const UNSPLASH_API_URL = "https://api.unsplash.com/search/photos";

// ------------------------------------------------------------------
// MAIN AGGREGATOR
// ------------------------------------------------------------------
export async function getDynamicDestinationData(countryName) {
    if (!countryName) return null;

    const geminiKey = process.env.GEMINI_API_KEY?.trim();
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY?.trim();

    console.log("\n[DestinationService] ------------------------------------------------");
    console.log(`[DestinationService] Processing: ${countryName}`);
    console.log(`[DestinationService] Gemini Key: ${geminiKey ? "Present" : "MISSING"}`);
    console.log(`[DestinationService] Unsplash Key: ${unsplashKey ? "Present" : "MISSING"}`);

    const [factsResult, imagesResult, aiResult] = await Promise.allSettled([
        fetchCountryFacts(countryName),
        fetchCountryImages(countryName, unsplashKey),
        fetchAIContent(countryName, geminiKey),
    ]);

    if (factsResult.status === "rejected")
        console.error("[DestinationService] Facts Failed:", factsResult.reason.message);

    if (imagesResult.status === "rejected")
        console.error("[DestinationService] Images Failed:", imagesResult.reason.message);

    if (aiResult.status === "rejected")
        console.warn("[DestinationService] Gemini Failed (Quota/Network):", aiResult.reason.message);

    const factData =
        factsResult.status === "fulfilled"
            ? factsResult.value
            : {
                population: "Unknown",
                capital: "Unknown",
                currency: "Unknown",
                region: "Unknown",
                flag: "🏳️",
                languages: "Unknown",
            };

    return {
        slug: countryName.toLowerCase(),
        name: countryName,
        ...factData,
        images: imagesResult.status === "fulfilled" ? imagesResult.value : [],
        content: aiResult.status === "fulfilled" ? aiResult.value : null,
        isDynamic: true,
    };
}

// ------------------------------------------------------------------
// 1. REST COUNTRIES
// ------------------------------------------------------------------
async function fetchCountryFacts(countryName) {
    const res = await fetch(
        `${REST_COUNTRIES_URL}/${countryName}?fields=name,capital,currencies,population,region,flags,languages,cca2`
    );

    if (!res.ok) throw new Error(`REST Countries ${res.status}`);

    const data = await res.json();
    const info = data[0];

    const currencyKey = Object.keys(info.currencies || {})[0];
    const currency = currencyKey
        ? info.currencies[currencyKey]
        : { name: "Unknown", symbol: "" };

    return {
        officialName: info.name.official,
        capital: info.capital?.[0] || "N/A",
        region: info.region,
        population: info.population.toLocaleString(),
        currency: `${currency.name} ${currency.symbol || ""}`,
        flag: info.flags.png,
        languages: info.languages ? Object.values(info.languages).join(", ") : "Unknown",
        code: info.cca2, // Required for Map outline
    };
}

// ------------------------------------------------------------------
// 2. UNSPLASH
// ------------------------------------------------------------------
async function fetchCountryImages(countryName, apiKey) {
    if (!apiKey) throw new Error("Missing Unsplash API Key");

    const url = `${UNSPLASH_API_URL}?query=${encodeURIComponent(
        countryName
    )}+travel+landmark&orientation=landscape&per_page=6`;

    const res = await fetch(url, {
        headers: {
            Authorization: `Client-ID ${apiKey}`,
        },
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Unsplash ${res.status}: ${err}`);
    }

    const data = await res.json();

    return data.results.map((img) => ({
        url: img.urls.regular,
        alt: img.alt_description || countryName,
        author: img.user.name,
    }));
}

// ------------------------------------------------------------------
// 3. GEMINI AI (FIXED)
// ------------------------------------------------------------------
async function fetchAIContent(countryName, apiKey) {
    if (!apiKey) throw new Error("Missing Gemini API Key");

    const prompt = `
Generate a premium travel guide for "${countryName}".
Return STRICT JSON ONLY.

{
  "tagline": "Short travel slogan",
  "intro": "2-3 sentence introduction",
  "bestPlaces": [
    { "title": "Place", "desc": "Description" }
  ],
  "thingsToDo": ["Activity 1", "Activity 2", "Activity 3"],
  "culturalTips": {
    "greeting": "Greeting style",
    "etiquette": "Important etiquette",
    "tipping": "Tipping custom"
  }
}
`;

    const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
        }),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Gemini ${res.status}: ${err}`);
    }

    const data = await res.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!raw) throw new Error("Gemini returned empty response");

    // Strong JSON extraction
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Gemini response is not valid JSON");

    return JSON.parse(jsonMatch[0]);
}
