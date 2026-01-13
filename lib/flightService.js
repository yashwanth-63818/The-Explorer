
/**
 * Flight Service to handle fetching and normalizing flight data from Travelpayouts and Kiwi.
 */

const TRAVELPAYOUTS_API_KEY = process.env.TRAVELPAYOUTS_API_KEY;
const TRAVELPAYOUTS_MARKER_ID = process.env.TRAVELPAYOUTS_MARKER_ID;
const KIWI_API_KEY = process.env.KIWI_API_KEY;

/**
 * Main search function that calls multiple APIs in parallel.
 */
export async function searchFlights({ from, to, departureDate, returnDate, passengers = 1, cabinClass = 'economy' }) {
    console.log(`[FlightService] Searching for flights: ${from} -> ${to}, ${departureDate} (${cabinClass})`);

    // Call APIs in parallel
    const results = await Promise.allSettled([
        fetchTravelpayoutsFlights({ from, to, departureDate, returnDate, passengers, cabinClass }),
        fetchKiwiFlights({ from, to, departureDate, returnDate, passengers, cabinClass })
    ]);

    // Extract successful results
    let allFlights = results
        .filter(res => res.status === 'fulfilled')
        .flatMap(res => res.value);

    // If no results (maybe keys missing), return mock data for development
    if (allFlights.length === 0 && (!TRAVELPAYOUTS_API_KEY || !KIWI_API_KEY)) {
        console.log("[FlightService] Using mock data for preview (API keys missing)");
        allFlights = getMockFlights(from, to, departureDate);
    }

    if (allFlights.length === 0) {
        console.warn("[FlightService] No flights found from any API.");
        return [];
    }

    // Merge and Normalize
    // 1. Remove duplicates (basic logic: same airline, price, and duration)
    const seen = new Set();
    const uniqueFlights = allFlights.filter(flight => {
        const key = `${flight.airline}-${flight.price}-${flight.duration}-${flight.stops}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    // 2. Sort by price
    uniqueFlights.sort((a, b) => a.price - b.price);

    // 3. Mark cheapest as bestDeal
    if (uniqueFlights.length > 0) {
        uniqueFlights[0].bestDeal = true;
    }

    return uniqueFlights;
}

/**
 * Travelpayouts API Implementation
 * Using the Flight Prices Search API (v1/v2/v3 depends on what's available)
 * For this implementation, we'll use the "Prices for Dates" API which is commonly used for search results.
 */
async function fetchTravelpayoutsFlights({ from, to, departureDate, returnDate, passengers, cabinClass }) {
    if (!TRAVELPAYOUTS_API_KEY || !TRAVELPAYOUTS_MARKER_ID) {
        console.error("[FlightService] Travelpayouts API key or Marker ID missing.");
        return [];
    }

    try {
        // Travelpayouts Price Search API (Simplified for this use case)
        // https://api.travelpayouts.com/aviasales/v3/prices_for_dates
        const url = new URL("https://api.travelpayouts.com/aviasales/v3/prices_for_dates");
        url.searchParams.append("origin", from);
        url.searchParams.append("destination", to);
        url.searchParams.append("departure_at", departureDate);
        if (returnDate) url.searchParams.append("return_at", returnDate);
        url.searchParams.append("unique", "false");
        url.searchParams.append("sorting", "price");
        url.searchParams.append("direct", "false");
        url.searchParams.append("currency", "usd");
        url.searchParams.append("limit", "30");
        url.searchParams.append("token", TRAVELPAYOUTS_API_KEY);

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: { 'Accept-Encoding': 'gzip, deflate' }
        });

        if (!response.ok) {
            throw new Error(`Travelpayouts API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success || !data.data) return [];

        return data.data.map(item => ({
            provider: "Travelpayouts",
            airline: item.airline || "Multiple Airlines",
            price: item.price,
            currency: "USD",
            duration: formatDuration(item.duration),
            stops: item.transfers || 0,
            deepLink: `https://tp.media/r?marker=${TRAVELPAYOUTS_MARKER_ID}&p=4114&u=https%3A%2F%2Fwww.aviasales.com%2Fsearch%2F${from}${departureDate.replace(/-/g, '')}${to}${passengers}${cabinClass === 'business' ? 'B' : ''}`,
            bestDeal: false
        }));
    } catch (error) {
        console.error("[FlightService] Travelpayouts fetch failed:", error.message);
        return [];
    }
}

/**
 * Kiwi (Tequila) API Implementation
 */
async function fetchKiwiFlights({ from, to, departureDate, returnDate, passengers, cabinClass }) {
    if (!KIWI_API_KEY) {
        console.warn("[FlightService] Kiwi API key missing.");
        return [];
    }

    try {
        // Kiwi Tequila Search API
        // https://tequila-api.kiwi.com/v2/search
        const url = new URL("https://tequila-api.kiwi.com/v2/search");
        url.searchParams.append("fly_from", from);
        url.searchParams.append("fly_to", to);
        url.searchParams.append("date_from", formatDateKiwi(departureDate));
        url.searchParams.append("date_to", formatDateKiwi(departureDate));
        if (returnDate) {
            url.searchParams.append("return_from", formatDateKiwi(returnDate));
            url.searchParams.append("return_to", formatDateKiwi(returnDate));
        }
        url.searchParams.append("adults", passengers);
        url.searchParams.append("selected_cabins", cabinClass === 'business' ? 'C' : 'M');
        url.searchParams.append("curr", "USD");
        url.searchParams.append("limit", "30");

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'apikey': KIWI_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Kiwi API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.data) return [];

        return data.data.map(item => ({
            provider: "Kiwi.com",
            airline: item.airlines?.[0] || "Multiple Airlines",
            price: item.price,
            currency: "USD",
            duration: formatDuration(item.duration?.total / 60), // Kiwi returns seconds
            stops: item.route ? (item.route.length - 1) : 0,
            deepLink: item.deep_link,
            bestDeal: false
        }));
    } catch (error) {
        console.error("[FlightService] Kiwi fetch failed:", error.message);
        return [];
    }
}

/**
 * Utility: Convert seconds/minutes to "XH YM" format
 */
function formatDuration(minutes) {
    if (!minutes) return "N/A";
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    if (h === 0) return `${m}m`;
    return `${h}h ${m}m`;
}

/**
 * Utility: Format date for Kiwi API (DD/MM/YYYY)
 */
function formatDateKiwi(dateStr) {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
}

/**
 * Utility: Mock flights for preview
 */
function getMockFlights(from, to, date) {
    const airlines = ["Emirates", "Lufthansa", "Qatar Airways", "Delta", "United", "Singapore Airlines"];
    const providers = ["Skyscanner", "Kiwi.com", "Travelpayouts"];

    return Array.from({ length: 8 }).map((_, i) => ({
        provider: providers[i % providers.length],
        airline: airlines[i % airlines.length],
        price: 400 + Math.floor(Math.random() * 800),
        currency: "USD",
        duration: `${5 + i}h ${15 + (i * 10)}m`,
        stops: i % 3,
        deepLink: "https://www.example.com/flight-deal",
        bestDeal: false
    }));
}

