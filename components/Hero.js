"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Hero({
    backgroundImage = "/images/hero-bg.png",
    headline = "Nights Under the Alpine Stars",
    description = "Explore the quiet beauty of snow-drenched cities and frozen wonders across the Nordic and Alpine frontiers.",
    primaryCTA = { text: "Start Exploring", href: "/destinations" },
    secondaryCTA = { text: "Watch Videos", href: "/videos" },
    latestVideo = {
        title: "Winter in Zermatt: A Cinematic Journey",
        thumbnail: "https://images.unsplash.com/photo-1548777123-e216912df7d8?q=80&w=2070&auto=format&fit=crop",
        href: "/videos/zermatt-winter"
    }
}) {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section className="relative h-screen min-h-[800px] flex items-center overflow-hidden bg-black">
            {/* Background Image with Parallax */}
            <div
                className="absolute inset-0 z-0 transition-transform duration-300 ease-out"
                style={{
                    transform: `translateY(${scrollY * 0.25}px) scale(1.1)`,
                }}
            >
                <img
                    src={backgroundImage}
                    alt="Snowy city at night"
                    className="w-full h-full object-cover"
                />

                {/* Refined Cinematic Overlay for perfect readability */}
                <div
                    className="absolute inset-0 z-10"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.35), rgba(0,0,0,0.7))'
                    }}
                ></div>
            </div>

            <div className="container mx-auto px-6 lg:px-12 relative z-20 pt-[120px]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start lg:items-center">

                    {/* Left Content: Bold Heading, Subtext, Buttons */}
                    <div className="lg:col-span-8 flex flex-col items-start animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out">
                        <h1
                            className="font-serif text-white font-bold leading-[1.03] mb-[1.25rem] drop-shadow-2xl"
                            style={{
                                letterSpacing: '-0.025em',
                                textShadow: '0 6px 40px rgba(0,0,0,0.55)',
                            }}
                        >
                            {/* Mobile scale: 2.4rem */}
                            <span className="md:hidden text-[2.4rem] leading-[1.15] block">{headline}</span>
                            {/* Tablet scale: clamp(3rem, 7vw, 4.5rem) */}
                            <span className="hidden md:inline lg:hidden text-[clamp(3.rem,7vw,4.5rem)] block">{headline}</span>
                            {/* Desktop scale: clamp(4.5rem, 8vw, 6.5rem) */}
                            <span className="hidden lg:inline text-[clamp(4.5rem,8vw,6.5rem)] block">{headline}</span>
                        </h1>

                        <p
                            className="font-sans mb-[2rem]"
                            style={{
                                fontSize: '1.25rem',
                                lineHeight: '1.75',
                                maxWidth: '600px',
                                opacity: '0.9',
                                color: 'rgba(255,255,255,0.9)',
                            }}
                        >
                            {description}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
                            <Link
                                href={primaryCTA.href}
                                className="group relative px-10 py-5 bg-[#FFD700] text-black text-[0.95rem] font-semibold uppercase tracking-[0.1em] transition-all hover:bg-[#FFC400] hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,215,0,0.2)] hover:shadow-[0_0_40px_rgba(255,215,0,0.4)] flex items-center justify-center rounded-sm"
                            >
                                {primaryCTA.text}
                            </Link>

                            <Link
                                href={secondaryCTA.href}
                                className="group px-10 py-5 bg-transparent border-2 border-white/30 text-white text-[0.95rem] font-semibold uppercase tracking-[0.1em] transition-all hover:bg-white hover:text-black hover:border-white flex items-center justify-center backdrop-blur-md rounded-sm"
                            >
                                {secondaryCTA.text}
                            </Link>
                        </div>
                    </div>

                    {/* Right Content: Featured Video Card */}
                    <div className="lg:col-span-4 hidden lg:block animate-in fade-in slide-in-from-right-12 duration-1000 delay-300 ease-out">
                        <div className="group relative bg-[#1a1a1a]/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl hover:bg-[#1a1a1a]/60 transition-all cursor-pointer shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden">
                            {/* Accent Glow */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FFD700]/10 blur-[80px] rounded-full"></div>

                            <div className="relative aspect-video rounded-2xl overflow-hidden mb-8 border border-white/5">
                                <img
                                    src={latestVideo.thumbnail}
                                    alt={latestVideo.title}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
                                    <div className="w-20 h-20 bg-[#FFD700] rounded-full flex items-center justify-center pl-1 shadow-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                                        <svg width="36" height="36" viewBox="0 0 24 24" fill="black">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col relative z-10 text-left">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="w-8 h-[1px] bg-[#FFD700]"></span>
                                    <span className="text-[#FFD700] text-xs font-black uppercase tracking-[0.3em]">Latest Video</span>
                                </div>
                                <h3 className="text-white font-serif text-2xl font-bold leading-tight group-hover:text-[#FFD700] transition-colors duration-300 mb-6">
                                    {latestVideo.title}
                                </h3>
                                <div className="flex items-center text-white/50 text-xs font-bold uppercase tracking-[0.2em] group-hover:text-white transition-colors">
                                    <span>Watch now</span>
                                    <svg className="ml-3 w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom transition gradient */}
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black via-black/50 to-transparent z-20"></div>
        </section>
    );
}
