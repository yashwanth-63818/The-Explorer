
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, PlaneTakeoff, PlaneLanding, Calendar, Users, Briefcase, ArrowRightLeft } from "lucide-react";

export default function FlightSearchPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [searchData, setSearchData] = useState({
        from: "",
        to: "",
        departureDate: "",
        returnDate: "",
        passengers: 1,
        cabinClass: "economy",
        isRoundTrip: true
    });

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
        <main className="min-h-screen bg-[#121212] pt-[120px] pb-20">
            <div className="container mx-auto px-6 lg:px-12">
                {/* Header */}
                <div className="max-w-4xl mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h1 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] text-white font-bold leading-tight mb-4">
                        Find Your Next <span className="text-[#FFD700]">Adventure</span>
                    </h1>
                    <p className="font-sans text-xl text-white/70 max-w-2xl">
                        Compare flight prices from multiple providers and score the best deals for your journey.
                    </p>
                </div>

                {/* Search Form Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
                    <form onSubmit={handleSearch} className="space-y-8">

                        {/* Trip Type & Cabin Class Selection */}
                        <div className="flex flex-wrap gap-6 items-center border-b border-white/10 pb-6">
                            <div className="flex bg-white/5 p-1 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setSearchData({ ...searchData, isRoundTrip: true })}
                                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${searchData.isRoundTrip ? 'bg-[#FFD700] text-black' : 'text-white hover:bg-white/10'}`}
                                >
                                    Round-trip
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSearchData({ ...searchData, isRoundTrip: false })}
                                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${!searchData.isRoundTrip ? 'bg-[#FFD700] text-black' : 'text-white hover:bg-white/10'}`}
                                >
                                    One-way
                                </button>
                            </div>

                            <select
                                value={searchData.cabinClass}
                                onChange={(e) => setSearchData({ ...searchData, cabinClass: e.target.value })}
                                className="bg-white/5 text-white border border-white/10 rounded-lg px-4 py-2 text-sm font-semibold focus:outline-none focus:border-[#FFD700] transition-colors"
                            >
                                <option value="economy" className="bg-[#1a1a1a]">Economy</option>
                                <option value="business" className="bg-[#1a1a1a]">Business</option>
                            </select>

                            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                                <Users className="w-4 h-4 text-[#FFD700]" />
                                <span className="text-white text-sm font-semibold">{searchData.passengers} Passenger{searchData.passengers > 1 ? 's' : ''}</span>
                                <div className="flex gap-2 ml-2">
                                    <button
                                        type="button"
                                        onClick={() => setSearchData({ ...searchData, passengers: Math.max(1, searchData.passengers - 1) })}
                                        className="w-6 h-6 flex items-center justify-center rounded bg-white/10 text-white hover:bg-white/20"
                                    >-</button>
                                    <button
                                        type="button"
                                        onClick={() => setSearchData({ ...searchData, passengers: Math.min(9, searchData.passengers + 1) })}
                                        className="w-6 h-6 flex items-center justify-center rounded bg-white/10 text-white hover:bg-white/20"
                                    >+</button>
                                </div>
                            </div>
                        </div>

                        {/* Search Fields Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                            {/* Origin */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-white/50 flex items-center gap-2">
                                    <PlaneTakeoff className="w-3 h-3" />
                                    From
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="City or Airport (e.g. NYC)"
                                    value={searchData.from}
                                    onChange={(e) => setSearchData({ ...searchData, from: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition-all"
                                />
                            </div>

                            {/* Destination */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-white/50 flex items-center gap-2">
                                    <PlaneLanding className="w-3 h-3" />
                                    To
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="City or Airport (e.g. LHR)"
                                    value={searchData.to}
                                    onChange={(e) => setSearchData({ ...searchData, to: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition-all"
                                />
                            </div>

                            {/* Departure Date */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-white/50 flex items-center gap-2">
                                    <Calendar className="w-3 h-3" />
                                    Departure
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={searchData.departureDate}
                                    onChange={(e) => setSearchData({ ...searchData, departureDate: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition-all [color-scheme:dark]"
                                />
                            </div>

                            {/* Return Date */}
                            <div className={`space-y-2 transition-opacity duration-300 ${!searchData.isRoundTrip ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                                <label className="text-xs font-black uppercase tracking-widest text-white/50 flex items-center gap-2">
                                    <Calendar className="w-3 h-3" />
                                    Return
                                </label>
                                <input
                                    type="date"
                                    required={searchData.isRoundTrip}
                                    value={searchData.returnDate}
                                    onChange={(e) => setSearchData({ ...searchData, returnDate: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition-all [color-scheme:dark]"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="group px-12 py-5 bg-[#FFD700] text-black text-[0.95rem] font-bold uppercase tracking-[0.15em] transition-all hover:bg-[#FFC400] hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(255,215,0,0.2)] flex items-center gap-3 rounded-xl disabled:opacity-50 disabled:scale-100"
                            >
                                {loading ? "Searching..." : (
                                    <>
                                        Search Flights
                                        <Search className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Info Section */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-[#FFD700]/10 rounded-full flex items-center justify-center">
                            <Briefcase className="w-6 h-6 text-[#FFD700]" />
                        </div>
                        <h3 className="text-xl font-serif font-bold text-white">Compare Everywhere</h3>
                        <p className="text-white/60 leading-relaxed">We search hundreds of providers including Skyscanner and Kiwi.com to find you the best possible route.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-[#FFD700]/10 rounded-full flex items-center justify-center">
                            <ArrowRightLeft className="w-6 h-6 text-[#FFD700]" />
                        </div>
                        <h3 className="text-xl font-serif font-bold text-white">Direct Deep Links</h3>
                        <p className="text-white/60 leading-relaxed">No middleman fees. We provide direct affiliate links so you can book directly with the provider.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-[#FFD700]/10 rounded-full flex items-center justify-center">
                            <PlaneTakeoff className="w-6 h-6 text-[#FFD700]" />
                        </div>
                        <h3 className="text-xl font-serif font-bold text-white">Budget Optimized</h3>
                        <p className="text-white/60 leading-relaxed">Our algorithms prioritize the "Best Deal" badge for the cheapest fares available across all networks.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
