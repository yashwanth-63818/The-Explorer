import { getCache, setCache } from "./cacheService";

const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
const YOUTUBE_VIDEOS_URL = "https://www.googleapis.com/youtube/v3/videos";
const CACHE_KEY = "youtube-videos-data";
const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours

// Categories definition
const CATEGORY_QUERIES = {
    travel: "cinematic travel vlog",
    adventure: "backpacking adventure travel film",
    nature: "nature documentary 4k travel",
    motorcycle: "motorcycle travel road trip adventure"
};

const EXCLUDED_KEYWORDS = ["music", "remix", "shorts", "reels", "promo", "laptop", "review", "iphone", "lifestyle", "gadget"];

/**
 * Main function to get all videos organized by category
 */
export async function getVideos() {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
        console.warn("[VideoService] YouTube API Key missing.");
        return [];
    }

    // 1. Try Cache
    const cached = await getCache("api", CACHE_KEY);
    if (cached && (Date.now() - new Date(cached.updatedAt).getTime() < CACHE_TTL)) {
        return cached.videos;
    }

    console.log("[VideoService] Fetching fresh data from YouTube API...");

    try {
        const allVideosMap = new Map();
        const categories = Object.keys(CATEGORY_QUERIES);

        for (const cat of categories) {
            const query = CATEGORY_QUERIES[cat];
            const items = await fetchCategoryVideos(query, cat, apiKey);
            items.forEach(v => {
                if (!allVideosMap.has(v.id)) {
                    allVideosMap.set(v.id, v);
                }
            });
        }

        const allVideos = Array.from(allVideosMap.values());

        // 2. Save to Cache
        await setCache("api", CACHE_KEY, { videos: allVideos, updatedAt: new Date().toISOString() });

        return allVideos;
    } catch (error) {
        console.error("[VideoService] fetch error:", error);
        return [];
    }
}

/**
 * Get a single video by its slug
 */
export async function getVideoBySlug(slug) {
    const allVideos = await getVideos();
    // Find in our pool
    const video = allVideos.find(v => v.slug === slug);
    return video || null;
}

/**
 * Get related videos by country
 */
export async function getRelatedVideos(country, currentSlug) {
    const allVideos = await getVideos();
    return allVideos
        .filter(v => v.country === country && v.slug !== currentSlug)
        .slice(0, 4);
}

/**
 * Helper to fetch and process videos for a category
 */
async function fetchCategoryVideos(query, categoryLabel, apiKey) {
    const searchParams = new URLSearchParams({
        part: "snippet",
        q: query,
        maxResults: "8",
        type: "video",
        videoEmbeddable: "true",
        safeSearch: "moderate",
        key: apiKey
    });

    const res = await fetch(`${YOUTUBE_SEARCH_URL}?${searchParams.toString()}`);
    if (!res.ok) throw new Error("YouTube search failed");

    const searchData = await res.json();
    const videoIds = searchData.items.map(item => item.id.videoId).join(",");

    // Fetch details (duration, statistics)
    const detailRes = await fetch(`${YOUTUBE_VIDEOS_URL}?part=snippet,contentDetails,statistics&id=${videoIds}&key=${apiKey}`);
    const detailData = await detailRes.json();

    return detailData.items
        .filter(item => {
            const title = item.snippet.title.toLowerCase();
            return !EXCLUDED_KEYWORDS.some(kw => title.includes(kw));
        })
        .map(item => {
            const title = item.snippet.title;
            const slug = generateSlug(title);
            const country = extractCountry(title, item.snippet.description);

            return {
                id: item.id,
                title: title,
                slug: slug,
                description: item.snippet.description,
                videoUrl: `https://www.youtube.com/embed/${item.id}`,
                thumbnailUrl: getBestThumbnail(item.snippet.thumbnails),
                country: country,
                duration: parseDuration(item.contentDetails.duration),
                publishedAt: item.snippet.publishedAt,
                author: item.snippet.channelTitle,
                category: categoryLabel,
                viewCount: item.statistics.viewCount
            };
        });
}

function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-')
        .concat("-travel-video");
}

function getBestThumbnail(thumbnails) {
    return thumbnails.maxres?.url || thumbnails.high?.url || thumbnails.medium?.url || thumbnails.default?.url;
}

function parseDuration(duration) {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const h = parseInt(match[1]) || 0;
    const m = parseInt(match[2]) || 0;
    const s = parseInt(match[3]) || 0;
    const hh = h > 0 ? h + ":" : "";
    const mm = (h > 0 && m < 10 ? "0" + m : m) + ":";
    const ss = s < 10 ? "0" + s : s;
    return hh + mm + ss;
}

const COUNTRIES = ["Bhutan", "Japan", "Iceland", "India", "Thailand", "Vietnam", "Nepal", "Switzerland", "Italy", "France", "USA", "Egypt", "Algeria", "Albania"];

function extractCountry(title, description) {
    const text = (title + " " + description).toLowerCase();
    for (const c of COUNTRIES) {
        if (text.includes(c.toLowerCase())) return c.toUpperCase();
    }
    return "WORLD";
}
