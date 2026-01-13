
import { NextResponse } from 'next/server';
import { searchFlights } from '@/lib/flightService';

/**
 * GET /api/flights
 * Query Params: from, to, departureDate, returnDate, passengers, cabinClass
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const from = searchParams.get('from');
        const to = searchParams.get('to');
        const departureDate = searchParams.get('departureDate');
        const returnDate = searchParams.get('returnDate');
        const passengers = parseInt(searchParams.get('passengers') || '1');
        const cabinClass = searchParams.get('cabinClass') || 'economy';

        // Validation
        if (!from || !to || !departureDate) {
            return NextResponse.json({ error: "Missing required fields: from, to, departureDate" }, { status: 400 });
        }

        // Fetch flights from service
        const flights = await searchFlights({
            from: from.toUpperCase(),
            to: to.toUpperCase(),
            departureDate,
            returnDate,
            passengers,
            cabinClass
        });

        return NextResponse.json({
            success: true,
            results: flights,
            count: flights.length,
            metadata: {
                from,
                to,
                departureDate,
                returnDate,
                passengers,
                cabinClass
            }
        });

    } catch (error) {
        console.error("[API:Flights] Error searching flights:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to fetch flights",
            message: error.message
        }, { status: 500 });
    }
}
