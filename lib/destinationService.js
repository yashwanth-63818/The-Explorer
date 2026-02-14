import fs from "fs/promises";
import path from "path";
import { ALL_DESTINATIONS } from "./destinationList";
import { getCityImage } from "./cityImages";

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
    let allCities = {};
    try {
        const content = await fs.readFile(EDITORIAL_PATH, "utf-8");
        const allData = JSON.parse(content);
        allCities = allData.cities || {};
    } catch (err) { }

    let bestPlacesMapping = { popular: [], underrated: [] };
    if (ed.placesToVisit) {
        if (Array.isArray(ed.placesToVisit)) {
            bestPlacesMapping.popular = ed.placesToVisit.map(p => {
                const citySlug = p.slug || p.name.toLowerCase().replace(/ /g, '-');
                return {
                    city: p.name,
                    slug: citySlug,
                    description: allCities[citySlug]?.heroDescription || p.summary || `Explore the stunning landscapes and rich heritage of ${p.name}.`,
                    category: "Top Discovery",
                    image: getCityImage(citySlug, p.type || "city")
                };
            });
        } else {
            // New structure with popular and underrated
            bestPlacesMapping.popular = (ed.placesToVisit.popular || []).map(p => {
                const citySlug = p.slug || p.name.toLowerCase().replace(/ /g, '-');
                return {
                    city: p.name,
                    slug: citySlug,
                    description: allCities[citySlug]?.heroDescription || "Discover why this is one of our most popular recommended destinations.",
                    category: "Top Discovery",
                    image: getCityImage(citySlug, p.type || "city")
                };
            });
            bestPlacesMapping.underrated = (ed.placesToVisit.underrated || []).map(p => {
                const citySlug = p.slug || p.name.toLowerCase().replace(/ /g, '-');
                return {
                    city: p.name,
                    slug: citySlug,
                    description: allCities[citySlug]?.heroDescription || "A hidden gem waiting to be discovered away from the main tourist trails.",
                    category: "Hidden Gem",
                    image: getCityImage(citySlug, p.type || "town")
                };
            });
        }
    }

    // Process States/Regions if they exist
    let statesMapping = [];
    if (ed.states && Array.isArray(ed.states)) {
        statesMapping = ed.states.map(s => {
            const stateSlug = s.slug || s.name.toLowerCase().replace(/ /g, '-');
            return {
                name: s.name,
                slug: stateSlug,
                description: allCities[stateSlug]?.heroDescription || s.summary || `Explore the unique culture and landscapes of ${s.name}.`,
                type: s.type || "State",
                image: getCityImage(stateSlug, s.type || "state")
            };
        });
    }

    const countryCode = ALL_DESTINATIONS.find(d =>
        d.name.toLowerCase() === ed.name.toLowerCase() ||
        d.name.toLowerCase().replace(/ /g, '-') === (ed.slug || slug)
    )?.code?.toLowerCase() || "un";

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
            languages: "Local",
            code: countryCode.toUpperCase(),
            flag: `https://flagcdn.com/w320/${countryCode}.png`
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
            states: statesMapping,
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

    console.log(`[CityService] 🏛️ Reading editorial source for destination: "${citySlug}"`);

    try {
        const content = await fs.readFile(EDITORIAL_PATH, "utf-8");
        const allData = JSON.parse(content);

        // 1. Direct lookup in global cities pool
        if (allData.cities && allData.cities[citySlug]) {
            return allData.cities[citySlug];
        }

        // 2. Lookup in state data within countries
        if (allData.countries) {
            for (const countrySlug in allData.countries) {
                const country = allData.countries[countrySlug];
                if (country.states) {
                    const state = country.states.find(s =>
                        s.slug === citySlug ||
                        s.name.toLowerCase().replace(/ /g, '-') === citySlug
                    );
                    if (state) {
                        return {
                            name: state.name,
                            heroDescription: state.summary || `Explore the stunning landscapes and cultural heritage of ${state.name}, ${country.name}.`,
                            whyVisit: [
                                `Discover the unique character and history of ${state.name}.`,
                                `Experience the local traditions and hospitality that define this region.`,
                                `Explore diverse landscapes from natural wonders to historic landmarks.`
                            ],
                            topExperiences: [
                                `Visit key landmarks in ${state.name}`,
                                `Immerse yourself in local culture`,
                                `Discover hidden gems of the region`
                            ],
                            travelTips: [
                                `Check local seasonal advice for visiting ${state.name}.`,
                                `Engage with local guides for an authentic experience.`,
                                `Respect regional customs and traditions.`
                            ],
                            bestTimeToVisit: "Varies by season"
                        };
                    }
                }
            }
        }
    } catch (err) {
        console.warn(`[CityService] Consolidated file error or destination not found, falling back.`);
    }

    // Fallback to legacy individual city files
    const data = await getStoredData("cities", citySlug);
    return data;
}

export async function getDynamicPostData(slug) {
    if (!slug) return null;
    return getCityData(slug);
}
