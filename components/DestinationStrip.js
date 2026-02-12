import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

/**
 * Premium Country Card Grid
 * Replaces the minimalist icon strip with high-impact visual cards.
 * Updated to use confirmed editorial countries.
 */

const featuredCountries = [
    {
        name: "Thailand",
        slug: "thailand",
        image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1000&auto=format&fit=crop",
        guides: "12 Guides",
        tagline: "Tropical Paradise"
    },
    {
        name: "Japan",
        slug: "japan",
        image: "https://images.unsplash.com/photo-1480796275477-9dc144b54701?q=80&w=1000&auto=format&fit=crop",
        guides: "15 Guides",
        tagline: "Land of the Rising Sun"
    },
    {
        name: "Italy",
        slug: "italy",
        image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1000&auto=format&fit=crop",
        guides: "18 Guides",
        tagline: "The Eternal Beauty"
    },
    {
        name: "China",
        slug: "china",
        image: "https://images.unsplash.com/photo-1508197149814-0cc02e8b7f74?q=80&w=1000&auto=format&fit=crop",
        guides: "10 Guides",
        tagline: "Empire of Dreams"
    },
    {
        name: "Indonesia",
        slug: "indonesia",
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop",
        guides: "14 Guides",
        tagline: "Island of Gods"
    },
    {
        name: "France",
        slug: "france",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop",
        guides: "16 Guides",
        tagline: "Art of Living"
    },
    {
        name: "Australia",
        slug: "australia",
        image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=1000&auto=format&fit=crop",
        guides: "9 Guides",
        tagline: "The Great Southern Land"
    },
    {
        name: "Switzerland",
        slug: "switzerland",
        image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1000&auto=format&fit=crop",
        guides: "11 Guides",
        tagline: "Alpine Serenity"
    }
];

export default function DestinationStrip() {
    return (
        <section className="bg-black py-24 relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
                    <div className="text-left">
                        <h2 className="text-gray-400 text-xs md:text-sm font-bold tracking-[0.3em] uppercase mb-3">
                            Destinations
                        </h2>
                        <h3 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">
                            Where do you <span className="text-yellow-400 italic">want to go?</span>
                        </h3>
                    </div>

                    <Link
                        href="/destinations"
                        className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 py-3 px-6 rounded-full border border-white/10 transition-all duration-300"
                    >
                        <span className="text-white text-sm font-bold uppercase tracking-wider">Explore All</span>
                        <div className="bg-yellow-400 p-1.5 rounded-full text-black transition-transform duration-300 group-hover:translate-x-1">
                            <ArrowRight size={14} strokeWidth={3} />
                        </div>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredCountries.map((country) => (
                        <Link
                            key={country.slug}
                            href={`/destinations/${country.slug}`}
                            className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#1c1c1c] cursor-pointer"
                        >
                            {/* Gradient Overlay for better text contrast */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity duration-500 opacity-90 group-hover:opacity-100" />

                            {/* Main Image */}
                            <img
                                src={country.image}
                                alt={country.name}
                                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0 group-hover:rotate-1"
                            />

                            {/* Hover Border Glow */}
                            <div className="absolute inset-0 border border-white/0 group-hover:border-yellow-400/30 rounded-2xl z-20 transition-all duration-500 pointer-events-none" />

                            {/* Content Layout - All interactive elements inside Link */}
                            <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end">
                                <div className="flex items-center gap-2 mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100 delay-75">
                                    <MapPin size={12} className="text-yellow-400" />
                                    <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest leading-none">
                                        {country.guides}
                                    </span>
                                </div>

                                <h4 className="text-3xl font-serif font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors duration-300">
                                    {country.name}
                                </h4>

                                <p className="text-gray-400 text-xs font-medium translate-y-2 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100 delay-150">
                                    {country.tagline}
                                </p>
                            </div>

                            {/* Modern Decorative Accent */}
                            <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-20">
                                <ArrowRight size={18} className="text-white -rotate-45" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}


