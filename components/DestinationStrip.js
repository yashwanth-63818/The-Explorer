import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Precise SVG paths to mimic the real map outlines shown in the user's reference.
// The "Thailand" shape includes a separate red dot element.

const mapShapes = {
    // Thailand: Long vertical shape with a "tail" and a "head"
    thailand: (
        <g transform="translate(4, 2) scale(0.8)">
            <path d="M10,2 C12,0 16,3 15,6 C16,8 14,12 12,14 C12,18 9,23 9,23 C9,23 7,20 8,17 C9,14 11,12 10,10 C9,8 7,5 10,2 Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            {/* The signature Red Dot */}
            <circle cx="18" cy="5" r="2.5" fill="#EF4444" stroke="none" className="animate-pulse" />
        </g>
    ),
    // Italy: The "Boot" shape
    italy: (
        <g transform="translate(6, 2) scale(0.9)">
            <path d="M4,2 C8,1 12,2 14,4 C15,6 14,9 13,11 C13,12 15,16 14,19 C13,21 11,21 11,21 L10,17 C10,17 9,14 8,12 C7,10 5,6 4,2 Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
    ),
    // Iceland: Oval-ish island with bumpy coast
    iceland: (
        <g transform="translate(2, 6) scale(0.9)">
            <path d="M2,6 C4,4 8,2 12,3 C16,4 18,5 19,8 C20,10 18,12 15,13 C12,14 8,14 5,12 C3,11 1,8 2,6 Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
    ),
    // Albania: Long vertical strip
    albania: (
        <g transform="translate(8, 2) scale(0.9)">
            <path d="M3,2 L7,2 C9,4 8,8 7,12 C6,16 5,19 4,20 L2,18 C3,15 4,12 3,8 L1,4 Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
    ),
    // Southeast Asia: Complex archipelago cluster
    "southeast-asia": (
        <g transform="translate(2, 4) scale(0.8)">
            <path d="M2,2 L6,4 L5,8 L2,6 Z M8,2 L12,3 L11,7 L7,6 Z M14,5 L18,6 L17,10 L13,9 Z M5,12 L10,13 L9,17 L4,16 Z M12,11 L16,12 L15,16 L11,15 Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
    ),
    // Europe: Solid landmass block
    europe: (
        <g transform="translate(2, 4) scale(0.8)">
            <path d="M2,14 L5,8 L10,6 L16,4 L20,8 L18,14 L12,18 L6,18 Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
    ),
    // South America: Triangle pointing down
    "south-america": (
        <g transform="translate(6, 2) scale(0.9)">
            <path d="M2,4 L8,2 L13,5 L11,14 L7,19 L3,10 Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
    ),
    // Central Asia: Horizontal block
    "central-asia": (
        <g transform="translate(2, 6) scale(0.9)">
            <path d="M2,6 L8,4 L14,4 L19,7 L16,12 L10,14 L4,12 Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
    ),
};

const destinations = [
    { name: "Thailand", slug: "thailand" },
    { name: "Italy", slug: "italy" },
    { name: "Iceland", slug: "iceland" },
    { name: "Albania", slug: "albania" },
    { name: "Southeast Asia", slug: "southeast-asia" },
    { name: "Europe", slug: "europe" },
    { name: "South America", slug: "south-america" },
    { name: "Central Asia", slug: "central-asia" },
];

export default function DestinationStrip() {
    return (
        <section className="bg-[#18181b] pt-12 pb-20 border-b border-white/5 relative z-20">
            {/* Background Texture matching the reference image's dark grey */}

            <div className="container mx-auto px-4 lg:px-8 text-center">

                <h2 className="text-gray-400 text-[11px] md:text-xs font-bold tracking-[0.25em] uppercase mb-16 opacity-80">
                    Where do you want to go?
                </h2>

                <div className="flex flex-wrap justify-center gap-x-12 gap-y-12">
                    {/* Country Items */}
                    {destinations.map((dest, i) => (
                        <Link
                            key={dest.slug}
                            href={dest.slug.includes('asia') || dest.slug.includes('europe') || dest.slug.includes('america') ? `/region/${dest.slug}` : `/destinations/${dest.slug}`}
                            className="group flex flex-col items-center gap-6"
                        >
                            {/* Map Container */}
                            <div className="w-16 h-12 flex items-center justify-center relative transition-transform duration-300 group-hover:-translate-y-1">
                                <svg viewBox="0 0 24 24" className="w-full h-full text-gray-300 group-hover:text-white transition-colors duration-300 drop-shadow-lg">
                                    {mapShapes[dest.slug] || <circle cx="12" cy="12" r="8" stroke="currentColor" fill="none" />}
                                </svg>
                            </div>

                            {/* Label */}
                            <span className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] group-hover:text-white transition-colors text-center w-24 leading-normal">
                                {dest.name}
                            </span>
                        </Link>
                    ))}

                    {/* Explore More Item */}
                    <Link href="/destinations" className="group flex flex-col items-center gap-6 cursor-pointer ml-4">
                        <div className="w-16 h-12 flex items-center justify-center relative transition-transform duration-300 group-hover:translate-x-1">
                            <ArrowRight className="w-8 h-8 text-gray-400 group-hover:text-white transition-colors opacity-80" strokeWidth={1.5} />
                        </div>
                        <span className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] group-hover:text-white transition-colors text-center w-24 leading-normal">
                            Explore<br />More
                        </span>
                    </Link>

                </div>
            </div>
        </section>
    );
}
