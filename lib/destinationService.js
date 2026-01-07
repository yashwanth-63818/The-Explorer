import { getCache, setCache } from "./cacheService";
import { destinations as editorialData } from "./destinationData";

// ------------------------------------------------------------------
// CONFIG & CONSTANTS
// ------------------------------------------------------------------
const REST_COUNTRIES_URL = "https://restcountries.com/v3.1/name";
const UNSPLASH_API_URL = "https://api.unsplash.com/search/photos";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent";

const AI_TIMEOUT_MS = 6000; // Strict 6s timeout as per requirements

// ------------------------------------------------------------------
// 1. COUNTRY DATA SERVICE
// ------------------------------------------------------------------
const pendingRequests = new Map();

export async function getDynamicDestinationData(countryName) {
    if (!countryName) return null;
    const slug = countryName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');

    // Deduplicate concurrent requests
    if (pendingRequests.has(slug)) return pendingRequests.get(slug);

    const promise = (async () => {
        const geminiKey = (process.env.GEMINI_API_KEY || "").trim().replace(/^["']|["']$/g, '');
        const unsplashKey = (process.env.UNSPLASH_ACCESS_KEY || "").trim().replace(/^["']|["']$/g, '');

        // 1. Check Full Cache (ISR-like check)
        const cachedData = await getCache("countries", slug);
        if (cachedData) {
            console.log(`[CountryService] ⚡ Cache HIT for ${slug}`);
            return cachedData;
        }

        console.log(`[CountryService] 🚀 Cache MISS. Processing: "${countryName}"`);

        // 2. Fetch Facts & Images in Parallel
        const [facts, images] = await Promise.all([
            fetchCountryFacts(countryName),
            fetchCountryImages(countryName, unsplashKey),
        ]);

        // 3. Editorial Fallback check (before AI)
        let content = null;
        if (editorialData[slug]) {
            const ed = editorialData[slug];
            content = {
                tagline: ed.tagline || `Discover ${countryName}`,
                intro: ed.intro,
                whyVisit: ed.intro,
                bestPlaces: (ed.bestPlaces || []).map(p => ({ city: p.title, reason: "Must visit." })),
                blogPosts: (ed.bestPlaces || []).map(p => ({
                    title: `The Ultimate ${p.title} Travel Guide`,
                    slug: `${p.title.toLowerCase().replace(/ /g, '-')}-${slug}-things-to-do-backpacking`,
                    author: "Editorial",
                    date: "Jan 07, 2026"
                })),
                thingsToDo: ed.thingsToDo || [],
                sections: {
                    transport: ed.travelTips?.transport || "Local rail/bus.",
                    budget: ed.travelTips?.currency || "Moderate.",
                    bestTime: ed.travelTips?.bestTime || "Spring/Autumn.",
                    stay: "Hotels & Hostels."
                }
            };
        }

        // 4. Gemini AI Enhancement (Optional, with strict timeout)
        if (!content && geminiKey) {
            content = await fetchCountryAIContent(countryName, geminiKey);
            if (content?.blogPosts) {
                // Generate real slugs for AI blog posts
                content.blogPosts = content.blogPosts.map(post => {
                    const city = post.title.split(' ')[0] || "guide";
                    return {
                        ...post,
                        slug: `${city.toLowerCase().replace(/ /g, '-')}-${slug}-things-to-do-backpacking`
                    };
                });
            }
        }

        // 5. Final Safety Catch
        if (!content) {
            content = {
                tagline: `Exploring ${countryName}`,
                intro: `${countryName} is a beautiful destination.`,
                bestPlaces: [{ city: facts.capital, reason: "The capital.", category: "Mandatory" }],
                blogPosts: [],
                sections: { transport: "Local bus.", budget: "Varies.", bestTime: "Anytime.", stay: "Booking.com" }
            };
        }

        const result = {
            slug,
            name: countryName,
            facts,
            images,
            content,
            updatedAt: new Date().toISOString()
        };

        // 6. Save to Cache
        await setCache("countries", slug, result);
        return result;
    })();

    pendingRequests.set(slug, promise);
    try {
        return await promise;
    } finally {
        pendingRequests.delete(slug);
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
    if (pendingRequests.has(slug)) return pendingRequests.get(slug);

    const promise = (async () => {
        // Expected format: [city]-[country]-things-to-do-backpacking
        const parts = slug.split("-");
        const thingsIndex = parts.indexOf("things");

        // Fallback parsing for other slug patterns
        const guideIndex = parts.indexOf("travel");
        const splitIndex = thingsIndex !== -1 ? thingsIndex : (guideIndex !== -1 ? guideIndex : (parts.length > 2 ? parts.length - 2 : 1));

        const cityParts = parts.slice(0, splitIndex - 1);
        const countryPart = parts[splitIndex - 1];

        const cityName = cityParts.join(" ") || parts[0];
        const countryName = countryPart || parts[1];

        // 1. Check Post Cache
        const cachedPost = await getCache("posts", slug);
        if (cachedPost) return cachedPost;

        const geminiKey = (process.env.GEMINI_API_KEY || "").trim();
        const unsplashKey = (process.env.UNSPLASH_ACCESS_KEY || "").trim();

        // 2. Parallel Fetch with strict timeout
        const [imagesResult, content] = await Promise.all([
            fetchCityImages(cityName, countryName, unsplashKey),
            fetchCityAIContent(cityName, countryName, geminiKey)
        ]);

        if (!content) return null;

        // Calculate reading time based on content length
        const wordCount = JSON.stringify(content).split(/\s+/).length;
        content.readingTime = `${Math.max(5, Math.ceil(wordCount / 225))} Min Read`;
        content.publishedAt = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

        const result = {
            slug,
            cityName,
            countryName,
            images: imagesResult,
            content
        };

        await setCache("posts", slug, result);
        return result;
    })();

    pendingRequests.set(slug, promise);
    try {
        return await promise;
    } finally {
        pendingRequests.delete(slug);
    }
}

const normalizationMap = {
    "usa": "United States of America",
    "us": "United States of America",
    "united states": "United States of America",
    "uk": "United Kingdom",
    "britain": "United Kingdom",
    "uae": "United Arab Emirates",
    "dubai": "United Arab Emirates",
    "netherlands": "Netherlands",
    "holland": "Netherlands",
    "czechia": "Czech Republic",
    "czech": "Czech Republic",
};

// ------------------------------------------------------------------
// HELPER: REST COUNTRIES
// ------------------------------------------------------------------
async function fetchCountryFacts(countryName) {
    const normalizedName = normalizationMap[countryName.toLowerCase()] || countryName;
    const encodedName = encodeURIComponent(normalizedName);

    // Primary attempt: Full text match (as requested by architect)
    const url = `${REST_COUNTRIES_URL}/${encodedName}?fullText=true&fields=name,capital,currencies,population,region,subregion,flags,languages,cca2`;

    try {
        let res = await fetch(url);

        if (!res.ok) {
            console.warn(`[CountryService] REST Countries (FullText) failed for ${countryName}. Status: ${res.status}`);
            const searchUrl = `${REST_COUNTRIES_URL}/${encodedName}?fields=name,capital,currencies,population,region,subregion,flags,languages,cca2`;
            res = await fetch(searchUrl);
        }

        if (!res.ok) {
            const parts = countryName.split(" ");
            const lastUrl = `${REST_COUNTRIES_URL}/${encodeURIComponent(parts[0])}?fields=name,capital,currencies,population,region,subregion,flags,languages,cca2`;
            res = await fetch(lastUrl);
        }

        if (!res.ok) throw new Error(`REST Countries API Final Failure: ${res.status}`);

        const data = await res.json();
        const bestMatch = Array.isArray(data) ? data[0] : data;
        return processFacts(bestMatch);
    } catch (err) {
        console.error(`[CountryService] Fact Fetch Error for ${countryName}:`, {
            message: err.message,
            stack: err.stack,
            cause: err.cause
        });
        return getFallbackFacts(countryName);
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
    if (!apiKey) {
        console.warn("[CountryService] Unsplash API key missing.");
        return [];
    }
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
                headers: {
                    Authorization: `Client-ID ${apiKey}`,
                    "User-Agent": "TravelSeeker/1.0"
                }
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

        console.log(`[CountryService] Fetched ${uniqueImages.length} images for ${countryName}`);
        return uniqueImages.length > 0 ? uniqueImages : [];
    } catch (err) {
        console.error(`[CountryService] Image Fetch Error for ${countryName}:`, err.message);
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
                headers: {
                    Authorization: `Client-ID ${apiKey}`,
                    "User-Agent": "TravelSeeker/1.0"
                }
            }).then(r => r.ok ? r.json() : { results: [] })
        ));

        const images = results.flatMap(r => r.results).map(img => ({
            url: img.urls.regular,
            alt: img.alt_description || cityName,
            author: img.user.name
        })).sort(() => Math.random() - 0.5);

        console.log(`[CityService] Fetched ${images.length} images for ${cityName}`);
        return images;
    } catch (err) {
        console.error(`[CityService] Image Fetch Error for ${cityName}:`, err.message);
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
  },
  "sections": {
    "transport": "Detailed advice on how to get around the country, mentioning specific transport modes.",
    "budget": "Daily budget breakdown in USD and local currency for different traveler types.",
    "bestTime": "Best months to visit and why, mentioning weather and events.",
    "stay": "Best areas and types of accommodation to stay in."
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
    // Using a more robust model name
    const model = "gemini-1.5-flash-latest";
    const maskKey = apiKey ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` : "MISSING";
    console.log(`[Gemini:${context}] 🛰️ Calling ${model} (Key: ${maskKey})`);

    const callWithTimeout = async (attempt = 0) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

        try {
            const url = `${GEMINI_API_URL}?key=${apiKey}`;
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": "TravelSeeker/1.0"
                },
                signal: controller.signal,
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        // responseMimeType is v1beta only, removing for v1 stability
                        temperature: 0.7,
                        maxOutputTokens: 2500,
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

                // Retry on Rate Limit (429) or Server Errors (500, 503, 504)
                if ((res.status === 429 || res.status >= 500) && attempt < 1) {
                    const delay = 2000;
                    console.log(`[Gemini:${context}] 🔄 Retrying in ${delay / 1000}s...`);
                    await new Promise(r => setTimeout(r, delay));
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
            // Clean markdown if AI wrapped it
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
                console.warn(`[Gemini:${context}] ⏱️ Request timed out. Attempt ${attempt + 1}.`);
            } else {
                console.warn(`[Gemini:${context}] ❌ Error: ${err.message}`, {
                    cause: err.cause,
                    context: context
                });
            }
            if (attempt < 1) return callWithTimeout(attempt + 1);
            return null;
        }
    };

    return callWithTimeout();
}
