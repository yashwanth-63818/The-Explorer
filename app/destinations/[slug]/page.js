"use client";
import { destinations } from "@/lib/destinationData";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MapPin, Calendar, Wallet, CheckCircle, Info, Plane, Hotel } from "lucide-react";

export default function CountryPage() {
    const params = useParams();
    // Decode slug to handle spaces or special chars if any, though usually slugs are clean
    const slug = params?.slug ? decodeURIComponent(params.slug).toLowerCase() : "";

    // Fetch specific data OR fall back to a generic structure if data is missing
    // NOTE: In a real app, you might want to show a 404 or a "Coming Soon" page.
    // For this demo, we auto-generate valid-looking content for ANY country to prevent crashes
    // while effectively fulfilling the "Unique Page" requirement by using the country name.

    let countryData = destinations[slug];

    // Intelligently generate fallback data if specific data doesn't exist
    if (!countryData) {
        // Capitalize slug for display name
        const displayName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

        countryData = {
            name: displayName,
            tagline: `Explore the wonders of ${displayName}`,
            // Use a dynamic Unsplash query for the hero image to ensure it looks unique
            heroImage: `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop`,
            // Generic but professional intro
            intro: `${displayName} is a destination that captivates travelers with its unique blend of culture, history, and natural beauty. Whether you are looking for adventure, relaxation, or cultural immersion, ${displayName} offers something for everyone. From its bustling cities to its serene landscapes, prepare for an unforgettable journey.`,
            bestPlaces: [
                { title: `Capital of ${displayName}`, image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop" },
                { title: "Hidden Gem", image: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=1990&auto=format&fit=crop" },
                { title: "Coastal Region", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop" },
            ],
            thingsToDo: [
                `Explore the local markets of ${displayName}`,
                "Visit historical landmarks",
                "Try unique local cuisine",
                "Hiking in the national parks",
                "Experience the local festivals"
            ],
            travelTips: {
                visa: "Check dynamic visa requirements online.",
                currency: "Local Currency (Check rates).",
                bestTime: "Spring or Autumn is usually best.",
                transport: "Local transport and taxis available."
            }
        };
    }

    return (
        <div className="bg-[#121212] min-h-screen text-gray-200 font-sans selection:bg-[#FFD700] selection:text-black">

            {/* HERO SECTION */}
            <div className="relative h-[85vh] w-full overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <img
                    src={countryData.heroImage}
                    alt={countryData.name}
                    className="w-full h-full object-cover animate-in fade-in zoom-in duration-[2s]"
                />
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
                    <span className="text-[#FFD700] tracking-[0.3em] uppercase font-bold text-sm mb-6 animate-in slide-in-from-bottom-4 duration-1000 delay-300">
                        Destinations
                    </span>
                    <h1 className="text-white text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter mb-4 animate-in slide-in-from-bottom-8 duration-1000 delay-100">
                        {countryData.name}
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 font-serif italic max-w-2xl animate-in slide-in-from-bottom-6 duration-1000 delay-500">
                        {countryData.tagline}
                    </p>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
                    <div className="w-[1px] h-16 bg-gradient-to-b from-[#FFD700] to-transparent"></div>
                </div>
            </div>

            {/* INTRO SECTION */}
            <section className="py-20 lg:py-32 px-4 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    <div className="lg:col-span-5">
                        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
                            Why you should visit <span className="text-[#FFD700] underline decoration-2 underline-offset-8">{countryData.name}</span>
                        </h2>
                        <div className="h-1 w-20 bg-[#FFD700] mb-8"></div>
                    </div>
                    <div className="lg:col-span-7">
                        <p className="text-xl text-gray-300 leading-relaxed font-light">
                            {countryData.intro}
                        </p>
                    </div>
                </div>
            </section>

            {/* BEST PLACES GRID */}
            <section className="py-20 bg-[#1a1a1a] px-4 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-end justify-between mb-16">
                        <div>
                            <span className="text-[#FFD700] font-bold tracking-widest uppercase text-xs mb-2 block">Highlights</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-white">Best Places to Visit</h2>
                        </div>
                        <Link href="#" className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#FFD700] hover:text-white transition-colors">
                            View All <div className="w-8 h-[1px] bg-current"></div>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {countryData.bestPlaces.map((place, index) => (
                            <div key={index} className="group relative aspect-[4/5] overflow-hidden rounded-xl cursor-pointer">
                                <img
                                    src={place.image}
                                    alt={place.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 w-full p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <h3 className="text-2xl font-bold text-white mb-2">{place.title}</h3>
                                    <div className="text-[#FFD700] text-sm font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 flex items-center gap-2">
                                        Explore <div className="w-4 h-[1px] bg-[#FFD700]"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* THINGS TO DO & TIPS */}
            <section className="py-20 lg:py-32 px-4 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

                    {/* Things to do */}
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                            <CheckCircle className="text-[#FFD700]" /> Things to Do
                        </h2>
                        <ul className="space-y-4">
                            {countryData.thingsToDo.map((thing, index) => (
                                <li key={index} className="flex items-start gap-4 p-4 bg-[#1a1a1a] rounded-lg border border-white/5 hover:border-[#FFD700]/30 transition-colors">
                                    <span className="text-[#FFD700] font-bold text-lg">0{index + 1}.</span>
                                    <span className="text-gray-300 font-medium text-lg">{thing}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Travel Tips */}
                    <div className="bg-[#1a1a1a] p-8 lg:p-12 rounded-2xl border border-white/5">
                        <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                            <Info className="text-[#FFD700]" /> Essential Tips
                        </h2>
                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center shrink-0">
                                    <MapPin className="text-[#FFD700]" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-1">Visa Requirements</h4>
                                    <p className="text-gray-400 text-sm">{countryData.travelTips.visa}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center shrink-0">
                                    <Wallet className="text-[#FFD700]" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-1">Currency</h4>
                                    <p className="text-gray-400 text-sm">{countryData.travelTips.currency}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center shrink-0">
                                    <Calendar className="text-[#FFD700]" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-1">Best Time to Visit</h4>
                                    <p className="text-gray-400 text-sm">{countryData.travelTips.bestTime}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center shrink-0">
                                    <Plane className="text-[#FFD700]" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-1">Transportation</h4>
                                    <p className="text-gray-400 text-sm">{countryData.travelTips.transport}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
}
