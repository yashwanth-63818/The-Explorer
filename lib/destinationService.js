import fs from "fs/promises";
import path from "path";
import { destinations as editorialData } from "./destinationData";

// ------------------------------------------------------------------
// CONFIG
// ------------------------------------------------------------------
const REST_COUNTRIES_URL = "https://restcountries.com/v3.1/name";
const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";
const UNSPLASH_API_URL = "https://api.unsplash.com/search/photos";

const CACHE_DIR = path.join(process.cwd(), "data", "cache", "countries");
const POST_CACHE_DIR = path.join(process.cwd(), "data", "cache", "posts");

// ------------------------------------------------------------------
// 1. COUNTRY DATA SERVICE
// ------------------------------------------------------------------
export async function getDynamicDestinationData(countryName) {
    if (!countryName) return null;

    const slug = countryName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
    const geminiKey = (process.env.GEMINI_API_KEY || "").trim().replace(/^["']|["']$/g, '');
    const unsplashKey = (process.env.UNSPLASH_ACCESS_KEY || "").trim().replace(/^["']|["']$/g, '');

    console.log(`\n[CountryService] 🚀 Processing: "${countryName}"`);

    // 1. Mandatory Data: Facts & Images (Parallel)
    const [factsResult, imagesResult] = await Promise.allSettled([
        fetchCountryFacts(countryName),
        fetchCountryImages(countryName, unsplashKey),
    ]);

    const facts = factsResult.status === "fulfilled" ? factsResult.value : getFallbackFacts(countryName);
    const images = imagesResult.status === "fulfilled" ? imagesResult.value : [];

    // 2. Check Cache for AI Content
    let content = null;
    try {
        const cacheFilePath = path.join(CACHE_DIR, `${slug}.json`);
        const cacheData = await fs.readFile(cacheFilePath, 'utf-8');
        if (cacheData && cacheData !== "null") {
            content = JSON.parse(cacheData);
        }
    } catch (err) { }

    // 3. Fallback to Editorial if Cache Missing
    if (!content && editorialData[slug]) {
        console.log(`[CountryService] 📚 Using Editorial data for ${slug}`);
        const editorial = editorialData[slug];
        content = {
            tagline: editorial.tagline || `Discover ${countryName}`,
            intro: editorial.intro || "",
            whyVisit: editorial.intro || `Explore the beauty of ${countryName}`,
            featuredArticle: {
                title: `Experience ${countryName}`,
                subtitle: `A curated look at ${countryName}.`,
                category: "Editorial"
            },
            bestPlaces: (editorial.bestPlaces || []).map(p => ({
                city: p.title,
                reason: "A must-visit highlight.",
                category: "Top Pick"
            })),
            blogPosts: [],
            travelTips: {
                greeting: "Hello",
                etiquette: "Respect local customs.",
                tipping: "Follow local custom.",
                safety: "Stay safe."
            },
            thingsToDo: editorial.thingsToDo || []
        };
    }

    // 4. If still no content and API is available, try Gemini (One shot, Flash only)
    if (!content && geminiKey) {
        console.log(`[CountryService] 🌐 Fetching fresh AI content for ${countryName}...`);
        content = await fetchCountryAIContent(countryName, geminiKey);
        if (content) {
            await saveToCache(slug, content);
        }
    }

    // 5. Final fallback for UI safety
    if (!content) {
        content = {
            tagline: `Exploring ${countryName}`,
            intro: `${countryName} is a beautiful destination with a rich history and vibrant culture.`,
            whyVisit: `From stunning landscapes to bustling cities, ${countryName} offers something for every traveler.`,
            bestPlaces: [{ city: `${countryName} Capital`, reason: "The cultural heart of the nation.", category: "Mandatory" }],
            blogPosts: [],
            travelTips: { greeting: "Hello", etiquette: "Standard etiquette.", tipping: "Optional.", safety: "Normal precautions." },
            thingsToDo: ["Sightseeing", "Local Food", "Cultural Tours"]
        };
    }

    return {
        slug,
        name: countryName,
        facts,
        images,
        content,
        isAI: !!content && !editorialData[slug]
    };
}

async function saveToCache(slug, data) {
    try {
        const cacheFilePath = path.join(CACHE_DIR, `${slug}.json`);
        await fs.mkdir(CACHE_DIR, { recursive: true });
        await fs.writeFile(cacheFilePath, JSON.stringify(data, null, 2));
        console.log(`[CountryService] Cached AI response for: ${slug}`);
    } catch (err) {
        console.error(`[CountryService] Cache Save Error:`, err.message);
    }
}

function getFallbackFacts(countryName) {
    return {
        officialName: countryName,
        capital: "N/A",
        region: "Unknown",
        subregion: "Unknown",
        population: "N/A",
        currency: "Unknown",
        flag: "",
        languages: "Unknown",
        code: "UN"
    };
}

// ------------------------------------------------------------------
// 2. CITY / POST DATA SERVICE
// ------------------------------------------------------------------
export async function getDynamicPostData(slug) {
    if (!slug) return null;

    // Expected format: [city]-[country]-travel-guide
    const parts = slug.split("-");
    const guideIndex = parts.indexOf("travel");

    if (guideIndex === -1) {
        const thingsIndex = parts.indexOf("things");
        if (thingsIndex === -1) return null;
    }

    const cityCountryParts = parts.slice(0, guideIndex !== -1 ? guideIndex : parts.indexOf("things"));
    if (cityCountryParts.length < 2) return null;

    const countryName = cityCountryParts[cityCountryParts.length - 1];
    const cityName = cityCountryParts.slice(0, -1).join(" ");

    const geminiKey = process.env.GEMINI_API_KEY?.trim();
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY?.trim();

    console.log(`\n[PostService] Starting fetch for: ${cityName}, ${countryName}`);

    // 2. Check Cache
    let cachedAI = null;
    try {
        const cacheFilePath = path.join(POST_CACHE_DIR, `${slug}.json`);
        const cacheData = await fs.readFile(cacheFilePath, 'utf-8');
        cachedAI = JSON.parse(cacheData);
        console.log(`[PostService] Loaded cached AI data for ${slug}`);
    } catch (err) {
        // Cache not found
    }

    if (cachedAI) {
        return {
            slug,
            cityName,
            countryName,
            images: [], // Images are fetched separately or could be cached too if we wanted
            content: cachedAI,
            isCached: true
        };
    }

    const [imagesResult, aiResult] = await Promise.allSettled([
        fetchCityImages(cityName, countryName, unsplashKey),
        fetchCityAIContent(cityName, countryName, geminiKey),
    ]);

    // For posts, handle failure gracefully
    let finalContent = null;
    if (aiResult.status === "fulfilled" && aiResult.value) {
        finalContent = aiResult.value;
        await savePostToCache(slug, finalContent);
    } else {
        console.warn(`[PostService] AI Failed/Exhausted for ${slug}`);
        return null; // Renders error or fallback in UI
    }

    return {
        slug,
        cityName,
        countryName,
        images: imagesResult.status === "fulfilled" ? imagesResult.value : [],
        content: finalContent,
    };
}

async function savePostToCache(slug, data) {
    try {
        const cacheFilePath = path.join(POST_CACHE_DIR, `${slug}.json`);
        await fs.mkdir(POST_CACHE_DIR, { recursive: true });
        await fs.writeFile(cacheFilePath, JSON.stringify(data, null, 2));
        console.log(`[PostService] Cached AI response for: ${slug}`);
    } catch (err) {
        console.error(`[PostService] Cache Save Error:`, err.message);
    }
}

// ------------------------------------------------------------------
// HELPER: REST COUNTRIES
// ------------------------------------------------------------------
async function fetchCountryFacts(countryName) {
    const encodedName = encodeURIComponent(countryName);
    const url = `${REST_COUNTRIES_URL}/${encodedName}?fullText=true&fields=name,capital,currencies,population,region,subregion,flags,languages,cca2`;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.warn(`[CountryService] REST Countries (FullText) failed for ${countryName}. Retrying partial match...`);
            const retryUrl = `${REST_COUNTRIES_URL}/${encodedName}?fields=name,capital,currencies,population,region,subregion,flags,languages,cca2`;
            const retryRes = await fetch(retryUrl);
            if (!retryRes.ok) throw new Error(`REST Countries API Failed: ${retryRes.status}`);
            const data = await retryRes.json();
            return processFacts(data[0]);
        }
        const data = await res.json();
        return processFacts(data[0]);
    } catch (err) {
        console.error(`[CountryService] Fact Fetch Error:`, err.message);
        throw err;
    }
}

function processFacts(info) {
    if (!info) throw new Error("No country information found in REST Countries API.");

    const currencyKey = Object.keys(info.currencies || {})[0];
    const currency = currencyKey ? info.currencies[currencyKey] : { name: "Unknown", symbol: "" };
    return {
        officialName: info.name?.official || "Unknown",
        capital: info.capital?.[0] || "N/A",
        region: info.region || "Unknown",
        subregion: info.subregion || "Unknown",
        population: info.population?.toLocaleString() || "0",
        currency: `${currency.name} (${currency.symbol || ""})`,
        flag: info.flags?.png || "",
        languages: info.languages ? Object.values(info.languages).join(", ") : "Unknown",
        code: info.cca2 || "Unknown",
    };
}

// ------------------------------------------------------------------
// HELPER: UNSPLASH IMAGES
// ------------------------------------------------------------------
async function fetchCountryImages(countryName, apiKey) {
    if (!apiKey) return [];
    const queries = [
        `${countryName} travel landmarks`,
        `${countryName} city architecture`,
        `${countryName} nature landscape`,
        `${countryName} culture people`,
        `${countryName} street food`
    ];

    try {
        const results = await Promise.all(queries.map(q =>
            fetch(`${UNSPLASH_API_URL}?query=${encodeURIComponent(q)}&orientation=landscape&per_page=3`, {
                headers: { Authorization: `Client-ID ${apiKey}` }
            }).then(r => r.ok ? r.json() : { results: [] })
        ));

        const allImages = results.flatMap(r => r.results);

        // Ensure diversity by taking top results from different queries
        const seen = new Set();
        const uniqueImages = allImages.filter(img => {
            if (seen.has(img.id)) return false;
            seen.add(img.id);
            return true;
        }).map(img => ({
            url: img.urls.regular,
            alt: img.alt_description || `${countryName} travel`,
            author: img.user.name,
            link: img.links.html
        }));

        return uniqueImages.length > 0 ? uniqueImages : [];
    } catch (err) {
        return [];
    }
}

async function fetchCityImages(cityName, countryName, apiKey) {
    if (!apiKey) return [];
    const queries = [
        `${cityName} ${countryName} street architecture`,
        `${cityName} ${countryName} food market`,
        `${cityName} ${countryName} nightlife skyline`,
        `${cityName} ${countryName} landmark sunset`
    ];

    try {
        const results = await Promise.all(queries.map(q =>
            fetch(`${UNSPLASH_API_URL}?query=${encodeURIComponent(q)}&orientation=landscape&per_page=5`, {
                headers: { Authorization: `Client-ID ${apiKey}` }
            }).then(r => r.ok ? r.json() : { results: [] })
        ));

        return results.flatMap(r => r.results).map(img => ({
            url: img.urls.regular,
            alt: img.alt_description || cityName,
            author: img.user.name
        })).sort(() => Math.random() - 0.5);
    } catch (err) {
        return [];
    }
}

// ------------------------------------------------------------------
// HELPER: GEMINI AI
// ------------------------------------------------------------------
async function fetchCountryAIContent(countryName, apiKey) {
    if (!apiKey) return null;

    const prompt = `
Generate a premium, unique travel guide for "${countryName}" in STRICT JSON.
Do not include any text outside the JSON block.

Structure:
{
  "tagline": "Unique slogan for ${countryName}",
  "intro": "3-sentence evocative intro paragraph to the travel vibe.",
  "whyVisit": "2-3 paragraphs about culture, geography, and atmosphere.",
  "featuredArticle": {
    "title": "A high-fidelity editorial title for a main feature about ${countryName}",
    "subtitle": "An intriguing 2-sentence hook for the feature.",
    "category": "Epic Journeys"
  },
  "bestPlaces": [
    { 
      "city": "Iconic City Name", 
      "reason": "Specific reason to visit, mentioning a unique landmark.",
      "category": "Metropolis" 
    }
  ],
  "thingsToDo": [
     "Unique activity/experience 1",
     "Unique activity/experience 2",
     "Unique activity/experience 3",
     "Unique activity/experience 4",
     "Unique activity/experience 5"
  ],
  "blogPosts": [
    {
       "title": "Editorial title for a specific blog post about an activity or region in ${countryName}",
       "category": "Travel Guide",
       "author": "TravelSeeker Editorial",
       "date": "Jan 07, 2026",
       "snippet": "A short hook for the post."
    }
  ],
  "travelTips": {
    "greeting": "Etiquette for hello.",
    "etiquette": "Social do/dont.",
    "tipping": "Tipping culture.",
    "safety": "Safety tip."
  }
}

Generate 4 unique blog posts for the blogPosts array and include 5 unique thingsToDo.
`;

    try {
        const result = await callGemini(prompt, apiKey, `Country:${countryName}`);
        if (!result) {
            console.warn(`[CountryAI] Gemini returned null for ${countryName}`);
        }
        return result;
    } catch (err) {
        console.error(`[CountryAI] Critical failure for ${countryName}:`, err.message);
        return null;
    }
}

async function fetchCityAIContent(cityName, countryName, apiKey) {
    if (!apiKey) return null;

    const prompt = `
Generate a detailed backpacking guide for "${cityName}, ${countryName}" in STRICT JSON.
Do not include any text outside the JSON block.

{
  "title": "Compelling title",
  "introduction": "3-4 paragraphs of story-driven intro.",
  "author": {
    "name": "TravelSeeker Expert",
    "bio": "Expert traveler and writer specializing in ${countryName}."
  },
  "readingTime": "8 Min Read",
  "sections": [
    {
      "title": "Things to Do",
      "content": "Overview",
      "items": [{ "name": "Spot", "description": "Story" }]
    },
    { "title": "Where to Stay", "content": "Expert advice" },
    { "title": "Food", "content": "Local flavors" },
    { "title": "Budget", "content": "Costs in USD" },
    { "title": "Transport", "content": "Getting around" }
  ],
  "practicalTips": {
    "bestTime": "Months",
    "connectivity": "SIM/Internet",
    "hiddenGem": "Secret spot"
  }
}
`;

    try {
        return await callGemini(prompt, apiKey, `City:${cityName}`);
    } catch (err) {
        console.warn(`[CityAI] Error for ${cityName}:`, err.message);
        return null;
    }
}

async function callGemini(prompt, apiKey, context = "Unknown") {
    // HARD RULE: Only use gemini-1.5-flash for reliability/speed
    const model = "gemini-1.5-flash";
    const maskKey = apiKey ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` : "MISSING";
    console.log(`[Gemini:${context}] 🛰️ Calling ${model} (Key: ${maskKey})`);

    const callWithTimeout = async (attempt = 0) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                signal: controller.signal,
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        responseMimeType: "application/json",
                        temperature: 0.7, // Lower temperature for more stable JSON
                        topP: 0.95,
                        topK: 40,
                        maxOutputTokens: 2048,
                    },
                    safetySettings: [
                        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
                    ]
                }),
            });

            clearTimeout(timeoutId);

            if (!res.ok) {
                const errBody = await res.json().catch(() => ({}));
                const msg = errBody.error?.message || res.statusText;
                console.warn(`[Gemini:${context}] ⚠️ ${model} Failed (Attempt ${attempt + 1}): ${res.status} - ${msg}`);

                if (res.status === 429 && attempt < 1) { // One retry for rate limit
                    console.log(`[Gemini:${context}] 🔄 Retrying in 2s...`);
                    await new Promise(r => setTimeout(r, 2000));
                    return callWithTimeout(attempt + 1);
                }
                return null;
            }

            const data = await res.json();
            if (data.candidates?.[0]?.finishReason === "SAFETY") {
                console.warn(`[Gemini:${context}] 🛑 Safety block triggered.`);
                return null;
            }

            let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text) return null;

            text = text.trim();
            if (text.startsWith("```")) {
                text = text.replace(/^```[a-z]*\n/i, "").replace(/\n```$/i, "").trim();
            }

            try {
                return JSON.parse(text);
            } catch (jsonErr) {
                console.error(`[Gemini:${context}] 🧱 JSON Parse Failed.`);
                return null;
            }
        } catch (err) {
            clearTimeout(timeoutId);
            if (err.name === 'AbortError') {
                console.warn(`[Gemini:${context}] ⏱️ Request timed out.`);
            } else {
                console.warn(`[Gemini:${context}] � Error: ${err.message}`);
            }
            if (attempt < 1) return callWithTimeout(attempt + 1);
            return null;
        }
    };

    return callWithTimeout();
}
