"use client";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export default function CountryHero({
    name,
    facts,
    intro,
    parentName,
    parentSlug,
    scrollId = "places-to-visit"
}) {
    const scrollToContent = () => {
        const element = document.getElementById(scrollId);
        if (element) {
            // Updated offset to account for the large double-row navbar (approx 140px)
            const offset = 140;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <section className="min-h-screen flex flex-col bg-[#0b0b0b] pt-48 pb-20 px-6 relative overflow-hidden">
            {/* Main Content Stack (Vertically Centered) */}
            <div className="flex-1 flex flex-col items-center justify-center max-w-6xl mx-auto text-center w-full relative z-10">

                {/* 1. BUCKETLISTLY-STYLE BREADCRUMBS */}
                {/* 
                   Style: Minimal, Editorial, Subtle.
                   Format: Continent › Sub-region › Country (or City)
                */}
                <nav className="flex items-center justify-center gap-1 sm:gap-2 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-16 animate-in fade-in duration-1000">
                    {/* Level 1: Continent */}
                    <span className="hover:text-white transition-colors cursor-default">
                        {facts?.region || "World"}
                    </span>

                    <span className="px-1 text-white/5 font-light">›</span>

                    {/* Level 2: Sub-region (for Country Page) OR Country (for City Page) */}
                    {parentName ? (
                        <>
                            <Link href={parentSlug} className="hover:text-white transition-colors">
                                {parentName}
                            </Link>
                            <span className="px-1 text-white/5 font-light">›</span>
                        </>
                    ) : (
                        <>
                            <span className="hover:text-white transition-colors cursor-default">
                                {facts?.subregion || "Global Travel"}
                            </span>
                            <span className="px-1 text-white/5 font-light">›</span>
                        </>
                    )}

                    {/* Level 3: Current Page (Active/Muted Gold) */}
                    <span className="text-[#FFD700]/40 tracking-[0.5em]">
                        {name}
                    </span>
                </nav>

                {/* 2. COUNTRY TITLE (H1) */}
                <div className="mb-10 sm:mb-14 animate-in fade-in slide-in-from-bottom-4 duration-1500">
                    <h1 className="text-[clamp(3rem,14vw,10.5rem)] font-bold tracking-tighter leading-[0.85] text-white font-serif uppercase">
                        {name}
                    </h1>
                </div>

                {/* 3. COUNTRY DESCRIPTION */}
                <div className="max-w-2xl mx-auto mb-24 sm:mb-28 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
                    <p className="text-lg md:text-xl text-white/50 leading-[1.8] font-light italic px-4">
                        {intro}
                    </p>
                </div>

                {/* 4. DISCOVER CTA */}
                <div className="animate-in fade-in zoom-in duration-1000 delay-700">
                    <button
                        onClick={scrollToContent}
                        className="group flex flex-col items-center gap-5 transition-all duration-300 hover:scale-105"
                    >
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 group-hover:text-[#FFD700] transition-colors">
                            Scout {name}
                        </span>
                        <div className="relative h-20 w-px bg-white/5 group-hover:bg-[#FFD700]/30 transition-colors overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#FFD700] via-transparent to-transparent -translate-y-full group-hover:animate-[scroll-down_2.5s_infinite]"></div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Custom Animation for Scroll Indicator */}
            <style jsx>{`
                @keyframes scroll-down {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
            `}</style>
        </section>
    );
}
