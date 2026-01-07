"use client";
import { ChevronRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import SafeImage from "./SafeImage";

export default function CountryHero({ name, facts, heroImage, intro, bestPlaces }) {
    const getPostSlug = (cityName) => {
        const cityPart = cityName.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]/g, '');
        const countryPart = name.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]/g, '');
        return `${cityPart}-${countryPart}-travel-guide`;
    };

    const scrollToContent = () => {
        const element = document.getElementById("utility-cards");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section className="relative h-screen min-h-[700px] flex flex-col items-center justify-center overflow-hidden pt-[var(--nav-height)]">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <SafeImage
                    src={heroImage}
                    alt={name}
                    fill
                    priority
                    className="object-cover scale-100 brightness-[0.7] transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center">
                {/* Breadcrumbs */}
                <nav className="flex justify-center items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white/90 mb-6 font-inter">
                    <span className="hover:text-white transition-colors cursor-default">{facts.region}</span>
                    <span className="text-white/40">›</span>
                    <span className="hover:text-white transition-colors cursor-default">{facts.subregion}</span>
                    <span className="text-white/40">›</span>
                </nav>

                <h1 className="text-[clamp(4rem,15vw,13rem)] font-black uppercase tracking-tighter leading-[0.85] mb-8 text-white font-serif drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                    {name}
                </h1>

                <p className="max-w-3xl mx-auto text-lg md:text-xl font-medium text-white/90 mb-10 leading-relaxed font-inter px-4">
                    {intro}
                </p>

                <button
                    onClick={scrollToContent}
                    className="group inline-flex items-center gap-2 px-8 py-3 bg-transparent text-white font-bold uppercase tracking-widest text-xs border-b-2 border-white/30 hover:border-white transition-all duration-300"
                >
                    Read More
                    <ChevronDown size={16} className="group-hover:translate-y-1 transition-transform" />
                </button>

                {/* Places to Visit - Floating Chips */}
                <div className="mt-20 flex flex-wrap justify-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/50 w-full mb-2">Places to Visit</span>
                    {(bestPlaces || []).slice(0, 4).map((place, i) => (
                        <Link
                            key={i}
                            href={`/posts/${getPostSlug(place.city)}`}
                            className="px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-md text-[11px] font-bold uppercase tracking-wider text-white hover:bg-white hover:text-black transition-all duration-300"
                        >
                            {place.city}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
