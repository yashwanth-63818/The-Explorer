import { NextResponse } from 'next/server';

const AMADEUS_BASE_URL = "https://test.api.amadeus.com";

let amadeusToken = null;
let amadeusTokenExpiry = 0;

async function getAmadeusToken() {
    const clientId = process.env.NEXT_PUBLIC_AMADEUS_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_AMADEUS_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        console.error("Amadeus Auth Error: Missing API keys in environment variables (Locations API).");
        return null;
    }

    if (amadeusToken && Date.now() < amadeusTokenExpiry) {
        return amadeusToken;
    }

    try {
        console.log("Fetching new Amadeus token (Locations API)...");
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
            console.log("Amadeus token refreshed (Locations API).");
            amadeusToken = data.access_token;
            amadeusTokenExpiry = Date.now() + (data.expires_in * 1000) - 60000;
            return amadeusToken;
        } else {
            console.error("Amadeus Auth Response Error (Locations API):", data);
            return null;
        }
    } catch (error) {
        console.error("Amadeus Token Fetch Exception (Locations API):", error);
        return null;
    }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');

    if (!keyword || keyword.length < 2) {
        return NextResponse.json({ data: [] });
    }

    const token = await getAmadeusToken();
    if (!token) {
        return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
    }

    try {
        // Search for both AIRPORT and CITY
        const response = await fetch(
            `${AMADEUS_BASE_URL}/v1/reference-data/locations?subType=CITY,AIRPORT&keyword=${keyword.toUpperCase()}&page[limit]=10`,
            {
                headers: { Authorization: `Bearer ${token}` },
                cache: 'no-store'
            }
        );
        const data = await response.json();

        if (data.errors) {
            return NextResponse.json({ error: data.errors[0].detail }, { status: 400 });
        }

        const results = (data.data || []).map(loc => ({
            name: loc.name,
            detailedName: loc.detailedName,
            iataCode: loc.iataCode,
            subType: loc.subType,
            cityName: loc.address.cityName,
            countryName: loc.address.countryName
        }));

        return NextResponse.json({ data: results });
    } catch (error) {
        console.error("Location Search Error:", error);
        return NextResponse.json({ error: "Failed to search locations" }, { status: 500 });
    }
}
