import { NextResponse } from 'next/server';

const AMADEUS_BASE_URL = "https://test.api.amadeus.com";

let amadeusToken = null;
let amadeusTokenExpiry = 0;

async function getAmadeusToken() {
    const clientId = process.env.NEXT_PUBLIC_AMADEUS_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_AMADEUS_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        console.error("Amadeus Auth Error: Missing API keys in environment variables.");
        return null;
    }

    if (amadeusToken && Date.now() < amadeusTokenExpiry) {
        return amadeusToken;
    }

    try {
        console.log("Fetching new Amadeus token...");
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');
        params.append('client_id', clientId);
        params.append('client_secret', clientSecret);

        const response = await fetch(`${AMADEUS_BASE_URL}/v1/security/oauth2/token`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params.toString(),
            cache: 'no-store'
        });

        const data = await response.json();
        if (data.access_token) {
            console.log("Amadeus token refreshed successfully.");
            amadeusToken = data.access_token;
            amadeusTokenExpiry = Date.now() + (data.expires_in * 1000) - 60000;
            return amadeusToken;
        } else {
            console.error("Amadeus Auth Response Error:", data);
            return null;
        }
    } catch (error) {
        console.error("Amadeus Token Fetch Exception:", error);
        return null;
    }
}

async function resolveToIata(keyword, token) {
    if (!keyword) return null;
    // If it's already a 3-letter code, return it
    if (keyword.length === 3 && /^[A-Z]{3}$/.test(keyword.toUpperCase())) {
        return keyword.toUpperCase();
    }

    try {
        const response = await fetch(
            `${AMADEUS_BASE_URL}/v1/reference-data/locations?subType=CITY,AIRPORT&keyword=${keyword.toUpperCase()}&page[limit]=1`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();
        if (data.data && data.data.length > 0) {
            return data.data[0].iataCode;
        }
        return null;
    } catch (error) {
        console.error("IATA Resolution Error:", error);
        return null;
    }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    let origin = searchParams.get('origin');
    let destination = searchParams.get('destination');
    const date = searchParams.get('date');
    const returnDate = searchParams.get('returnDate');
    const passengers = searchParams.get('passengers') || '1';

    if (!origin || !destination || !date) {
        return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const token = await getAmadeusToken();
    if (!token) {
        return NextResponse.json({ error: "Failed to authenticate with Amadeus" }, { status: 500 });
    }

    // Proactively resolve full names to IATA codes if needed
    const [resolvedOrigin, resolvedDestination] = await Promise.all([
        resolveToIata(origin, token),
        resolveToIata(destination, token)
    ]);

    if (!resolvedOrigin || !resolvedDestination) {
        return NextResponse.json({
            error: `Resolution failed for: ${!resolvedOrigin ? origin : destination}. Please select from the dropdown suggestions or try major international hubs (MAD, PAR, NYC) supported by the test sandbox.`,
            isResolutionError: true
        }, { status: 400 });
    }

    try {
        const returnParam = returnDate ? `&returnDate=${returnDate}` : '';
        const response = await fetch(
            `${AMADEUS_BASE_URL}/v2/shopping/flight-offers?originLocationCode=${resolvedOrigin}&destinationLocationCode=${resolvedDestination}&departureDate=${date}${returnParam}&adults=${passengers}&max=15&currencyCode=INR`,
            {
                headers: { Authorization: `Bearer ${token}` },
                cache: 'no-store'
            }
        );
        const data = await response.json();

        if (data.errors) {
            // Simplify Amadeus error messages for the user
            const detail = data.errors[0]?.detail || "No flights available for this route.";
            return NextResponse.json({ error: detail }, { status: 400 });
        }

        if (!data.data || data.data.length === 0) {
            return NextResponse.json({
                data: [],
                message: "No flights found. Pro tip: Amadeus test environment works best with major routes like MAD to PAR."
            });
        }

        const carriers = data.dictionaries?.carriers || {};

        const results = data.data.map(offer => {
            const firstItinerary = offer.itineraries[0];
            const firstSegment = firstItinerary.segments[0];
            const lastSegment = firstItinerary.segments[firstItinerary.segments.length - 1];

            const carrierCode = firstSegment.carrierCode;
            const airlineName = carriers[carrierCode] || carrierCode;

            const depTime = firstSegment.departure.at
                ? new Date(firstSegment.departure.at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })
                : "--:--";
            const arrTime = lastSegment.arrival.at
                ? new Date(lastSegment.arrival.at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })
                : "--:--";

            const durationRaw = firstItinerary.duration;
            const duration = durationRaw
                .replace('PT', '')
                .replace('H', 'h ')
                .replace('M', 'm')
                .toLowerCase();

            // Construct Skyscanner Booking URL with carrier filtering for precision
            const depDateCode = date.replace(/-/g, '').slice(2);
            const retDateCode = returnDate ? `/${returnDate.replace(/-/g, '').slice(2)}` : '';
            // Adding carriers filter makes it direct to the specific airline's results
            const bookingUrl = `https://www.skyscanner.co.in/transport/flights/${resolvedOrigin}/${resolvedDestination}/${depDateCode}${retDateCode}/?adults=${passengers}&carriers=${carrierCode}`;

            return {
                id: `amadeus-${offer.id}`,
                airline: airlineName,
                carrierCode: carrierCode,
                price: Math.floor(parseFloat(offer.price.total)),
                logo: `https://www.skyscanner.net/images/airlines/favicon/${carrierCode}.png`,
                depTime,
                arrTime,
                duration,
                stops: firstItinerary.segments.length > 1 ? `${firstItinerary.segments.length - 1} stop` : "Direct",
                stopCities: firstItinerary.segments.length > 1
                    ? firstItinerary.segments.slice(0, -1).map(s => s.arrival.iataCode).join(', ')
                    : "",
                url: bookingUrl,
                skyscannerUrl: bookingUrl, // Redundancy for frontend
                platform: "Skyscanner",
                date: date
            };
        });

        return NextResponse.json({ data: results });
    } catch (error) {
        console.error("Amadeus Search Error:", error);
        return NextResponse.json({ error: "Failed to fetch flight data" }, { status: 500 });
    }
}
