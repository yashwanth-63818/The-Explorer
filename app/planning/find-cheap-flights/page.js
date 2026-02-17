
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
        fromCode: "",
        to: "",
        toCode: "",
        departureDate: "",
        returnDate: "",
        passengers: 1,
        cabinClass: "economy",
        isRoundTrip: false
    });

    const [suggestions, setSuggestions] = useState([]);
    const [activeInput, setActiveInput] = useState(null); // 'from' or 'to'
    const [isSearchingLocations, setIsSearchingLocations] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        const handleClickOutside = (e) => {
            if (!e.target.closest('.search-input-group')) {
                setActiveInput(null);
                setSuggestions([]);
            }
        };
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Debounced location search
    useEffect(() => {
        const keyword = activeInput === 'from' ? searchData.from : searchData.to;

        if (!keyword || keyword.length < 2 || (activeInput === 'from' && searchData.fromCode) || (activeInput === 'to' && searchData.toCode)) {
            setSuggestions([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearchingLocations(true);
            try {
                const res = await fetch(`/api/flights/locations?keyword=${keyword}`);
                const data = await res.json();
                setSuggestions(data.data || []);
            } catch (err) {
                console.error("Location search failed:", err);
            } finally {
                setIsSearchingLocations(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchData.from, searchData.to, activeInput]);

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

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSearchPerformed(true);
        setResults(null);

        try {
            const origin = searchData.fromCode || searchData.from;
            const destination = searchData.toCode || searchData.to;

            const returnDateParam = searchData.isRoundTrip && searchData.returnDate ? `&returnDate=${searchData.returnDate}` : '';
            const response = await fetch(
                `/api/flights/search?origin=${origin}&destination=${destination}&date=${searchData.departureDate}&passengers=${searchData.passengers}${returnDateParam}`
            );
            const result = await response.json();

            if (result.error) {
                console.error("API Error:", result.error);
                alert(result.error); // Basic alert for immediate feedback
                setResults([]);
            } else if (result.data && result.data.length === 0) {
                alert(result.message || "No flights found in this test sandbox. Try routes like MAD to PAR or NYC to LON.");
                setResults([]);
            } else {
                setResults(result.data || []);
            }
        } catch (error) {
            console.error("Flight Search Failed:", error);
            // Fallback empty results to avoid stuck loading
            setResults([]);
        } finally {
            setLoading(false);
            setTimeout(() => {
                document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-0 bg-white/5 rounded-[1.5rem] p-2 border border-white/5">
                                {/* Origin */}
                                <div className="p-6 md:border-r border-white/10 hover:bg-white/5 transition-colors group relative search-input-group">
                                    <label className="text-[0.65rem] font-bold tracking-widest text-[#FFD700] mb-3 flex items-center gap-2">
                                        <PlaneTakeoff className="w-3 h-3" />
                                        Departure From
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Origin (City, Country or Airport)"
                                        value={searchData.from}
                                        onFocus={() => setActiveInput('from')}
                                        onChange={(e) => setSearchData({ ...searchData, from: e.target.value, fromCode: "" })}
                                        className="w-full bg-transparent text-xl font-bold text-white placeholder:text-white/20 focus:outline-none"
                                    />
                                    {activeInput === 'from' && (isSearchingLocations || suggestions.length > 0) && (
                                        <div className="absolute left-0 top-full w-full z-[100] bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden shadow-2xl mt-1 max-h-60 overflow-y-auto">
                                            {isSearchingLocations ? (
                                                <div className="p-6 flex items-center justify-center gap-3">
                                                    <div className="w-4 h-4 border-2 border-[#FFD700]/20 border-t-[#FFD700] rounded-full animate-spin"></div>
                                                    <span className="text-[10px] font-bold text-white/40 tracking-widest uppercase">Searching locations...</span>
                                                </div>
                                            ) : suggestions.length > 0 ? (
                                                suggestions.map((loc, idx) => (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        onClick={() => {
                                                            setSearchData({ ...searchData, from: `${loc.cityName} (${loc.iataCode})`, fromCode: loc.iataCode });
                                                            setSuggestions([]);
                                                            setActiveInput(null);
                                                        }}
                                                        className="w-full text-left px-5 py-4 hover:bg-white/10 border-b border-white/5 transition-colors group"
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <p className="text-white font-bold text-sm tracking-tight">{loc.name}</p>
                                                                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-0.5">{loc.cityName}, {loc.countryName}</p>
                                                            </div>
                                                            <span className="text-[#FFD700] font-black text-xs bg-[#FFD700]/10 px-2 py-1 rounded">{loc.iataCode}</span>
                                                        </div>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="p-6 text-center">
                                                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                                                        No matches found.<br />
                                                        <span className="text-[9px] lowercase opacity-50">Try major hubs like Madrid, London, or New York.</span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Destination */}
                                <div className="p-6 lg:border-r border-white/10 hover:bg-white/5 transition-colors group relative search-input-group">
                                    <label className="text-[0.65rem] font-bold tracking-widest text-[#FFD700] mb-3 flex items-center gap-2">
                                        <PlaneLanding className="w-3 h-3" />
                                        Arriving To
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Destination (City, Country or Airport)"
                                        value={searchData.to}
                                        onFocus={() => setActiveInput('to')}
                                        onChange={(e) => setSearchData({ ...searchData, to: e.target.value, toCode: "" })}
                                        className="w-full bg-transparent text-xl font-bold text-white placeholder:text-white/20 focus:outline-none"
                                    />
                                    {activeInput === 'to' && (isSearchingLocations || suggestions.length > 0) && (
                                        <div className="absolute left-0 top-full w-full z-[100] bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden shadow-2xl mt-1 max-h-60 overflow-y-auto">
                                            {isSearchingLocations ? (
                                                <div className="p-6 flex items-center justify-center gap-3">
                                                    <div className="w-4 h-4 border-2 border-[#FFD700]/20 border-t-[#FFD700] rounded-full animate-spin"></div>
                                                    <span className="text-[10px] font-bold text-white/40 tracking-widest uppercase">Searching locations...</span>
                                                </div>
                                            ) : suggestions.length > 0 ? (
                                                suggestions.map((loc, idx) => (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        onClick={() => {
                                                            setSearchData({ ...searchData, to: `${loc.cityName} (${loc.iataCode})`, toCode: loc.iataCode });
                                                            setSuggestions([]);
                                                            setActiveInput(null);
                                                        }}
                                                        className="w-full text-left px-5 py-4 hover:bg-white/5 border-b border-white/5 transition-colors group"
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <p className="text-white font-bold text-sm tracking-tight">{loc.name}</p>
                                                                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-0.5">{loc.cityName}, {loc.countryName}</p>
                                                            </div>
                                                            <span className="text-[#FFD700] font-black text-xs bg-[#FFD700]/10 px-2 py-1 rounded">{loc.iataCode}</span>
                                                        </div>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="p-6 text-center">
                                                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                                                        No matches found.<br />
                                                        <span className="text-[9px] lowercase opacity-50">Try major hubs like Madrid, London, or New York.</span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
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
                                    <div className="mt-4 flex items-center gap-3">
                                        <span className="px-3 py-1 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-full text-[10px] font-bold text-[#FFD700] uppercase tracking-widest">
                                            Developer Sandbox
                                        </span>
                                        <p className="text-white/40 text-[10px] italic">Showing simulated/test data from Amadeus API</p>
                                    </div>
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
                                            className="relative bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-8 duration-500 hover:border-[#FFD700]/30 shadow-2xl"
                                            style={{ animationDelay: `${index * 150}ms` }}
                                        >
                                            <div className="flex flex-col lg:flex-row min-h-[140px]">
                                                {/* Left Section: Flight Progress */}
                                                <div className="flex-1 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8">

                                                    {/* Airline Identity */}
                                                    <div className="flex items-center gap-5 w-full md:w-56 shrink-0">
                                                        <div className="w-12 h-12 rounded-xl bg-white p-2 flex items-center justify-center shrink-0 shadow-xl ring-1 ring-black/5">
                                                            <img
                                                                src={deal.logo}
                                                                alt={deal.airline}
                                                                className="w-full h-full object-contain"
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    const fallback = document.createElement('span');
                                                                    fallback.className = "text-[12px] font-black text-black tracking-tight";
                                                                    fallback.innerText = deal.carrierCode || 'FL';
                                                                    e.target.parentElement.appendChild(fallback);
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <h4 className="text-[15px] font-bold text-white truncate leading-tight">{deal.airline}</h4>
                                                            <div className="flex items-center gap-1.5 mt-1">
                                                                <ShieldCheck className="w-3 h-3 text-green-500/80" />
                                                                <span className="text-[9px] text-white/30 font-bold uppercase tracking-[0.15em]">Verified Deal</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* The Timeline */}
                                                    <div className="flex items-center justify-center gap-6 md:gap-16 flex-1 w-full">
                                                        {/* Departure */}
                                                        <div className="text-right min-w-[70px]">
                                                            <p className="text-2xl font-bold text-white tracking-tight leading-none mb-1">{deal.depTime}</p>
                                                            <p className="text-[11px] font-bold text-white/40 tracking-[0.2em] uppercase">{searchData.from.toUpperCase()}</p>
                                                        </div>

                                                        {/* Visual Path */}
                                                        <div className="flex flex-col items-center flex-1 max-w-[180px]">
                                                            <p className="text-[10px] font-bold text-white/30 tracking-widest mb-1.5 uppercase">{deal.duration}</p>
                                                            <div className="w-full flex items-center gap-3">
                                                                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/20 to-white/20"></div>
                                                                <div className={`relative px-2 py-0.5 rounded-full border border-white/10 flex items-center gap-1.5 bg-black/40`}>
                                                                    <div className={`w-1.5 h-1.5 rounded-full ${deal.stops === 'Direct' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`}></div>
                                                                </div>
                                                                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-white/20 to-white/20"></div>
                                                            </div>
                                                            <p className={`text-[10px] font-bold tracking-widest mt-1.5 uppercase ${deal.stops === 'Direct' ? 'text-green-500/80' : 'text-red-500/80'}`}>
                                                                {deal.stops} {deal.stopCities && <span className="text-white/20 ml-1 font-medium">{deal.stopCities}</span>}
                                                            </p>
                                                        </div>

                                                        {/* Arrival */}
                                                        <div className="text-left min-w-[70px]">
                                                            <p className="text-2xl font-bold text-white tracking-tight leading-none mb-1">{deal.arrTime}</p>
                                                            <p className="text-[11px] font-bold text-white/40 tracking-[0.2em] uppercase">{searchData.to.toUpperCase()}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right Section: Price & Action */}
                                                <div className="w-full lg:w-72 p-6 md:p-8 bg-white/[0.03] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-6">
                                                    <div className="text-left lg:text-center">
                                                        <p className="text-[9px] font-bold text-white/30 tracking-[0.2em] uppercase mb-1">Price per adult</p>
                                                        <p className="text-4xl font-bold text-[#FFD700] tracking-tight leading-none">
                                                            ₹{deal.price.toLocaleString('en-IN')}
                                                        </p>
                                                    </div>
                                                    <a
                                                        href={deal.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-10 py-4 bg-white text-black font-bold tracking-[0.2em] text-[11px] uppercase rounded-xl hover:bg-[#FFD700] transition-all flex items-center gap-4 shadow-2xl active:scale-95 group/select"
                                                    >
                                                        Select
                                                        <ArrowRight className="w-4 h-4 transition-transform group-hover/select:translate-x-1.5" />
                                                    </a>
                                                </div>
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
            </div >

            {/* Bottom transition gradient */}
            < div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black via-black/50 to-transparent z-10 pointer-events-none" ></div >
        </main >
    );
}
