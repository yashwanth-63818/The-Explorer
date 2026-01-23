import fs from "fs/promises";
import path from "path";

// ------------------------------------------------------------------
// CONFIG & CONSTANTS
// ------------------------------------------------------------------
const STORED_ROOT = path.join(process.cwd(), "data", "stored");
const EDITORIAL_PATH = path.join(STORED_ROOT, "countries-and-cities-editorial.json");
const FALLBACK_PATH = path.join(STORED_ROOT, "countries-editorial.json");

/**
 * Loads data from permanent local storage.
 */
async function getStoredData(type, slug) {
    try {
        const filePath = path.join(STORED_ROOT, type, `${slug}.json`);
        const data = await fs.readFile(filePath, "utf-8");
        return JSON.parse(data);
    } catch (err) {
        return null;
    }
}

// ------------------------------------------------------------------
// 1. COUNTRY DATA SERVICE
// ------------------------------------------------------------------
export async function getDynamicDestinationData(countryName) {
    if (!countryName) return null;

    const slug = countryName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
    const cleanSlug = countryName.toLowerCase().replace(/[^a-z0-9]/g, '');

    console.log(`[CountryService] 🏛️ Searching editorial sources for: "${slug}"`);

    let countriesData = {};
    let isNewFormat = false;

    // 1. Try to load new consolidated data
    try {
        const content = await fs.readFile(EDITORIAL_PATH, "utf-8");
        const allData = JSON.parse(content);
        countriesData = allData.countries || {};
    } catch (err) {
        console.warn(`[CountryService] Consolidated editorial file not found or invalid.`);
    }

    // 2. Lookup in new data
    let ed = countriesData[slug] || countriesData[cleanSlug];
    if (!ed) {
        const keys = Object.keys(countriesData);
        const fuzzyKey = keys.find(k => k.replace(/-/g, '') === cleanSlug);
        if (fuzzyKey) ed = countriesData[fuzzyKey];
    }

    if (ed) isNewFormat = true;

    // 3. If not found, try legacy data
    if (!ed) {
        try {
            const legacyContent = await fs.readFile(FALLBACK_PATH, "utf-8");
            const legacyData = JSON.parse(legacyContent);

            ed = legacyData[slug] || legacyData[cleanSlug];
            if (!ed) {
                const keys = Object.keys(legacyData);
                // Try fuzzy match or partial match
                const fuzzyKey = keys.find(k =>
                    k.replace(/-/g, '') === cleanSlug ||
                    k.includes(slug) ||
                    slug.includes(k)
                );
                if (fuzzyKey) ed = legacyData[fuzzyKey];
            }
        } catch (err) {
            console.warn(`[CountryService] Legacy editorial file not found or invalid.`);
        }
    }

    if (!ed) {
        console.warn(`[CountryService] Country "${countryName}" not found in any source.`);
        return null; // Return null instead of throwing
    }

    // Map best places from the new structure (popular + underrated)
    let bestPlacesMapping = { popular: [], underrated: [] };
    if (ed.placesToVisit) {
        if (Array.isArray(ed.placesToVisit)) {
            bestPlacesMapping.popular = ed.placesToVisit.map(p => ({
                city: p.name,
                slug: p.slug || p.name.toLowerCase().replace(/ /g, '-'),
                reason: p.summary || "Highlight",
                category: "Popular"
            }));
        } else {
            // New structure with popular and underrated
            bestPlacesMapping.popular = (ed.placesToVisit.popular || []).map(p => ({
                city: p.name,
                slug: p.slug || p.name.toLowerCase().replace(/ /g, '-'),
                reason: "Popular Destination",
                category: "Popular"
            }));
            bestPlacesMapping.underrated = (ed.placesToVisit.underrated || []).map(p => ({
                city: p.name,
                slug: p.slug || p.name.toLowerCase().replace(/ /g, '-'),
                reason: "Hidden Gem",
                category: "Underrated"
            }));
        }
    }

    // 4. Map the editorial format to the application's destination format
    const data = {
        slug: ed.slug || slug,
        name: ed.name,
        facts: {
            officialName: ed.name,
            capital: "Information Center",
            region: ed.region || "World",
            subregion: "Global",
            population: "Varies",
            currency: "Local",
            flag: `https://flagcdn.com/w320/${(ed.slug || slug) === 'usa' ? 'us' : (ed.slug || slug).slice(0, 2)}.png`,
            languages: "Local",
            code: "UN"
        },
        images: [
            {
                url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800",
                alt: ed.name,
                author: "The Explorer Editorial",
                link: "#"
            },
            ...(Array.isArray(ed.placesToVisit) ? ed.placesToVisit : [...(ed.placesToVisit?.popular || []), ...(ed.placesToVisit?.underrated || [])]).map(p => ({
                url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800",
                alt: p.name,
                author: "Editorial",
                link: "#"
            }))
        ],
        content: {
            tagline: `Discover the Soul of ${ed.name}`,
            intro: ed.heroDescription,
            whyVisit: ed.heroDescription,
            bestPlaces: bestPlacesMapping,
            thingsToDo: [...bestPlacesMapping.popular, ...bestPlacesMapping.underrated].map(p => p.city),
            blogPosts: [],
            sections: {
                transport: ed.travelTips?.[1] || "Local rail and bus networks.",
                budget: ed.travelTips?.[0] || "Moderate daily costs apply.",
                bestTime: ed.travelTips?.[2] || "Spring and Autumn.",
                stay: "A variety of hotels and boutique stays."
            }
        }
    };

    return data;
}

// ------------------------------------------------------------------
// 2. CITY / POST DATA SERVICE
// ------------------------------------------------------------------
export async function getCityData(citySlug) {
    if (!citySlug) return null;

    console.log(`[CityService] 🏛️ Reading editorial source for city: "${citySlug}"`);

    try {
        const content = await fs.readFile(EDITORIAL_PATH, "utf-8");
        const allData = JSON.parse(content);
        if (allData.cities && allData.cities[citySlug]) {
            return allData.cities[citySlug];
        }
    } catch (err) {
        console.warn(`[CityService] Consolidated file error or city not found, falling back.`);
    }

    // Fallback to legacy individual city files
    const data = await getStoredData("cities", citySlug);
    return data;
}

export async function getDynamicPostData(slug) {
    if (!slug) return null;
    return getCityData(slug);
}
