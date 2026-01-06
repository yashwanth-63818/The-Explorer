import { getDynamicDestinationData } from "@/lib/destinationService";
import { Plane, Train, Bus, Bed, Globe, MapPin, ArrowRight, User, Calendar, Camera } from "lucide-react";
import Link from "next/link";

export default async function CountryPage(props) {
    const params = await props.params;
    const { slug } = params;

    // Decode: "united-states" -> "United States"
    const countryName = decodeURIComponent(slug)
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    // 1. FETCH LIVE DATA
    const data = await getDynamicDestinationData(countryName);

    // 2. FALLBACK DEFAULTS
    const fallback = {
        region: "Europe", // Default region if API fails
        intro: `${countryName} is a destination that captures the imagination. From its bustling cities to its serene landscapes, it offers a travel experience like no other.`,
        tagline: `Discover the magic of ${countryName}`,
        bestPlaces: [
            { title: "Capital City", desc: "The cultural hub." },
            { title: "North Region", desc: "For nature lovers." },
            { title: "South Coast", desc: "Beaches and sun." }
        ],
        thingsToDo: ["City Walking Tour", "Local Food Tasting", "Museum Visit", "Hiking Adventure"],
        tips: { greeting: "Hello", tipping: "10-15%" }
    };

    // 3. MAP DATA TO UI
    const content = data?.content || fallback;
    const facts = {
        capital: data?.capital || "The Capital",
        currency: data?.currency || "Local Currency",
        code: data?.code || "FR", // Default to FR just for the map shape fallback
        region: data?.region || fallback.region
    };

    // Images Logic
    const rawImages = data?.images || [];
    // Ensure we have at least 5 images by cycling the fallbacks if needed
    const fallbackImages = [
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070", // Nature
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021", // Road
        "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2068", // Beach
        "https://images.unsplash.com/photo-1440778303588-43aa9d763bec?q=80&w=2070", // Fall
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070"  // Lake
    ];

    // Helper to get image at index safely
    const getImage = (i) => rawImages[i]?.url || fallbackImages[i % fallbackImages.length];

    const heroImage = getImage(0);

    // Date formatter for "fake" blog dates
    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="bg-[#121212] min-h-screen text-gray-200 font-sans selection:bg-[#FFD700] selection:text-black">

            {/* -------------------------------------------------------- */}
            {/* A. HERO DESTINATION HEADER */}
            {/* -------------------------------------------------------- */}
            <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
                {/* Background Image with Cinematic Overlay */}
                <div className="absolute inset-0">
                    <img src={heroImage} alt={countryName} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#121212]"></div>
                </div>

                {/* Content Container */}
                <div className="relative z-20 container mx-auto px-4 lg:px-8 text-center pt-[var(--nav-height)] mt-12 pb-48 lg:pb-72">

                    {/* Faint Country Map Behind Title */}
                    <img
                        src={`https://raw.githubusercontent.com/djaiss/mapsicon/master/all/${facts.code.toLowerCase()}/vector.svg`}
                        alt="map"
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.03] select-none pointer-events-none invert block"
                    />

                    {/* Breadcrumbs */}
                    <div className="flex justify-center items-center gap-2 text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-white/60 mb-6 animate-in slide-in-from-bottom-4 duration-700">
                        <span>Destinations</span>
                        <span className="text-[#FFD700]">•</span>
                        <span>{facts.region}</span>
                        <span className="text-[#FFD700]">•</span>
                        <span className="text-white">{countryName}</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-white uppercase tracking-tighter mb-6 leading-[0.9] drop-shadow-2xl animate-in slide-in-from-bottom-8 duration-700 delay-100">
                        {countryName}
                    </h1>

                    {/* Intro */}
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-200 font-serif leading-relaxed mb-10 opacity-90 animate-in slide-in-from-bottom-8 duration-700 delay-200">
                        {content.intro}
                    </p>

                    {/* Quick Link Chips */}
                    <div className="flex flex-wrap justify-center gap-3 mb-20 animate-in slide-in-from-bottom-8 duration-700 delay-300">
                        {content.bestPlaces?.slice(0, 4).map((place, i) => (
                            <Link
                                href="#"
                                key={i}
                                className="px-5 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest hover:bg-[#FFD700] hover:text-black hover:border-[#FFD700] transition-all duration-300"
                            >
                                {place.title}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-50">
                    <span className="text-[10px] tracking-widest uppercase text-white">Explore</span>
                    <ArrowRight className="w-4 h-4 rotate-90 text-[#FFD700]" />
                </div>
            </div>


            {/* -------------------------------------------------------- */}
            {/* B. FEATURED GUIDE HERO (Mega Card) */}
            {/* -------------------------------------------------------- */}
            <div className="container mx-auto px-4 lg:px-8 -mt-20 md:-mt-32 relative z-30">
                <div className="group relative rounded-3xl overflow-hidden aspect-[16/9] md:aspect-[21/9] shadow-2xl border border-white/10">
                    <img
                        src={getImage(1)}
                        alt="Featured Guide"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>

                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-16 flex flex-col justify-end items-start h-full">
                        <span className="inline-block px-3 py-1 bg-[#FFD700] text-black text-[10px] font-bold uppercase tracking-widest rounded mb-4">
                            Ultimate Guide
                        </span>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight max-w-4xl font-serif">
                            {countryName} In 2 Weeks: Your Ultimate Backpacking Guide
                        </h2>
                        <p className="text-gray-300 mb-8 max-w-xl text-lg hidden md:block">
                            A complete itinerary covering {content.bestPlaces[0]?.title}, {content.bestPlaces[1]?.title}, and the hidden gems of {countryName}.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button className="px-6 py-3 bg-white text-black font-bold uppercase text-xs tracking-widest rounded hover:bg-[#FFD700] transition-colors flex items-center gap-2">
                                Read The Guide <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            {/* -------------------------------------------------------- */}
            {/* E. TRAVEL ESSENTIALS STRIP */}
            {/* -------------------------------------------------------- */}
            <div className="container mx-auto px-4 lg:px-8 py-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: Plane, label: `Flights to ${countryName}`, sub: "Find Deals" },
                        { icon: Bed, label: `Hotels in ${countryName}`, sub: "Compare Prices" },
                        { icon: Train, label: "Train Routes", sub: "Rail Passes" },
                        { icon: Bus, label: "Bus Tickets", sub: "Budget Travel" },
                    ].map((item, i) => (
                        <div key={i} className="bg-[#1a1a1a] rounded-xl p-6 border border-white/5 hover:border-[#FFD700]/50 transition-all cursor-pointer group">
                            <item.icon className="w-8 h-8 text-[#FFD700] mb-4 group-hover:scale-110 transition-transform" />
                            <h3 className="text-white font-bold text-sm uppercase tracking-wide mb-1">{item.label}</h3>
                            <p className="text-gray-500 text-xs">{item.sub}</p>
                        </div>
                    ))}
                </div>
            </div>


            {/* -------------------------------------------------------- */}
            {/* C. DESTINATION BLOG GRID (Dynamic from Best Places) */}
            {/* -------------------------------------------------------- */}
            <div className="bg-[#1a1a1a] py-24">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <span className="text-[#FFD700] text-xs font-bold tracking-[0.2em] uppercase block mb-3">Latest Articles</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-white font-serif">Travel Guides & Stories</h2>
                        </div>
                        <button className="text-gray-400 hover:text-white text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                            View All Posts <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {/* 1. Generate "City Guides" from Best Places */}
                        {content.bestPlaces?.map((place, i) => (
                            <div key={i} className="group flex flex-col h-full bg-[#121212] rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-colors">
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img
                                        src={getImage(i + 2)}
                                        alt={place.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">
                                        City Guide
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold text-white mb-3 font-serif group-hover:text-[#FFD700] transition-colors leading-snug">
                                        The Ultimate Guide to {place.title}: {place.desc.split('.')[0]}
                                    </h3>
                                    <div className="mt-auto flex items-center gap-2 pt-6 border-t border-white/5">
                                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                                            <User className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-white font-bold">BucketList Team</p>
                                            <p className="text-[10px] text-gray-500">{currentDate}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* 2. Generate "Activity Guides" from Things To Do */}
                        {content.thingsToDo?.slice(0, 3).map((thing, i) => (
                            <div key={`todo-${i}`} className="group flex flex-col h-full bg-[#121212] rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-colors">
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img
                                        src={getImage(i + 5)}
                                        alt={thing}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">
                                        Experience
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold text-white mb-3 font-serif group-hover:text-[#FFD700] transition-colors leading-snug">
                                        Why {thing} needs to be on your {countryName} Bucket List
                                    </h3>
                                    <div className="mt-auto flex items-center gap-2 pt-6 border-t border-white/5">
                                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                                            <Camera className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-white font-bold">BucketList Team</p>
                                            <p className="text-[10px] text-gray-500">{currentDate}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            {/* -------------------------------------------------------- */}
            {/* D. PLACES TO VISIT (Horizontal Scroll) */}
            {/* -------------------------------------------------------- */}
            <div className="py-24 overflow-hidden">
                <div className="container mx-auto px-4 lg:px-8 mb-12">
                    <span className="text-[#FFD700] text-xs font-bold tracking-[0.2em] uppercase block mb-3">Don't Miss</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white font-serif">Top Places in {countryName}</h2>
                </div>

                {/* Content */}
                <div className="flex gap-6 overflow-x-auto px-4 lg:px-8 pb-8 no-scrollbar md:justify-center">
                    {content.bestPlaces?.map((place, i) => (
                        <div key={i} className="min-w-[280px] md:min-w-[320px] aspect-[3/4] relative group rounded-2xl overflow-hidden cursor-pointer">
                            <img
                                src={getImage(i + 1)}
                                alt={place.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                <h3 className="text-2xl font-bold text-white mb-1">{place.title}</h3>
                                <p className="text-gray-300 text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    Explore Guide
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* -------------------------------------------------------- */}
            {/* FOOTER CTA */}
            {/* -------------------------------------------------------- */}
            <div className="py-24 bg-[#FFD700] text-black text-center">
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 max-w-4xl mx-auto leading-[0.9]">
                    Ready to Plan Your Trip to {countryName}?
                </h2>
                <div className="flex justify-center gap-4">
                    <button className="px-8 py-4 bg-black text-white font-bold uppercase tracking-widest rounded hover:bg-gray-900 transition-transform hover:scale-105">
                        Start Planning
                    </button>
                    <button className="px-8 py-4 border-2 border-black text-black font-bold uppercase tracking-widest rounded hover:bg-black/10 transition-transform hover:scale-105">
                        View All Destinations
                    </button>
                </div>
            </div>

        </div>
    );
}
