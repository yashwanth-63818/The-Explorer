import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

const destinations = [
    { name: "Japan", image: "https://images.unsplash.com/photo-1493976040375-85c171242378?q=80&w=1000&auto=format&fit=crop", count: "12 Guides" },
    { name: "Thailand", image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1000&auto=format&fit=crop", count: "8 Guides" },
    { name: "Italy", image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1000&auto=format&fit=crop", count: "15 Guides" },
    { name: "Morocco", image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=1000&auto=format&fit=crop", count: "6 Guides" },
    { name: "New Zealand", image: "https://images.unsplash.com/photo-1469521669194-babb45599def?q=80&w=1000&auto=format&fit=crop", count: "9 Guides" },
    { name: "Iceland", image: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=1000&auto=format&fit=crop", count: "7 Guides" }
];

export default function Destinations() {
    return (
        <section className="py-20 bg-gray-900 text-white overflow-hidden">
            <div className="container mx-auto px-4 lg:px-8 mb-12 flex justify-between items-end">
                <div className="text-center w-full mb-8">
                    <h2 className="text-xl lg:text-2xl font-bold uppercase tracking-widest text-[#9CA3AF] mb-2">WHERE DO YOU WANT TO GO?</h2>
                </div>
                <Link href="/destinations" className="hidden md:flex items-center gap-2 text-sm font-medium uppercase tracking-wide hover:text-gray-300 transition-all">
                    Explore All <ArrowRight size={16} />
                </Link>
            </div>

            {/* Horizontal Scroll */}
            <div
                className="flex overflow-x-auto gap-6 px-4 lg:px-8 pb-8 snap-x [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {destinations.map((dest) => (
                    <Link
                        key={dest.name}
                        href={`/destinations/${dest.name.toLowerCase()}`}
                        className="flex-shrink-0 w-[280px] lg:w-[320px] group relative aspect-[3/4] overflow-hidden snap-start cursor-pointer"
                    >
                        <img
                            src={dest.image}
                            alt={dest.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                        <div className="absolute bottom-6 left-6">
                            <div className="flex items-center gap-1 text-gray-300 text-xs font-medium uppercase tracking-wider mb-2">
                                <MapPin size={12} />
                                {dest.count}
                            </div>
                            <h3 className="text-2xl font-serif font-bold group-hover:translate-x-1 transition-transform">
                                {dest.name}
                            </h3>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
