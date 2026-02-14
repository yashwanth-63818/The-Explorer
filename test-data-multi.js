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

        ['thailand', 'india', 'japan'].forEach(slug => {
            const ed = countriesData[slug];
            console.log(`--- ${slug} ---`);
            if (!ed) {
                console.log('Not found');
                return;
            }
            console.log('States length:', ed.states?.length || 0);
        });
    } catch (err) {
        console.error(err);
    }
}

testFetch();
