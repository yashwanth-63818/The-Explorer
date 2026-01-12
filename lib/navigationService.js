/**
 * Navigation utility for generating smart deep-links to external travel partners
 * based on destination context (City, Country, and IATA codes).
 */

export const EXTERNAL_PARTNERS = {
    SKYSCANNER: "Skyscanner",
    BOOKING: "Booking.com",
    OMIO: "Omio",
    VIATOR: "Viator",
    GETYOURGUIDE: "GetYourGuide",
    DISCOVERCARS: "DiscoverCars",
    HEYMONDO: "Heymondo",
    HOSTELWORLD: "Hostelworld",
    AIRALO: "Airalo",
    PROTONVPN: "ProtonVPN"
};

/**
 * Generates a deep-link URL for a travel partner
 * @param {string} partner - Partner name from EXTERNAL_PARTNERS
 * @param {Object} context - Destination context { cityName, countryName, iataCode }
 * @returns {string} - The deep-link URL
 */
export function getPartnerRedirectUrl(partner, context = {}) {
    const { cityName, countryName, iataCode } = context;

    // Fallback logic: prefer city, then country
    const destinationName = cityName || countryName || "";
    const sanitizedDest = encodeURIComponent(destinationName);
    const countrySlug = (countryName || "").toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');

    switch (partner) {
        case EXTERNAL_PARTNERS.SKYSCANNER:
            // Format: https://www.skyscanner.net/transport/flights-to/{DESTINATION_CODE}/
            // Priority: IATA Code > City Name > Country Slug
            const destCode = iataCode || (cityName ? cityName.toLowerCase().replace(/ /g, '-') : countrySlug);
            return `https://www.skyscanner.net/transport/flights-to/${destCode}/`;

        case EXTERNAL_PARTNERS.BOOKING:
            // Format: https://www.booking.com/searchresults.html?ss={DESTINATION_NAME}
            return `https://www.booking.com/searchresults.html?ss=${sanitizedDest}`;

        case EXTERNAL_PARTNERS.OMIO:
            // Format: https://www.omio.com/search-params?arrival={CITY_NAME}
            // Use city preferred for Omio (bus/trains)
            return `https://www.omio.com/search-params?arrival=${sanitizedDest}`;

        case EXTERNAL_PARTNERS.VIATOR:
            // Format: https://www.viator.com/searchResults/all?text={CITY_OR_COUNTRY}
            return `https://www.viator.com/searchResults/all?text=${sanitizedDest}`;

        case EXTERNAL_PARTNERS.GETYOURGUIDE:
            // Format: https://www.getyourguide.com/s?q={CITY_OR_COUNTRY}
            return `https://www.getyourguide.com/s?q=${sanitizedDest}`;

        case EXTERNAL_PARTNERS.DISCOVERCARS:
            // Format: https://www.discovercars.com/en/search?location={CITY_NAME}
            return `https://www.discovercars.com/en/search?location=${sanitizedDest}`;

        case EXTERNAL_PARTNERS.HEYMONDO:
            // Format: https://heymondo.com/travel-insurance/?destination={COUNTRY_NAME}
            // Always use country for insurance
            return `https://heymondo.com/travel-insurance/?destination=${encodeURIComponent(countryName || "")}`;

        case EXTERNAL_PARTNERS.HOSTELWORLD:
            return `https://www.hostelworld.com/s?q=${sanitizedDest}`;

        case EXTERNAL_PARTNERS.AIRALO:
            return `https://www.airalo.com/search?q=${sanitizedDest}`;

        case EXTERNAL_PARTNERS.PROTONVPN:
            return "https://protonvpn.com";

        default:
            return "#";
    }
}

/**
 * Client-side redirect handler
 */
export function handlePartnerRedirect(partner, context) {
    if (typeof window === 'undefined') return;

    const url = getPartnerRedirectUrl(partner, context);
    if (url && url !== "#") {
        window.open(url, "_blank", "noopener,noreferrer");
    }
}
