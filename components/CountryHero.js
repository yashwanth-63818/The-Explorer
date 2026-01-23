"use client";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export default function CountryHero({
    name,
    facts,
    intro,
    parentName,
    parentSlug,
    scrollId = "places-to-visit",
    isCity = false
}) {
    const scrollToContent = () => {
        const element = document.getElementById(scrollId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section
            className={`relative ${isCity ? 'min-h-[65vh]' : 'min-h-[75vh]'} flex flex-col items-center justify-center overflow-hidden pt-[var(--nav-height)]`}
            style={{
                background: 'linear-gradient(180deg, #0b0b0b 0%, #111111 50%, #0b0b0b 100%)'
            }}
        >
            {/* Content Container */}
            <div className="relative z-10 container mx-auto px-4 text-center pt-20 pb-16">
                {/* Region Breadcrumbs - Editorial Style */}
                <nav className="flex justify-center items-center gap-3 text-[11px] font-black uppercase tracking-[0.5em] text-[#FFD700] mb-8 font-inter opacity-80">
                    {parentName ? (
                        <Link href={parentSlug} className="hover:text-white transition-colors">{parentName}</Link>
                    ) : (
                        <span className="hover:text-white transition-colors cursor-default">{facts?.region || "World"}</span>
                    )}
                    <span className="text-white/20 select-none">/</span>
                    <span className="hover:text-white transition-colors cursor-default">Destinations</span>
                </nav>

                {/* Country/City Title - Large, Cinematic Serif */}
                <h1 className="text-[clamp(3.5rem,12vw,10rem)] font-bold tracking-tight leading-[1] mb-10 text-white font-serif selection:bg-[#FFD700] selection:text-black">
                    {name}
                </h1>

                {/* Editorial Description - Relaxed line height, centered */}
                <p
                    className="max-w-3xl mx-auto font-normal text-white/85 mb-14 px-6 italic"
                    style={{
                        fontSize: 'clamp(1rem, 1.2vw, 1.15rem)',
                        lineHeight: '1.8',
                    }}
                >
                    {intro}
                </p>

                {/* Scroll Indicator */}
                <button
                    onClick={scrollToContent}
                    className="group flex flex-col items-center gap-4 mx-auto text-white/30 hover:text-white transition-all duration-300"
                >
                    <span className="text-[9px] font-black uppercase tracking-[0.4em]">Read Full Guide</span>
                    <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent group-hover:from-[#FFD700] transition-colors relative">
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                            <ChevronDown size={12} className="group-hover:translate-y-1 transition-transform text-white/20 group-hover:text-[#FFD700]" />
                        </div>
                    </div>
                </button>
            </div>
        </section>
    );
}
