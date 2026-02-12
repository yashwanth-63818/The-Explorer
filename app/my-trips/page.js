"use client";
import Link from "next/link";

export default function MyTripsPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header Padding to clear fixed Navbar */}
            <div className="h-32 bg-black"></div>

            <div className="container mx-auto max-w-5xl py-20 px-6">
                <div className="bg-black text-white rounded-[40px] p-12 md:p-20 shadow-2xl relative overflow-hidden border-2 border-[#FFD700]">
                    {/* Decorative Yellow Element */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700] opacity-10 rounded-full -mr-32 -mt-32 blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="mb-12">
                            <h3 className="text-[#FFD700] text-xs font-black uppercase tracking-[0.3em] mb-4">YOUR ADVENTURES</h3>
                            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
                                My <br /><span className="text-[#FFD700]">Trips</span>
                            </h1>
                            <p className="text-white/60 text-lg max-w-md font-medium">Manage your saved itineraries and upcoming global explorations in one place.</p>
                        </div>

                        {/* Empty State - High Contrast */}
                        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-[#FFD700]/30 rounded-[32px] bg-white/[0.03]">
                            <div className="w-20 h-20 bg-[#FFD700] rounded-3xl flex items-center justify-center shadow-2xl mb-8 text-black rotate-3 transition-transform hover:rotate-0">
                                <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
                                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tight">No trips planned yet</h3>
                            <p className="text-white/40 text-center max-w-sm mb-10 font-bold uppercase text-[11px] tracking-widest leading-loose">
                                Your passport is empty. start exploring global destinations and save them to begin your journey.
                            </p>
                            <Link
                                href="/destinations"
                                className="px-12 py-5 bg-[#FFD700] text-black font-black uppercase tracking-[0.15em] text-xs rounded-full border-2 border-black hover:bg-white transition-all active:scale-95"
                            >
                                Start Exploring
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
