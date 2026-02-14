
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SafeImage from "./SafeImage";

export default function Hero({
    backgroundImage = "https://images.unsplash.com/photo-1549103930-67e3ee255208?q=80&w=2070&auto=format&fit=crop",
    headline = "Your Journey Starts Here",
    description = "In-depth travel guides, destination stories, cinematic videos, and smart planning tools — everything you need to explore the world with confidence.",
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
        <section className="relative h-screen min-h-[850px] flex items-center overflow-hidden bg-black pt-[var(--nav-height)] md:pt-[calc(var(--nav-height)+100px)]">
            {/* SVG Filter for Strict Color Mapping */}
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <filter id="ybw-theme">
                    {/* Convert to grayscale first */}
                    <feColorMatrix type="saturate" values="0" />

                    {/* Map colors: Black (shadows), Yellow (mids), White (highlights) */}
                    <feComponentTransfer colorInterpolationFilters="sRGB">
                        <feFuncR type="table" tableValues="0 1 1" />
                        <feFuncG type="table" tableValues="0 0.84 1" />
                        <feFuncB type="table" tableValues="0 0 1" />
                    </feComponentTransfer>
                </filter>
            </svg>

            {/* Background Image with Theme Filter */}
            <div
                className="absolute inset-0 z-0 transition-transform duration-300 ease-out"
                style={{
                    transform: `translateY(${scrollY * 0.25}px) scale(1.1)`,
                }}
            >
                <SafeImage
                    src={backgroundImage}
                    alt="The Explorer Peak"
                    fill
                    priority
                    className="w-full h-full object-cover brightness-75 contrast-125"
                    style={{ filter: 'url(#ybw-theme)' }}
                />

                {/* Depth Gradients */}
                <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/20 to-black"></div>
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>
            </div>

            {/* Elevated Content Container - Now z-30 to avoid any overlap */}
            <div className="container mx-auto px-6 lg:px-12 relative z-30 h-full flex items-center">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start lg:items-center w-full">

                    {/* Left Content: Bold Heading, Subtext, Buttons */}
                    <div className="lg:col-span-8 flex flex-col items-start animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out">
                        <div className="inline-flex items-center gap-3 mb-6">
                            <span className="w-12 h-[1px] bg-[#FFD700]"></span>
                            <span className="text-[#FFD700] text-sm font-black uppercase tracking-[0.4em]">The Explorer Magazine</span>
                        </div>

                        <h1
                            className="font-serif text-white font-bold leading-[1.03] mb-[1.5rem] drop-shadow-2xl"
                            style={{
                                letterSpacing: '-0.025em',
                                textShadow: '0 6px 40px rgba(0,0,0,0.55)',
                            }}
                        >
                            <span className="md:hidden text-[2.8rem] leading-[1.1] block">{headline}</span>
                            <span className="hidden md:inline lg:hidden text-[clamp(4rem,7vw,5.5rem)] block">{headline}</span>
                            <span className="hidden lg:inline text-[clamp(5rem,9vw,6.5rem)] block">{headline}</span>
                        </h1>

                        <p
                            className="font-sans mb-[2.5rem]"
                            style={{
                                fontSize: '1.25rem',
                                lineHeight: '1.75',
                                maxWidth: '650px',
                                opacity: '0.85',
                                color: 'rgba(255,255,255,1)',
                            }}
                        >
                            {description}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto mt-4">
                            <Link
                                href={primaryCTA.href}
                                className="group relative px-10 py-5 bg-[#FFD700] text-black text-[0.95rem] font-black uppercase tracking-[0.2em] transition-all hover:bg-white hover:border-white hover:scale-110 active:scale-95 border-[3px] border-[#FFD700] flex items-center justify-center rounded-xl shadow-xl z-40"
                            >
                                {primaryCTA.text}
                            </Link>

                            <Link
                                href={secondaryCTA.href}
                                className="group px-10 py-5 bg-transparent border-[3px] border-white text-white text-[0.95rem] font-black uppercase tracking-[0.2em] transition-all hover:bg-white hover:text-black hover:scale-110 active:scale-95 flex items-center justify-center backdrop-blur-md rounded-xl z-40"
                            >
                                {secondaryCTA.text}
                            </Link>
                        </div>
                    </div>

                    {/* Right Content: Featured Video Card */}
                    <div className="lg:col-span-4 hidden lg:block animate-in fade-in slide-in-from-right-12 duration-1000 delay-300 ease-out z-40">
                        <div className="group relative bg-[#FFD700] border-[3px] border-white p-8 rounded-[2.5rem] hover:bg-black transition-all cursor-pointer shadow-2xl overflow-hidden">
                            {/* Ambient Glow */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/20 blur-[80px] rounded-full"></div>

                            <div className="relative aspect-video rounded-3xl overflow-hidden mb-8 border-2 border-black/10">
                                <SafeImage
                                    src={latestVideo.thumbnail}
                                    alt={latestVideo.title}
                                    fill
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all flex items-center justify-center">
                                    <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center pl-1 shadow-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                                        <svg width="36" height="36" viewBox="0 0 24 24" fill="#FFD700">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col relative z-10 text-left">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="w-10 h-[1px] bg-black group-hover:bg-[#FFD700]"></span>
                                    <span className="text-black group-hover:text-[#FFD700] text-xs font-black uppercase tracking-[0.3em]">Latest Feature</span>
                                </div>
                                <h3 className="text-black group-hover:text-white font-serif text-2xl font-bold leading-tight mb-8">
                                    {latestVideo.title}
                                </h3>
                                <div className="flex items-center text-black/60 text-[0.7rem] font-black uppercase tracking-[0.25em] group-hover:text-[#FFD700] transition-colors">
                                    <span>Watch now</span>
                                    <svg className="ml-4 w-5 h-5 transform group-hover:translate-x-3 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom transition gradient */}
            <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>

            {/* SVG Filter Definition - Moved to bottom and hidden to prevent interference */}
            <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }} aria-hidden="true">
                <filter id="ybw-theme">
                    <feColorMatrix type="saturate" values="0" />
                    <feComponentTransfer colorInterpolationFilters="sRGB">
                        <feFuncR type="table" tableValues="0 1 1" />
                        <feFuncG type="table" tableValues="0 0.84 1" />
                        <feFuncB type="table" tableValues="0 0 1" />
                    </feComponentTransfer>
                </filter>
            </svg>
        </section>
    );
}
