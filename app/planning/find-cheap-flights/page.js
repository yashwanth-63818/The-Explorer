
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, PlaneTakeoff, PlaneLanding, Calendar, Users, ChevronDown } from "lucide-react";

export default function FindCheapFlightsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [searchData, setSearchData] = useState({
        from: "",
        to: "",
        departureDate: "",
        returnDate: "",
        passengers: 1,
        cabinClass: "economy",
        isRoundTrip: true
    });

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);

        const params = new URLSearchParams({
            from: searchData.from,
            to: searchData.to,
            departureDate: searchData.departureDate,
            passengers: searchData.passengers,
            cabinClass: searchData.cabinClass
        });

        if (searchData.isRoundTrip && searchData.returnDate) {
            params.append("returnDate", searchData.returnDate);
        }

        router.push(`/flights/results?${params.toString()}`);
    };

    return (
        <main className="relative min-h-screen bg-black overflow-hidden">
            {/* Background Image with Parallax */}
            <div
                className="absolute inset-0 z-0 transition-transform duration-500 ease-out"
                style={{
                    transform: `translateY(${scrollY * 0.15}px) scale(1.05)`,
                }}
            >
                <img
                    src="/images/premium-hero-dark.png"
                    alt="Premium Dark Nature Background"
                    className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.1]"
                />
                {/* Cinematic Overlay */}
                <div
                    className="absolute inset-0 z-10"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.3), rgba(0,0,0,1))'
                    }}
                ></div>
            </div>

            {/* Content Container */}
            <div className="relative z-20 w-full flex flex-col items-center justify-start pt-[calc(var(--nav-height)+60px)] md:pt-[calc(var(--nav-height)+120px)] pb-32 px-6 lg:px-12">
                <div className="w-full max-w-6xl mx-auto">

                    {/* Hero Header */}
                    <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                        <div className="inline-flex items-center gap-3 mb-6">
                            <span className="w-12 h-[1px] bg-[#FFD700]"></span>
                            <span className="text-[#FFD700] text-sm font-black uppercase tracking-[0.4em]">Global Flight Search</span>
                            <span className="w-12 h-[1px] bg-[#FFD700]"></span>
                        </div>
                        <h1 className="font-serif text-white font-bold leading-[1.05] drop-shadow-2xl mb-6">
                            <span className="text-[clamp(2.5rem,8vw,5.5rem)] block">Fly Beyond the</span>
                            <span className="text-[clamp(2.5rem,8vw,5.5rem)] text-[#FFD700] block italic">Horizon</span>
                        </h1>
                        <p className="font-sans text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            Compare thousands of routes and find the most exclusive deals from around the world. Your journey begins here.
                        </p>
                    </div>

                    {/* Search Form Card */}
                    <div className="bg-black/40 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-[2rem] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
                        <form onSubmit={handleSearch} className="space-y-10">

                            {/* Trip Type & Preferences */}
                            <div className="flex flex-wrap gap-8 items-center border-b border-white/10 pb-8">
                                <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => setSearchData({ ...searchData, isRoundTrip: true })}
                                        className={`px-6 py-2 text-xs font-black uppercase tracking-widest rounded-full transition-all ${searchData.isRoundTrip ? 'bg-[#FFD700] text-black shadow-lg' : 'text-white/60 hover:text-white'}`}
                                    >
                                        Round-trip
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSearchData({ ...searchData, isRoundTrip: false })}
                                        className={`px-6 py-2 text-xs font-black uppercase tracking-widest rounded-full transition-all ${!searchData.isRoundTrip ? 'bg-[#FFD700] text-black shadow-lg' : 'text-white/60 hover:text-white'}`}
                                    >
                                        One-way
                                    </button>
                                </div>

                                <div className="relative group">
                                    <select
                                        value={searchData.cabinClass}
                                        onChange={(e) => setSearchData({ ...searchData, cabinClass: e.target.value })}
                                        className="appearance-none bg-white/5 text-white border border-white/10 rounded-full px-8 py-3 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-[#FFD700] transition-colors cursor-pointer pr-12"
                                    >
                                        <option value="economy" className="bg-[#1a1a1a]">Economy</option>
                                        <option value="business" className="bg-[#1a1a1a]">Business</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FFD700] pointer-events-none" />
                                </div>

                                <div className="flex items-center gap-6 bg-white/5 px-6 py-3 rounded-full border border-white/10">
                                    <span className="text-white/40 text-[0.65rem] font-black uppercase tracking-widest">Passengers</span>
                                    <div className="flex items-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setSearchData({ ...searchData, passengers: Math.max(1, searchData.passengers - 1) })}
                                            className="w-6 h-6 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#FFD700] hover:text-black transition-all"
                                        >-</button>
                                        <span className="text-white text-sm font-bold min-w-[12px] text-center">{searchData.passengers}</span>
                                        <button
                                            type="button"
                                            onClick={() => setSearchData({ ...searchData, passengers: Math.min(9, searchData.passengers + 1) })}
                                            className="w-6 h-6 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#FFD700] hover:text-black transition-all"
                                        >+</button>
                                    </div>
                                </div>
                            </div>

                            {/* Main Search Inputs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-0 bg-white/5 rounded-[1.5rem] p-2 border border-white/5 overflow-hidden">

                                {/* Origin */}
                                <div className="p-6 md:border-r border-white/10 hover:bg-white/5 transition-colors group">
                                    <label className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#FFD700] mb-3 flex items-center gap-2">
                                        <PlaneTakeoff className="w-3 h-3" />
                                        Departure From
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="City or Airport (e.g. NYC)"
                                        value={searchData.from}
                                        onChange={(e) => setSearchData({ ...searchData, from: e.target.value })}
                                        className="w-full bg-transparent text-xl font-bold text-white placeholder:text-white/20 focus:outline-none"
                                    />
                                </div>

                                {/* Destination */}
                                <div className="p-6 lg:border-r border-white/10 hover:bg-white/5 transition-colors group">
                                    <label className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#FFD700] mb-3 flex items-center gap-2">
                                        <PlaneLanding className="w-3 h-3" />
                                        Arriving To
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Destination (e.g. LHR)"
                                        value={searchData.to}
                                        onChange={(e) => setSearchData({ ...searchData, to: e.target.value })}
                                        className="w-full bg-transparent text-xl font-bold text-white placeholder:text-white/20 focus:outline-none"
                                    />
                                </div>

                                {/* Departure Date */}
                                <div className="p-6 md:border-r border-white/10 hover:bg-white/5 transition-colors group relative">
                                    <label className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#FFD700] mb-3 flex items-center gap-2">
                                        <Calendar className="w-3 h-3" />
                                        Departing On
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={searchData.departureDate}
                                        onChange={(e) => setSearchData({ ...searchData, departureDate: e.target.value })}
                                        className="w-full bg-transparent text-xl font-bold text-white focus:outline-none [color-scheme:dark] cursor-pointer"
                                    />
                                </div>

                                {/* Return Date */}
                                <div className={`p-6 hover:bg-white/5 transition-all group ${!searchData.isRoundTrip ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                                    <label className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#FFD700] mb-3 flex items-center gap-2">
                                        <Calendar className="w-3 h-3" />
                                        Returning On
                                    </label>
                                    <input
                                        type="date"
                                        required={searchData.isRoundTrip}
                                        value={searchData.returnDate}
                                        onChange={(e) => setSearchData({ ...searchData, returnDate: e.target.value })}
                                        className="w-full bg-transparent text-xl font-bold text-white focus:outline-none [color-scheme:dark] cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Submit Section */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-4">
                                <div className="flex items-center gap-4 text-white/40">
                                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
                                        <Search className="w-4 h-4" />
                                    </div>
                                    <p className="text-xs font-medium tracking-wide">Searching providers: <span className="text-white/60">Skyscanner, Kiwi.com, Travelpayouts Network</span></p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group relative w-full md:w-auto px-16 py-6 bg-[#FFD700] text-black text-[0.85rem] font-black uppercase tracking-[0.3em] transition-all hover:bg-[#FFC400] hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,215,0,0.3)] flex items-center justify-center gap-4 rounded-full overflow-hidden disabled:opacity-50 disabled:scale-100"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4 text-black" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Analyzing Prices...
                                        </span>
                                    ) : (
                                        <>
                                            Find Best Fare
                                            <Search className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[3px]" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Trust Badges / Footer */}
                    <div className="mt-16 flex flex-wrap justify-center gap-x-12 gap-y-6 animate-in fade-in duration-1000 delay-700">
                        {['Official Partner', 'Best Price Guarantee', 'No Hidden Fees', 'Instant Booking'].map((text) => (
                            <div key={text} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-[#FFD700] rounded-full"></div>
                                <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-white/40">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom transition gradient */}
            <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black via-black/50 to-transparent z-10 pointer-events-none"></div>
        </main>
    );
}
