import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const COMMON_REGIONS = [
    "Africa", "Asia", "Europe", "North America", "South America", "Oceania", "Antarctica",
    "Balkans", "Southeast Asia", "Central Asia", "Nordics", "Patagonia", "Caribbean", "Middle East"
];

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';

    if (!query || query.length < 2) {
        return NextResponse.json([]);
    }

    try {
        const editorialPath = path.join(process.cwd(), "data", "stored", "countries-editorial.json");
        const newEditorialPath = path.join(process.cwd(), "data", "stored", "countries-and-cities-editorial.json");

        let allEditorial = {};

        // Load legacy
        try {
            const editorialContent = await fs.readFile(editorialPath, "utf-8");
            allEditorial = JSON.parse(editorialContent);
        } catch (e) { }

        // Load new and merge
        try {
            const newContent = await fs.readFile(newEditorialPath, "utf-8");
            const newParsed = JSON.parse(newContent);
            if (newParsed.countries) {
                allEditorial = { ...allEditorial, ...newParsed.countries };
            }
        } catch (e) { }

        const results = [];

        // Check for Region matches first
        for (const region of COMMON_REGIONS) {
            if (region.toLowerCase().includes(query)) {
                results.push({
                    type: 'region',
                    name: region,
                    slug: region.toLowerCase().replace(/ /g, '-'),
                    id: `region-${region.toLowerCase()}`
                });
            }
        }

        for (const [slug, data] of Object.entries(allEditorial)) {
            // Check country name
            if (data.name.toLowerCase().includes(query)) {
                results.push({
                    type: 'country',
                    name: data.name,
                    slug: slug,
                    region: data.region,
                    id: slug
                });
            }

            // Check cities (placesToVisit)
            if (data.placesToVisit) {
                const placesArr = Array.isArray(data.placesToVisit)
                    ? data.placesToVisit
                    : [...(data.placesToVisit.popular || []), ...(data.placesToVisit.underrated || [])];

                for (const place of placesArr) {
                    if (place.name.toLowerCase().includes(query)) {
                        results.push({
                            type: 'city',
                            name: place.name,
                            countryName: data.name,
                            countrySlug: slug,
                            id: `${slug}-${place.name.toLowerCase().replace(/ /g, '-')}`
                        });
                    }
                }
            }
        }

        // Remove exact duplicates and limit
        const seen = new Set();
        const uniqueResults = results.filter(item => {
            const key = `${item.type}-${item.name}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        }).slice(0, 10);

        return NextResponse.json(uniqueResults);
    } catch (error) {
        console.error("Search API Error:", error);
        return NextResponse.json({ error: "Failed to search" }, { status: 500 });
    }
}
