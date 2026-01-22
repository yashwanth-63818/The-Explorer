"use client";
import { ChevronDown } from "lucide-react";
import SafeImage from "./SafeImage";

export default function CountryHero({ name, facts, heroImage, intro }) {
    const scrollToContent = () => {
        const element = document.getElementById("places-to-visit");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section className="relative h-[90vh] min-h-[650px] flex flex-col items-center justify-start overflow-hidden pt-[var(--nav-height)]">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <SafeImage
                    src={heroImage}
                    alt={name}
                    fill
                    priority
                    className="object-cover scale-100 brightness-[0.45] transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/10 to-[#0f0f0f]"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 container mx-auto px-4 text-center mt-12 md:mt-20">
                {/* Region Breadcrumbs - Editorial Style */}
                <nav className="flex justify-center items-center gap-3 text-[11px] font-black uppercase tracking-[0.5em] text-[#FFD700] mb-6 font-inter opacity-80">
                    <span className="hover:text-white transition-colors cursor-default">{facts.region || "World"}</span>
                    <span className="text-white/20 select-none">/</span>
                    <span className="hover:text-white transition-colors cursor-default">Destinations</span>
                </nav>

                {/* Country Title - Large, Cinematic */}
                <h1 className="text-[clamp(4rem,15vw,12rem)] font-black uppercase tracking-tighter leading-[0.75] mb-10 text-white font-serif drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] selection:bg-[#FFD700] selection:text-black">
                    {name}
                </h1>

                {/* Editorial Description - Limited to 4 lines */}
                <p
                    className="max-w-3xl mx-auto font-medium text-white/90 mb-12 px-6 line-clamp-4 md:line-clamp-none italic"
                    style={{
                        fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                        lineHeight: '1.8',
                        textShadow: '0 2px 15px rgba(0,0,0,0.6)'
                    }}
                >
                    {intro}
                </p>

                {/* Scroll Indicator */}
                <button
                    onClick={scrollToContent}
                    className="group flex flex-col items-center gap-4 mx-auto text-white/40 hover:text-white transition-all duration-300"
                >
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Explore More</span>
                    <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent group-hover:from-[#FFD700] transition-colors relative">
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                            <ChevronDown size={14} className="group-hover:translate-y-1 transition-transform text-white/40 group-hover:text-[#FFD700]" />
                        </div>
                    </div>
                </button>
            </div>
        </section>
    );
}
