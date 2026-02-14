
"use client";

import { useState, useEffect } from "react";
import {
    Search,
    MapPin,
    Calendar,
    Users,
    Star,
    ArrowRight,
    Hotel,
    ShieldCheck,
    Zap,
    Globe,
    ExternalLink
} from "lucide-react";
import SafeImage from "@/components/SafeImage";

// Simulated deal data
const HOTEL_PARTNERS = [
    {
        name: "Booking.com",
        logo: "https://upload.wikimedia.org/wikipedia/commons/b/be/Booking.com_logo.svg",
        color: "bg-[#003580]",
        getBaseUrl: (query) => `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(query)}`
    },
    {
        name: "Agoda",
        logo: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Agoda_logo.svg",
        color: "bg-[#ed1c24]",
        getBaseUrl: (query) => `https://www.agoda.com/search?city=${encodeURIComponent(query)}`
    },
    {
        name: "Hotels.com",
        logo: "https://upload.wikimedia.org/wikipedia/commons/d/df/Hotels-dot-com_logo.svg",
        color: "bg-[#d32f2f]",
        getBaseUrl: (query) => `https://www.hotels.com/Hotel-Search?destination=${encodeURIComponent(query)}`
    },
    {
        name: "Expedia",
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/22/Expedia_Logo.svg",
        color: "bg-[#00355f]",
        getBaseUrl: (query) => `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(query)}`
    }
];

export default function FindHotelsPage() {
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState([]);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery) return;

        setLoading(true);
        setSearched(false);

        // Simulate "gathering deals" delay
        setTimeout(() => {
            const mockDeals = HOTEL_PARTNERS.map(partner => ({
                ...partner,
                price: Math.floor(Math.random() * (300 - 80) + 80),
                rating: (Math.random() * (5 - 4) + 4).toFixed(1),
                reviews: Math.floor(Math.random() * 5000 + 500),
                discount: Math.floor(Math.random() * 30 + 10),
                url: partner.getBaseUrl(searchQuery)
            }));

            setResults(mockDeals.sort((a, b) => a.price - b.price));
            setLoading(false);
            setSearched(true);

            // Scroll to results
            window.scrollTo({
                top: 600,
                behavior: 'smooth'
            });
        }, 2500);
    };

    return (
        <main className="relative min-h-screen bg-black overflow-hidden selection:bg-[#FFD700] selection:text-black">
            {/* Cinematic Background */}
            <div
                className="absolute inset-0 z-0 transition-transform duration-500 ease-out"
                style={{
                    transform: `translateY(${scrollY * 0.15}px) scale(1.05)`,
                }}
            >
                <SafeImage
                    src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop"
                    alt="Luxury Hotel"
                    fill
                    className="object-cover filter brightness-[0.4] contrast-[1.1] grayscale-[0.2]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black z-10"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-20 w-full flex flex-col items-center justify-start pt-[120px] md:pt-[180px] pb-32 px-6 lg:px-12">
                <div className="w-full max-w-6xl mx-auto">

                    {/* Header */}
                    <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                        <div className="inline-flex items-center gap-3 mb-6">
                            <span className="w-12 h-[1px] bg-[#FFD700]"></span>
                            <span className="text-[#FFD700] text-[10px] font-black uppercase tracking-[0.5em]">Global Hotel Aggregator</span>
                            <span className="w-12 h-[1px] bg-[#FFD700]"></span>
                        </div>
                        <h1 className="font-serif text-white font-bold leading-[1.05] mb-8">
                            <span className="text-[clamp(2.5rem,8vw,5.5rem)] block">Sleep in the</span>
                            <span className="text-[clamp(2.5rem,8vw,5.5rem)] text-[#FFD700] block italic">Extraordinary</span>
                        </h1>
                        <p className="font-sans text-white/50 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed italic">
                            Searching 200+ booking sites simultaneously for the guaranteed best prices on earth.
                        </p>
                    </div>

                    {/* Search Panel */}
                    <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-2 rounded-[3.5rem] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.8)] mb-20 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
                        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row items-stretch gap-2">
                            <div className="flex-1 flex items-center gap-6 px-10 py-8 lg:border-r border-white/5 group hover:bg-white/5 transition-all rounded-l-[3rem]">
                                <MapPin className="text-[#FFD700] shrink-0" size={24} />
                                <div className="flex-1">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 block mb-2">Destination or Hotel</label>
                                    <input
                                        type="text"
                                        placeholder="Where are you going?"
                                        className="bg-transparent border-none outline-none text-white text-xl font-bold placeholder:text-white/10 w-full"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex-1 flex items-center gap-6 px-10 py-8 lg:border-r border-white/5 group hover:bg-white/5 transition-all">
                                <Calendar className="text-[#FFD700] shrink-0" size={24} />
                                <div className="flex-1">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 block mb-2">Dates</label>
                                    <div className="text-white text-lg font-bold">Flexible Dates</div>
                                </div>
                            </div>

                            <div className="lg:w-[200px] flex items-center gap-6 px-10 py-8 group hover:bg-white/5 transition-all">
                                <Users className="text-[#FFD700] shrink-0" size={24} />
                                <div className="flex-1">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 block mb-2">Guests</label>
                                    <div className="text-white text-lg font-bold">2 Adults</div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="lg:m-1 bg-[#FFD700] hover:bg-[#FFC400] text-black px-12 py-8 rounded-[2.8rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                        <span>Analyzing...</span>
                                    </div>
                                ) : (
                                    <>
                                        Scan Deals <Search size={20} className="stroke-[3px]" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Results Section */}
                    {(loading || searched) && (
                        <div id="results" className="scroll-mt-32 w-full animate-in fade-in duration-700">
                            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                                <div>
                                    <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-[#FFD700] mb-4">Scanning Network</h2>
                                    <p className="text-3xl font-serif font-black text-white uppercase tracking-tight">Best Offers Found for "{searchQuery}"</p>
                                </div>
                                <div className="flex items-center gap-4 text-white/40 text-xs font-bold uppercase tracking-widest">
                                    <span className="flex items-center gap-2"><div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div> 1,429 Hotels Scanned</span>
                                    <span className="text-white/10">|</span>
                                    <span>Real-time Prices</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {results.map((deal, i) => (
                                    <a
                                        key={i}
                                        href={deal.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative bg-[#0f0f0f] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-[#FFD700]/30 transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]"
                                    >
                                        <div className="p-8 pb-4">
                                            <div className="flex items-center justify-between mb-8">
                                                <div className="p-3 bg-white/5 rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-500 overflow-hidden">
                                                    <img src={deal.logo} alt={deal.name} className="h-6 w-auto object-contain" />
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <div className="flex items-center gap-1 text-[#FFD700]">
                                                        <Star size={10} fill="#FFD700" />
                                                        <span className="text-[10px] font-black">{deal.rating}</span>
                                                    </div>
                                                    <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">{deal.reviews} Reviews</span>
                                                </div>
                                            </div>

                                            <div className="mb-8">
                                                <div className="flex items-baseline gap-2 mb-1">
                                                    <span className="text-4xl font-black text-white">${deal.price}</span>
                                                    <span className="text-xs font-bold text-white/30 uppercase tracking-widest">/ Night</span>
                                                </div>
                                                <div className="inline-flex items-center gap-2 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-md">
                                                    <Zap size={10} className="text-green-500" />
                                                    <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Save {deal.discount}% Today</span>
                                                </div>
                                            </div>

                                            <div className="space-y-3 mb-10 text-white/40 text-[10px] font-black uppercase tracking-widest">
                                                <div className="flex items-center gap-3">
                                                    <ShieldCheck size={12} className="text-[#FFD700]" />
                                                    Free Cancellation
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Globe size={12} className="text-[#FFD700]" />
                                                    Instant Confirmation
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white/5 p-6 flex items-center justify-between group-hover:bg-[#FFD700] transition-all duration-500">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 group-hover:text-black transition-colors">Book on {deal.name}</span>
                                            <ExternalLink size={14} className="text-white/40 group-hover:text-black transition-colors" />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Trust Banner */}
                    {!loading && !searched && (
                        <div className="mt-20 flex flex-wrap justify-center gap-x-16 gap-y-10 animate-in fade-in duration-1000 delay-500">
                            {[
                                { icon: ShieldCheck, label: "Verified Deals", desc: "Trusted by millions" },
                                { icon: Zap, label: "Best Rate", desc: "Aggregated results" },
                                { icon: Globe, label: "Global Reach", desc: "2M+ Properties" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-5 group">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:border-[#FFD700]/50 group-hover:bg-[#FFD700]/10 transition-all">
                                        <item.icon size={20} className="text-white/30 group-hover:text-[#FFD700] transition-colors" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/80">{item.label}</span>
                                        <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{item.desc}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom transition gradient */}
            <div className="absolute bottom-0 left-0 w-full h-96 bg-gradient-to-t from-black via-black/80 to-transparent z-10 pointer-events-none"></div>
        </main>
    );
}

