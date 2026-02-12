export const CITY_IMAGES = {
    // Thailand
    "bangkok": "https://images.unsplash.com/photo-1508009603885-50cf7c579367?q=80&w=1000&auto=format&fit=crop",
    "chiang-mai": "https://images.unsplash.com/photo-1590218408103-62547eb22f98?q=80&w=1000&auto=format&fit=crop",
    "phuket": "https://images.unsplash.com/photo-1589394815804-964ed9be2eb3?q=80&w=1000&auto=format&fit=crop",

    // Japan
    "tokyo": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop",
    "kyoto": "https://images.unsplash.com/photo-1493976040375-85c171242378?q=80&w=1000&auto=format&fit=crop",
    "osaka": "https://images.unsplash.com/photo-1590559899731-a382839e5549?q=80&w=1000&auto=format&fit=crop",
    "nara": "https://images.unsplash.com/photo-1549413247-4959146522c1?q=80&w=1000&auto=format&fit=crop",

    // Italy
    "rome": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1000&auto=format&fit=crop",
    "venice": "https://images.unsplash.com/photo-1514890547357-a9ee2887ad8e?q=80&w=1000&auto=format&fit=crop",
    "florence": "https://images.unsplash.com/photo-1543428802-b35336599cc0?q=80&w=1000&auto=format&fit=crop",

    // France
    "paris": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop",
    "nice": "https://images.unsplash.com/photo-1533088235333-3bc34a2153ae?q=80&w=1000&auto=format&fit=crop",

    // Indonesia
    "bali": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop",
    "jakarta": "https://images.unsplash.com/photo-1524312686310-2f98018e698a?q=80&w=1000&auto=format&fit=crop",

    // Australia
    "sydney": "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1000&auto=format&fit=crop",
    "melbourne": "https://images.unsplash.com/photo-1470290330044-3841cd055e79?q=80&w=1000&auto=format&fit=crop",

    // Cape Verde
    "sal": "https://images.unsplash.com/photo-1589394815804-964ed9be2eb3?q=80&w=1000&auto=format&fit=crop",
    "santo-antao": "https://images.unsplash.com/photo-1594411130638-349079ea595d?q=80&w=1000&auto=format&fit=crop",
    "santo-antão": "https://images.unsplash.com/photo-1594411130638-349079ea595d?q=80&w=1000&auto=format&fit=crop",

    // North America
    "new-york": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1000&auto=format&fit=crop",
    "los-angeles": "https://images.unsplash.com/photo-1542736667-069246bdf6d7?q=80&w=1000&auto=format&fit=crop",
    "vancouver": "https://images.unsplash.com/photo-1559511260-66a654ae982a?q=80&w=1000&auto=format&fit=crop",
    "toronto": "https://images.unsplash.com/photo-1503405812331-4112eccfd3a7?q=80&w=1000&auto=format&fit=crop",

    // Albania
    "tirana": "https://images.unsplash.com/photo-1580216643062-cf460548a66a?q=80&w=1000&auto=format&fit=crop",
    "saranda": "https://images.unsplash.com/photo-1560242374-f23348879639?q=80&w=1000&auto=format&fit=crop",

    // Switzerland
    "zurich": "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?q=80&w=1000&auto=format&fit=crop",
    "lucerne": "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=1000&auto=format&fit=crop",
};

export function getCityImage(citySlug, type = "") {
    if (CITY_IMAGES[citySlug]) return CITY_IMAGES[citySlug];

    // Generate a high-quality relevant Unsplash URL based on the slug
    const seed = citySlug.split('-').length > 1 ? citySlug.split('-')[0] : citySlug;
    return `https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1000&auto=format&fit=crop`; // Beautiful generic travel fallback (Paris-esque)
}
