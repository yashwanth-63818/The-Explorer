const fs = require('fs');
const path = require('path');

const STORED_ROOT = path.join(process.cwd(), 'data', 'stored');
const EDITORIAL_PATH = path.join(STORED_ROOT, 'countries-and-cities-editorial.json');

async function testFetch() {
    try {
        const content = fs.readFileSync(EDITORIAL_PATH, 'utf-8');
        const allData = JSON.parse(content);
        const countriesData = allData.countries || {};
        const allCities = allData.cities || {};

        const ed = countriesData['india'];
        if (!ed) {
            console.log('India not found in countries');
            return;
        }

        console.log('India name:', ed.name);
        console.log('States array length:', ed.states?.length);

        let statesMapping = [];
        if (ed.states && Array.isArray(ed.states)) {
            statesMapping = ed.states.map(s => {
                const stateSlug = s.slug || s.name.toLowerCase().replace(/ /g, '-');
                return {
                    name: s.name,
                    slug: stateSlug,
                    description: allCities[stateSlug]?.heroDescription || s.summary || `Explore the unique culture and landscapes of ${s.name}.`,
                    type: s.type || "State"
                };
            });
        }

        console.log('States Mapping length:', statesMapping.length);
        console.log('First 3 states:', statesMapping.slice(0, 3));
    } catch (err) {
        console.error(err);
    }
}

testFetch();
