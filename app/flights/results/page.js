
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Plane, Clock, ArrowRight, ExternalLink, AlertCircle, ChevronLeft, Tag } from "lucide-react";

function FlightResults() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const departureDate = searchParams.get("departureDate");
    const returnDate = searchParams.get("returnDate");
    const passengers = searchParams.get("passengers");
    const cabinClass = searchParams.get("cabinClass");

    useEffect(() => {
        const fetchFlights = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/flights?${searchParams.toString()}`);
                const data = await res.json();

                if (data.success) {
                    setFlights(data.results);
                } else {
                    setError(data.message || "Failed to fetch results");
                }
            } catch (err) {
                setError("An error occurred while searching for flights.");
            } finally {
                setLoading(false);
            }
        };

        if (from && to && departureDate) {
            fetchFlights();
        }
    }, [searchParams]);

    if (loading) return <LoadingState from={from} to={to} />;
    if (error) return <ErrorState message={error} />;
    if (flights.length === 0) return <EmptyState />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-white font-serif text-3xl font-bold">
                    Found {flights.length} Flight{flights.length > 1 ? 's' : ''}
                </h2>
                <div className="text-white/50 text-sm font-sans">
                    Sorted by <span className="text-[#FFD700] font-bold uppercase tracking-widest">Cheapest First</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {flights.map((flight, idx) => (
                    <div
                        key={idx}
                        className={`group relative bg-white/5 backdrop-blur-md border ${flight.bestDeal ? 'border-[#FFD700]/50 shadow-[0_0_40px_rgba(255,215,0,0.1)]' : 'border-white/10 hover:border-white/30'} p-6 md:p-8 rounded-3xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-8`}
                        style={{ animationDelay: `${idx * 100}ms` }}
                    >
                        {flight.bestDeal && (
                            <div className="absolute -top-3 left-8 bg-[#FFD700] text-black text-[0.65rem] font-black uppercase tracking-[0.2em] px-4 py-1 rounded-full flex items-center gap-2 shadow-lg">
                                <Tag className="w-3 h-3 fill-black" />
                                Best Deal
                            </div>
                        )}

                        <div className="flex flex-col md:flex-row md:items-center gap-8">
                            {/* Airline Info */}
                            <div className="flex items-center gap-4 min-w-[150px]">
                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                                    <Plane className="w-6 h-6 text-[#FFD700]" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-lg leading-tight">{flight.airline}</p>
                                    <p className="text-white/40 text-xs font-black uppercase tracking-widest mt-1">{flight.provider}</p>
                                </div>
                            </div>

                            {/* Route & Timing */}
                            <div className="flex-1 flex items-center justify-between md:justify-center gap-4 md:gap-12 text-white">
                                <div className="text-center">
                                    <p className="text-2xl font-serif font-bold">{from}</p>
                                    <p className="text-white/40 text-[0.65rem] font-black tracking-widest uppercase">Origin</p>
                                </div>

                                <div className="flex flex-col items-center flex-1 max-w-[200px]">
                                    <span className="text-[0.65rem] font-black text-white/30 uppercase tracking-[0.3em] mb-2">
                                        {flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
                                    </span>
                                    <div className="relative w-full h-[2px] bg-white/10">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#FFD700] rotate-45"></div>
                                        <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30" />
                                    </div>
                                    <span className="flex items-center gap-2 text-white/60 text-xs mt-2 font-medium">
                                        <Clock className="w-3 h-3" />
                                        {flight.duration}
                                    </span>
                                </div>

                                <div className="text-center">
                                    <p className="text-2xl font-serif font-bold">{to}</p>
                                    <p className="text-white/40 text-[0.65rem] font-black tracking-widest uppercase">Destination</p>
                                </div>
                            </div>

                            {/* Price & CTA */}
                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8">
                                <div className="text-left md:text-right">
                                    <p className="text-white/40 text-[0.65rem] font-black tracking-widest uppercase mb-1">Total Price</p>
                                    <p className="text-3xl font-serif font-bold text-[#FFD700] leading-none">
                                        <span className="text-sm align-top mr-1">$</span>
                                        {flight.price}
                                    </p>
                                </div>
                                <a
                                    href={flight.deepLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group/btn relative px-8 py-4 bg-white text-black text-xs font-black uppercase tracking-[0.2em] rounded-xl transition-all hover:bg-[#FFD700] hover:scale-105 active:scale-95 flex items-center gap-3 overflow-hidden"
                                >
                                    View Deal
                                    <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function LoadingState({ from, to }) {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="h-10 bg-white/5 rounded-lg w-1/3"></div>
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-white/5 border border-white/10 h-[180px] rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex items-center gap-4 w-[150px]">
                        <div className="w-12 h-12 bg-white/10 rounded-xl"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-white/10 rounded w-20"></div>
                            <div className="h-3 bg-white/10 rounded w-12"></div>
                        </div>
                    </div>
                    <div className="flex-1 flex justify-center gap-12">
                        <div className="h-12 bg-white/10 rounded-lg w-20"></div>
                        <div className="h-12 bg-white/10 rounded-lg w-32"></div>
                        <div className="h-12 bg-white/10 rounded-lg w-20"></div>
                    </div>
                    <div className="w-[200px] flex flex-col items-end gap-3">
                        <div className="h-8 bg-white/10 rounded w-24"></div>
                        <div className="h-12 bg-white/10 rounded-xl w-full"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function ErrorState({ message }) {
    return (
        <div className="bg-red-500/10 border border-red-500/20 p-12 rounded-3xl text-center space-y-4">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-white font-serif text-2xl font-bold">Search Interrupted</h2>
            <p className="text-white/60 max-w-md mx-auto">{message}</p>
            <button
                onClick={() => window.location.reload()}
                className="mt-6 px-8 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-red-500 hover:text-white transition-colors"
            >
                Try Again
            </button>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="bg-white/5 border border-white/10 p-16 rounded-3xl text-center space-y-6">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plane className="w-10 h-10 text-white/20 -rotate-45" />
            </div>
            <h2 className="text-white font-serif text-3xl font-bold">No Flights Found</h2>
            <p className="text-white/50 max-w-md mx-auto">We couldn't find any flights matching your criteria. Try adjusting your dates or searching for nearby airports.</p>
            <button
                onClick={() => window.history.back()}
                className="mt-6 px-8 py-4 border-2 border-white/10 text-white text-xs font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-white hover:text-black transition-all"
            >
                Modify Search
            </button>
        </div>
    );
}

export default function ResultsPage() {
    return (
        <main className="min-h-screen bg-[#121212] pt-[120px] pb-20">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="mb-12">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 text-white/50 hover:text-[#FFD700] transition-colors group mb-8"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[0.65rem] font-black uppercase tracking-[0.3em]">Back to Search</span>
                    </button>

                    <Suspense fallback={<LoadingState />}>
                        <FlightResults />
                    </Suspense>
                </div>
            </div>
        </main>
    );
}
