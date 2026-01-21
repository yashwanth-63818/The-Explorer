import fs from "fs/promises";
import path from "path";

// ------------------------------------------------------------------
// CONFIG & CONSTANTS
// ------------------------------------------------------------------
const STORED_ROOT = path.join(process.cwd(), "data", "stored");
const EDITORIAL_PATH = path.join(STORED_ROOT, "countries-editorial.json");

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
    const lookupSlug = countryName.toLowerCase().replace(/[^a-z0-9]/g, '');

    console.log(`[CountryService] 🏛️ Reading single-source-of-truth: "${slug}" (lookup: "${lookupSlug}")`);

    // Load the consolidated editorial file
    let allEditorial;
    try {
        const editorialPath = path.join(STORED_ROOT, "countries-editorial.json");
        const editorialContent = await fs.readFile(editorialPath, "utf-8");
        allEditorial = JSON.parse(editorialContent);
    } catch (err) {
        console.error(`[CRITICAL] Failed to read ${EDITORIAL_PATH}`);
        throw new Error(`System Error: Country data source missing.`);
    }

    // Lookup by lookupSlug
    const ed = allEditorial[lookupSlug];

    if (!ed) {
        console.error(`[CRITICAL] Country slug "${lookupSlug}" not found in countries-editorial.json`);
        throw new Error(`Content Error: Country "${countryName}" (${lookupSlug}) is not supported in the static database.`);
    }

    // Map the editorial format to the application's destination format
    const data = {
        slug,
        name: ed.name,
        facts: {
            officialName: ed.name,
            capital: "Information Center",
            region: ed.region || "World",
            subregion: "Global",
            population: "Varies",
            currency: "Local",
            flag: `https://flagcdn.com/w320/${slug === 'usa' ? 'us' : slug.slice(0, 2)}.png`,
            languages: "Local",
            code: "UN"
        },
        images: [
            {
                url: ed.heroImage?.src || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800",
                alt: ed.heroImage?.alt || ed.name,
                author: "The Explorer Editorial",
                link: "#"
            },
            ...(ed.placesToVisit || []).map(p => ({
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
            bestPlaces: (ed.placesToVisit || []).map(p => ({
                city: p.name,
                reason: p.summary,
                category: "Highlight"
            })),
            thingsToDo: (ed.placesToVisit || []).map(p => p.name),
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
export async function getDynamicPostData(slug) {
    if (!slug) return null;

    console.log(`[PostService] 🏛️ Reading permanent storage for: "${slug}"`);

    // Blog posts (cities) remain as individual static JSON files in /data/stored/cities/
    const data = await getStoredData("cities", slug);

    if (!data) {
        console.error(`[CRITICAL] Post data for "${slug}" is not in /data/stored/cities/.`);
        return null;
    }

    return data;
}
