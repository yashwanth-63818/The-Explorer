import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function DiscoverWorld() {
    return (
        <section className="bg-[#121212] py-20 lg:py-32 relative overflow-hidden">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Visualization Map (Yellow Filled Landmasses) */}
                    <div className="relative animate-in fade-in slide-in-from-left duration-1000 w-full">
                        <svg viewBox="0 0 1000 500" className="w-full h-auto drop-shadow-2xl opacity-90 hover:opacity-100 transition-opacity duration-500">
                            {/* World Map - Simplified Vector Shapes filled with YELLOW (#FFD700) */}
                            <g fill="#FBBF24" stroke="none">
                                {/* North America */}
                                <path d="M50 80 L180 80 L220 180 L120 220 L70 150 Z" opacity="0.9" />
                                <path d="M90 60 L140 60 L130 90 L80 90 Z" opacity="0.9" /> {/* Canada Islands */}

                                {/* South America */}
                                <path d="M160 230 L230 240 L240 300 L180 380 L150 280 Z" opacity="0.9" />

                                {/* Europe */}
                                <path d="M430 70 L500 70 L520 120 L480 140 L440 120 Z" opacity="0.9" />
                                <path d="M400 90 L420 90 L410 110 Z" opacity="0.9" /> {/* UK */}

                                {/* Africa */}
                                <path d="M420 160 L530 160 L550 250 L480 320 L400 230 L400 170 Z" opacity="0.9" />

                                {/* Asia */}
                                <path d="M540 80 L750 80 L820 150 L750 220 L650 240 L580 180 L540 130 Z" opacity="0.9" />
                                <path d="M780 90 L850 90 L820 140 Z" opacity="0.9" /> {/* Russia East */}
                                <path d="M680 250 L720 250 L700 280 Z" opacity="0.9" /> {/* Indiaish */}

                                {/* Southeast Asia Islands */}
                                <path d="M750 250 L800 250 L780 290 L740 280 Z" opacity="0.9" />
                                <path d="M820 260 L850 260 L850 290 L820 290 Z" opacity="0.9" />

                                {/* Oceania */}
                                <path d="M800 320 L920 320 L900 400 L820 400 Z" opacity="0.9" />
                                <path d="M930 380 L960 380 L950 420 L940 410 Z" opacity="0.9" /> {/* NZ */}
                            </g>
                        </svg>
                    </div>

                    {/* Right: Editorial Content */}
                    <div className="relative z-10 animate-in fade-in slide-in-from-right duration-1000 delay-300 text-right lg:text-right flex flex-col items-end">
                        <h2 className="font-serif text-6xl md:text-7xl lg:text-8xl font-medium tracking-tighter leading-[0.85] mb-6">
                            <span className="text-gray-400 block">DISCOVER</span>
                            <span className="text-gray-400 block">THE</span>
                            <span className="text-[#FBBF24]">WORLD</span>
                        </h2>

                        <p className="text-gray-400 mb-10 leading-relaxed font-light max-w-md text-lg text-right">
                            We have written over 600+ travel guides and backpacking itineraries to provide all the information you need to help plan your dream trip around the world.
                        </p>

                        <Link
                            href="/destinations"
                            className="inline-flex items-center justify-center px-8 py-3 border border-white/30 rounded-full text-white font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-black hover:border-white transition-all group"
                        >
                            Explore Destinations <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
}
