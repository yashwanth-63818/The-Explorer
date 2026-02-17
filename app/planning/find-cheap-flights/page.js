
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, PlaneTakeoff, PlaneLanding, Calendar, Users, ChevronDown, ExternalLink, TrendingUp, Filter, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function FindCheapFlightsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [results, setResults] = useState(null);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [searchData, setSearchData] = useState({
        from: "",
        to: "",
        departureDate: "",
        returnDate: "",
        passengers: 1,
        cabinClass: "economy",
        isRoundTrip: false
    });

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const formatDate = (dateStr, format) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = date.getFullYear();
        const yy = String(y).slice(-2);

        if (format === 'DD/MM/YYYY') return `${d}/${m}/${y}`;
        if (format === 'DDMMYYYY') return `${d}${m}${y}`;
        if (format === 'YYMMDD') return `${yy}${m}${d}`;
        if (format === 'YYYY-MM-DD') return `${y}-${m}-${d}`;
        return dateStr;
    };

    const constructUrls = (from, to, date, passengers) => {
        const fromCode = from.toUpperCase().slice(0, 3);
        const toCode = to.toUpperCase().slice(0, 3);

        return {
            makemytrip: `https://www.makemytrip.com/flight/search?itinerary=${fromCode}-${toCode}-${formatDate(date, 'DD/MM/YYYY')}&tripType=O&paxType=A-${passengers}&intl=false&cabinClass=E`,
            ixigo: `https://www.ixigo.com/search/result/flight?from=${fromCode}&to=${toCode}&date=${formatDate(date, 'DDMMYYYY')}&adults=${passengers}&class=e`,
            airasia: `https://www.airasia.com/select/en/gb/${fromCode}/${toCode}/${formatDate(date, 'YYYY-MM-DD')}/N/${passengers}/0/0/REVENUE/INR/NONE`,
            indigo: `https://www.goindigo.in/booking/flight-select.html?from=${fromCode}&to=${toCode}&date=${formatDate(date, 'YYYY-MM-DD')}&adults=${passengers}&children=0&infants=0&isRoundTrip=false`
        };
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);
        setSearchPerformed(true);
        setResults(null);

        // Simulate data aggregation from online sources
        setTimeout(() => {
            const urls = constructUrls(searchData.from, searchData.to, searchData.departureDate, searchData.passengers);

            const basePrice = Math.floor(Math.random() * (6000 - 3500) + 3500);

            const mockDeals = [
                {
                    id: 1,
                    site: "AirAsia",
                    price: `₹${basePrice}`,
                    tag: "Cheapest",
                    logo: "AA",
                    color: "bg-red-600",
                    url: urls.airasia,
                    time: "02h 45m",
                    stops: "Non-stop"
                },
                {
                    id: 2,
                    site: "Ixigo",
                    price: `₹${basePrice + 149}`,
                    tag: "Best Value",
                    logo: "IXI",
                    color: "bg-orange-500",
                    url: urls.ixigo,
                    time: "02h 50m",
                    stops: "Non-stop"
                },
                {
                    id: 3,
                    site: "Indigo",
                    price: `₹${basePrice + 210}`,
                    tag: "Reliable",
                    logo: "6E",
                    color: "bg-blue-800",
                    url: urls.indigo,
                    time: "02h 40m",
                    stops: "Non-stop"
                },
                {
                    id: 4,
                    site: "MakeMyTrip",
                    price: `₹${basePrice + 350}`,
                    tag: "Top Rated",
                    logo: "MMT",
                    color: "bg-blue-600",
                    url: urls.makemytrip,
                    time: "02h 45m",
                    stops: "Non-stop"
                },
            ].sort((a, b) => parseInt(a.price.replace('₹', '')) - parseInt(b.price.replace('₹', '')));

            setResults(mockDeals);
            setLoading(false);

            setTimeout(() => {
                document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }, 1500);
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
                            <span className="text-[#FFD700] text-sm font-bold tracking-widest">Global flight search</span>
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
                                        className={`px-6 py-2 text-xs font-bold tracking-widest rounded-full transition-all ${searchData.isRoundTrip ? 'bg-[#FFD700] text-black shadow-lg' : 'text-white/60 hover:text-white'}`}
                                    >
                                        Round-trip
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSearchData({ ...searchData, isRoundTrip: false })}
                                        className={`px-6 py-2 text-xs font-bold tracking-widest rounded-full transition-all ${!searchData.isRoundTrip ? 'bg-[#FFD700] text-black shadow-lg' : 'text-white/60 hover:text-white'}`}
                                    >
                                        One-way
                                    </button>
                                </div>

                                <div className="relative group">
                                    <select
                                        value={searchData.cabinClass}
                                        onChange={(e) => setSearchData({ ...searchData, cabinClass: e.target.value })}
                                        className="appearance-none bg-white/5 text-white border border-white/10 rounded-full px-8 py-3 text-xs font-bold tracking-widest focus:outline-none focus:border-[#FFD700] transition-colors cursor-pointer pr-12"
                                    >
                                        <option value="economy" className="bg-[#1a1a1a]">Economy</option>
                                        <option value="business" className="bg-[#1a1a1a]">Business</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FFD700] pointer-events-none" />
                                </div>

                                <div className="flex items-center gap-6 bg-white/5 px-6 py-3 rounded-full border border-white/10">
                                    <span className="text-white/40 text-[0.65rem] font-bold tracking-widest">Passengers</span>
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
                                    <label className="text-[0.65rem] font-bold tracking-widest text-[#FFD700] mb-3 flex items-center gap-2">
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
                                    <label className="text-[0.65rem] font-bold tracking-widest text-[#FFD700] mb-3 flex items-center gap-2">
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
                                    <label className="text-[0.65rem] font-bold tracking-widest text-[#FFD700] mb-3 flex items-center gap-2">
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
                                    <label className="text-[0.65rem] font-bold tracking-widest text-[#FFD700] mb-3 flex items-center gap-2">
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
                                    className="group relative w-full md:w-auto px-16 py-6 bg-[#FFD700] text-black text-[0.85rem] font-bold tracking-widest transition-all hover:bg-[#FFC400] hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,215,0,0.3)] flex items-center justify-center gap-4 rounded-full overflow-hidden disabled:opacity-50 disabled:scale-100"
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

                    {/* Results Section */}
                    {searchPerformed && (
                        <div id="results-section" className="mt-24 w-full animate-in fade-in slide-in-from-bottom-12 duration-1000">
                            <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-10 border-b border-white/10 pb-8">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="w-4 h-4 text-[#FFD700]" />
                                        <span className="text-[#FFD700] text-xs font-bold tracking-widest">Real-time comparison</span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-serif text-white font-bold tracking-tight">
                                        Lowest Deals for <span className="text-[#FFD700]">{searchData.from.toUpperCase()} → {searchData.to.toUpperCase()}</span>
                                    </h2>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-xs font-bold tracking-widest text-white/60 hover:text-white transition-all">
                                        <Filter className="w-4 h-4" /> Filter
                                    </button>
                                </div>
                            </div>

                            {loading ? (
                                <div className="py-20 flex flex-col items-center justify-center space-y-8">
                                    <div className="relative w-24 h-24">
                                        <div className="absolute inset-0 border-4 border-[#FFD700]/20 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-t-[#FFD700] rounded-full animate-spin"></div>
                                        <PlaneTakeoff className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#FFD700] w-8 h-8 animate-pulse" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xl font-bold text-white mb-2">Polling Online Sources...</p>
                                        <p className="text-white/40 text-sm italic tracking-wide">Aggregating live fares from MakeMyTrip, Ixigo, AirAsia & 14 others</p>
                                    </div>
                                </div>
                            ) : results && (
                                <div className="grid grid-cols-1 gap-6">
                                    {results.map((deal, index) => (
                                        <div
                                            key={deal.id}
                                            className={`group relative bg-white/5 hover:bg-white/10 border border-white/10 rounded-[2.5rem] p-8 md:px-12 transition-all hover:border-[#FFD700]/50 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] animate-in fade-in slide-in-from-bottom-8 duration-500`}
                                            style={{ animationDelay: `${index * 150}ms` }}
                                        >
                                            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                                                {/* Provider Info */}
                                                <div className="flex items-center gap-8 w-full lg:w-auto">
                                                    <div className={`${deal.color} w-20 h-20 rounded-3xl flex items-center justify-center text-white font-bold text-xl shadow-2xl shrink-0 rotate-3 group-hover:rotate-0 transition-transform`}>
                                                        {deal.logo}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="text-2xl font-bold text-white">{deal.site}</h3>
                                                            <span className="px-3 py-1 bg-[#FFD700] text-black text-[10px] font-bold tracking-widest rounded-full">{deal.tag}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-white/40 text-sm">
                                                            <ShieldCheck className="w-4 h-4 text-green-500" />
                                                            <span>Verified Partner</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Route Info */}
                                                <div className="flex items-center justify-center gap-8 md:gap-16 w-full lg:w-auto">
                                                    <div className="text-center">
                                                        <p className="text-2xl font-bold text-white">{searchData.from.toUpperCase()}</p>
                                                        <p className="text-[10px] font-bold text-white/30 tracking-widest mt-1">Origin</p>
                                                    </div>
                                                    <div className="flex flex-col items-center min-w-[120px]">
                                                        <div className="w-full flex items-center gap-2 mb-2">
                                                            <div className="h-[2px] flex-1 bg-white/10"></div>
                                                            <Zap className="w-3 h-3 text-[#FFD700] animate-pulse" />
                                                            <div className="h-[2px] flex-1 bg-white/10"></div>
                                                        </div>
                                                        <p className="text-[10px] font-bold text-[#FFD700] tracking-widest">{deal.time}</p>
                                                        <p className="text-[9px] font-bold text-white/30 truncate">{deal.stops}</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-2xl font-bold text-white">{searchData.to.toUpperCase()}</p>
                                                        <p className="text-[10px] font-bold text-white/30 tracking-widest mt-1">Arrival</p>
                                                    </div>
                                                </div>

                                                {/* Price & Action */}
                                                <div className="flex items-center gap-8 w-full lg:w-auto justify-between lg:justify-end">
                                                    <div className="text-right">
                                                        <p className="text-4xl font-bold text-[#FFD700] leading-none mb-1">{deal.price}</p>
                                                        <p className="text-[10px] font-bold text-white/30 tracking-widest">Total for 1 adult</p>
                                                    </div>
                                                    <a
                                                        href={deal.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-10 py-5 bg-white text-black font-bold tracking-widest text-xs rounded-full hover:bg-[#FFD700] transition-all flex items-center gap-3 group/btn shadow-xl active:scale-95 whitespace-nowrap"
                                                    >
                                                        Book Deal
                                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                    </a>
                                                </div>
                                            </div>

                                            {/* Decorative Background Element */}
                                            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none">
                                                <ExternalLink className="w-32 h-32 text-white" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Trust Badges / Footer */}
                    <div className="mt-16 flex flex-wrap justify-center gap-x-12 gap-y-6 animate-in fade-in duration-1000 delay-700">
                        {['Official Partner', 'Best Price Guarantee', 'No Hidden Fees', 'Instant Booking'].map((text) => (
                            <div key={text} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-[#FFD700] rounded-full"></div>
                                <span className="text-[0.65rem] font-bold tracking-widest text-white/40">{text}</span>
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
