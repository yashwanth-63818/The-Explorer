import { getVideos } from "@/lib/videoService";
import SafeImage from "@/components/SafeImage";
import VideoCard from "@/components/VideoCard";

export const metadata = {
    title: "Travel Videos | The Explorer",
    description: "Cinematic travel vlogs and motorcycle exploration stories from across the globe.",
};

const CATEGORY_NAMES = {
    travel: "Travel Series",
    adventure: "Adventure & Backpacking",
    nature: "Nature & Landscapes",
    motorcycle: "Motorcycle Journeys"
};

export default async function VideoListingPage() {
    const allVideos = await getVideos();

    if (!allVideos || allVideos.length === 0) {
        const apiKeySet = !!process.env.YOUTUBE_API_KEY;
        return (
            <div className="min-h-screen pt-40 text-center bg-[#0f0f0f] text-white">
                <h1 className="text-2xl font-serif text-zinc-500 mb-4">
                    {apiKeySet ? "No videos found matching the criteria." : "YouTube API Key is missing."}
                </h1>
                {!apiKeySet && (
                    <p className="text-zinc-600 text-sm max-w-md mx-auto">
                        Please add <code>YOUTUBE_API_KEY</code> to your <code>.env.local</code> file to load cinematic travel content.
                    </p>
                )}
            </div>
        );
    }

    // Group by category
    const grouped = allVideos.reduce((acc, v) => {
        if (!acc[v.category]) acc[v.category] = [];
        acc[v.category].push(v);
        return acc;
    }, {});

    const featured = allVideos[0];

    return (
        <div className="bg-[#0f0f0f] text-white selection:bg-yellow-400 selection:text-black">
            {/* 1. HERO SECTION */}
            <section className="relative h-[65vh] min-h-[500px] flex flex-col items-center justify-center overflow-hidden pt-[var(--nav-height)]">
                <div className="absolute inset-0 z-0">
                    <SafeImage
                        src={featured.thumbnailUrl}
                        alt="Video Hero"
                        fill
                        priority
                        className="object-cover brightness-[0.25] scale-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0f0f0f]"></div>
                </div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <span className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.6em] mb-6 block">Cinematic Channel</span>
                    <h1 className="text-6xl md:text-9xl font-serif font-black uppercase tracking-tighter mb-8 leading-[0.8] drop-shadow-2xl">
                        Videos
                    </h1>
                    <p className="max-w-xl mx-auto text-lg md:text-xl text-zinc-400 font-medium leading-relaxed opacity-90 px-4 italic font-serif">
                        "Documenting the raw, the real, and the remarkable."
                    </p>
                </div>
            </section>

            {/* 2. CATEGORIZED VIDEO SECTIONS */}
            <div className="pb-32 container mx-auto px-4">
                {Object.entries(CATEGORY_NAMES).map(([key, label]) => {
                    const videos = grouped[key] || [];
                    if (videos.length === 0) return null;

                    return (
                        <section key={key} className="mt-24 first:mt-12">
                            <div className="flex items-center gap-6 mb-12">
                                <hr className="flex-1 border-white/5" />
                                <h2 className="text-xs font-black uppercase tracking-[0.5em] text-yellow-500 whitespace-nowrap">
                                    {label}
                                </h2>
                                <hr className="flex-1 border-white/5" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
                                {videos.map((video) => (
                                    <VideoCard
                                        key={video.id}
                                        video={video}
                                        href={`/videos/${video.slug}`}
                                    />
                                ))}
                            </div>
                        </section>
                    );
                })}
            </div>

            {/* FOOTER CTA */}
            <section className="py-32 border-t border-white/5 bg-[#0a0a0a] text-center">
                <div className="container mx-auto px-4">
                    <h3 className="text-3xl md:text-5xl font-serif font-black uppercase mb-10 tracking-tight text-white/20">Expand your horizon</h3>
                    <a
                        href="/destinations"
                        className="inline-flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.5em] text-white hover:text-yellow-500 transition-colors group"
                    >
                        Explore Destinations
                        <span className="w-16 h-px bg-zinc-800 group-hover:bg-yellow-500 transition-colors"></span>
                    </a>
                </div>
            </section>
        </div>
    );
}
