import Link from "next/link";
import { getDynamicPostData } from "@/lib/destinationService";
import {
    ChevronRight,
    Clock,
    Calendar,
    Share2,
    Bookmark,
    ArrowRight,
    Compass,
    Bed,
    Train,
    DollarSign,
    Shield,
    Wifi,
    Sun,
    ArrowUp,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    User,
    Map
} from "lucide-react";
import SafeImage from "@/components/SafeImage";
import { EXTERNAL_PARTNERS, getPartnerRedirectUrl } from "@/lib/navigationService";
import { Plane, Bed, Bus, Train, Car, Compass, Ticket, Shield } from "lucide-react";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    try {
        const post = await getDynamicPostData(slug);
        if (!post) return { title: "Travel Guide" };
        return {
            title: `${post.cityName} Travel Guide - ${post.countryName} | The Explorer`,
            description: post.content?.introduction?.slice(0, 160) || "Comprehensive travel guide.",
        };
    } catch {
        return { title: "Travel Guide | The Explorer" };
    }
}

export default async function BlogPostPage({ params }) {
    const { slug } = await params;

    try {
        const data = await getDynamicPostData(slug);
        if (!data) throw new Error("Could not parse destination from link.");

        const { cityName, countryName, images, content } = data;
        const mainImage = images[0]?.url || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34";

        return (
            <main className="bg-[#0f0f0f] min-h-screen text-gray-200 selection:bg-[#FFD700] selection:text-black font-inter scroll-smooth">
                {/* 1. HERO - FULL WIDTH (Bucketlistly Style) */}
                <header className="relative h-screen w-full overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0">
                        <SafeImage
                            src={mainImage}
                            alt={cityName}
                            fill
                            priority
                            className="object-cover brightness-[0.4] scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-black/20"></div>
                    </div>

                    <div
                        className="relative z-10 container mx-auto px-4 text-center"
                        style={{ paddingTop: 'var(--nav-height)' }}
                    >
                        <nav className="flex justify-center items-center gap-2 text-[10px] font-black uppercase tracking-[0.5em] text-[#FFD700] mb-10">
                            <Link href="/" className="hover:text-white transition-colors">Explorer</Link>
                            <ChevronRight size={12} className="opacity-40" />
                            <Link href={`/destinations/${countryName.toLowerCase().replace(/ /g, '-')}`} className="hover:text-white transition-colors">Destinations</Link>
                            <ChevronRight size={12} className="opacity-40" />
                            <Link href={`/destinations/${countryName.toLowerCase().replace(/ /g, '-')}`} className="hover:text-white transition-colors uppercase">{countryName}</Link>
                        </nav>

                        <h1 className="text-5xl md:text-8xl xl:text-[10rem] font-black uppercase tracking-tighter leading-none mb-12 font-playfair text-white drop-shadow-2xl">
                            {cityName}
                        </h1>

                        <div className="flex justify-center items-center gap-10 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
                            <span className="flex items-center gap-3">
                                <Clock size={16} className="text-[#FFD700]" strokeWidth={2.5} />
                                {content?.readingTime || "8 Min Read"}
                            </span>
                            <span className="w-2 h-2 bg-white/10 rounded-full"></span>
                            <span className="flex items-center gap-3">
                                <User size={16} className="text-[#FFD700]" strokeWidth={2.5} />
                                {content?.author?.name || "Editorial Guide"}
                            </span>
                        </div>
                    </div>

                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
                        <ArrowRight className="rotate-90 text-[#FFD700]" size={24} />
                    </div>
                </header>

                <div className="container mx-auto px-4 py-32">
                    {/* B. UTILITY CARDS GRID (Context Aware) */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mb-32">
                        {[
                            { label: `Flights to ${cityName}`, icon: Plane, sub: EXTERNAL_PARTNERS.SKYSCANNER },
                            { label: `Hotels in ${cityName}`, icon: Bed, sub: EXTERNAL_PARTNERS.BOOKING },
                            { label: `Buses to ${cityName}`, icon: Bus, sub: EXTERNAL_PARTNERS.OMIO },
                            { label: `Trains to ${cityName}`, icon: Train, sub: EXTERNAL_PARTNERS.OMIO },
                            { label: `Rent a car in ${cityName}`, icon: Car, sub: EXTERNAL_PARTNERS.DISCOVERCARS },
                            { label: `Activities in ${cityName}`, icon: Compass, sub: EXTERNAL_PARTNERS.VIATOR },
                            { label: `Ticket Deals`, icon: Ticket, sub: EXTERNAL_PARTNERS.GETYOURGUIDE },
                            { label: `Travel Insurance`, icon: Shield, sub: EXTERNAL_PARTNERS.HEYMONDO },
                        ].map((btn, i) => (
                            <a
                                key={i}
                                href={getPartnerRedirectUrl(btn.sub, { cityName, countryName })}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col sm:flex-row items-center gap-4 p-5 bg-[#151515] rounded-2xl border border-white/5 hover:border-[#FFD700]/30 transition-all group hover:bg-[#1a1a1a] hover:shadow-[0_12px_30px_rgba(0,0,0,0.25)] hover:-translate-y-1"
                            >
                                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#FFD700] group-hover:bg-[#FFD700]/5 transition-all">
                                    <btn.icon size={18} className="text-white/40 group-hover:text-[#FFD700]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-white/90 uppercase tracking-[0.2em] group-hover:text-white leading-tight">{btn.label}</span>
                                    <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest mt-1">via {btn.sub}</span>
                                </div>
                            </a>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 relative">

                        {/* LEFT: TABLE OF CONTENTS (Sticky) */}
                        <aside className="lg:col-span-3 hidden lg:block">
                            <div className="sticky top-40">
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#FFD700] block mb-10">Guide Chapters</span>
                                <nav className="flex flex-col gap-6 border-l border-white/5 pl-8">
                                    {content && content.sections.map((section, i) => (
                                        <a
                                            key={i}
                                            href={`#section-${i}`}
                                            className="text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all transform hover:translate-x-2"
                                        >
                                            {section.title}
                                        </a>
                                    ))}
                                    <a href="#practical-info" className="text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all transform hover:translate-x-2">The Essentials</a>
                                </nav>

                                <div className="mt-24 pt-12 border-t border-white/5 flex flex-col gap-8">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-700">Share Journey</p>
                                    <div className="flex gap-6">
                                        <Facebook size={20} className="text-gray-600 hover:text-white transition-colors cursor-pointer" />
                                        <Twitter size={20} className="text-gray-600 hover:text-white transition-colors cursor-pointer" />
                                        <Share2 size={20} className="text-gray-600 hover:text-white transition-colors cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* RIGHT: ARTICLE CONTENT */}
                        <article className="lg:col-span-9 max-w-3xl lg:px-8">
                            {content ? (
                                <>
                                    <div className="mb-32">
                                        <div className="flex items-center gap-8 mb-16">
                                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-[#FFD700] shadow-xl">
                                                <User size={28} strokeWidth={1.5} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2">Editorial Staff</p>
                                                <p className="text-xl font-black uppercase tracking-tight text-white font-playfair">{content.author?.name || "Explorer Guide"}</p>
                                            </div>
                                        </div>

                                        <div className="font-serif italic text-2xl lg:text-3xl text-gray-300 leading-relaxed mb-24 border-l-[8px] border-[#FFD700] pl-12 py-6 font-playfair opacity-90 shadow-2xl bg-white/[0.02] rounded-r-3xl">
                                            {content.introduction}
                                        </div>
                                    </div>

                                    {content.sections.map((section, i) => (
                                        <section key={i} id={`section-${i}`} className="mb-40 scroll-mt-40">
                                            <div className="flex items-center gap-10 mb-16">
                                                <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-tight font-playfair text-white">
                                                    {section.title}
                                                </h2>
                                                <div className="flex-1 h-px bg-white/5"></div>
                                            </div>

                                            <div className="my-20 aspect-[16/10] rounded-[3.5rem] overflow-hidden border border-white/5 relative group shadow-2xl">
                                                <SafeImage
                                                    src={images[i + 1]?.url || mainImage}
                                                    alt={section.title}
                                                    fill
                                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                                />
                                            </div>

                                            <div className="text-2xl text-gray-400 font-serif leading-relaxed mb-20 font-playfair opacity-80">
                                                {section.content.split('\n\n').map((para, idx) => (
                                                    <p key={idx} className="mb-10 last:mb-0">{para}</p>
                                                ))}
                                            </div>

                                            {section.items && (
                                                <div className="grid grid-cols-1 gap-10 mt-24">
                                                    {section.items.map((item, idx) => (
                                                        <div key={idx} className="p-12 bg-[#151515] rounded-[2.5rem] border border-white/5 hover:border-[#FFD700]/40 transition-all group overflow-hidden relative shadow-xl">
                                                            <div className="absolute -right-12 -top-12 w-44 h-44 bg-[#FFD700]/5 rounded-full blur-3xl group-hover:bg-[#FFD700]/10 transition-colors"></div>
                                                            <h4 className="text-[#FFD700] font-black uppercase tracking-[0.3em] text-[12px] mb-6">{item.name}</h4>
                                                            <p className="text-gray-300 text-lg font-serif leading-relaxed font-playfair opacity-90">
                                                                {item.description}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </section>
                                    ))}

                                    <section id="practical-info" className="pt-40 border-t border-white/5 scroll-mt-40">
                                        <div className="flex items-center gap-10 mb-20">
                                            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter font-playfair text-white leading-none">The Essentials</h2>
                                            <div className="flex-1 h-px bg-white/5"></div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                            <div className="p-14 bg-[#151515] rounded-[3rem] border border-white/5 group hover:border-[#FFD700]/40 transition-all text-center relative overflow-hidden shadow-2xl">
                                                <Calendar className="text-[#FFD700] mx-auto mb-10 group-hover:scale-110 transition-transform" size={40} strokeWidth={1.5} />
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-5 text-gray-600">Seasonality</h4>
                                                <p className="text-xl text-white font-playfair font-black uppercase tracking-tight leading-snug">{content.practicalTips.bestTime}</p>
                                            </div>
                                            <div className="p-14 bg-[#151515] rounded-[3rem] border border-white/5 group hover:border-[#FFD700]/40 transition-all text-center relative overflow-hidden shadow-2xl">
                                                <Wifi className="text-[#FFD700] mx-auto mb-10 group-hover:scale-110 transition-transform" size={40} strokeWidth={1.5} />
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-5 text-gray-600">Connectivity</h4>
                                                <p className="text-xl text-white font-playfair font-black uppercase tracking-tight leading-snug">{content.practicalTips.connectivity}</p>
                                            </div>
                                            <div className="p-14 bg-[#151515] rounded-[3rem] border border-white/5 group hover:border-[#FFD700]/40 transition-all text-center relative overflow-hidden shadow-2xl">
                                                <Map className="text-[#FFD700] mx-auto mb-10 group-hover:scale-110 transition-transform" size={40} strokeWidth={1.5} />
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-5 text-gray-600">Deep Cut</h4>
                                                <p className="text-xl text-white font-playfair font-black uppercase tracking-tight leading-snug">{content.practicalTips.hiddenGem}</p>
                                            </div>
                                        </div>
                                    </section>
                                </>
                            ) : (
                                <div className="py-24">
                                    <div className="p-24 bg-[#151515] border border-white/5 backdrop-blur-2xl rounded-[4.5rem] text-center shadow-2xl relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 to-transparent animate-pulse"></div>
                                        <h2 className="text-5xl font-black uppercase tracking-tighter mb-10 text-white font-playfair">Crafting Your Guide</h2>
                                        <p className="text-2xl font-serif italic text-gray-400 mb-16 font-playfair leading-relaxed opacity-80">
                                            We're currently synthesizing expert tips and unique stories for {cityName}. The definitive editorial will be available shortly.
                                        </p>
                                        <div className="flex flex-col items-center gap-6 relative z-10">
                                            <div className="w-16 h-16 rounded-full border-[4px] border-t-[#FFD700] border-white/5 animate-spin"></div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.6em] text-[#FFD700]">Synchronizing Discovery</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-48 pt-24 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-16">
                                <Link
                                    href={`/destinations/${countryName.toLowerCase().replace(/ /g, '-')}`}
                                    className="flex items-center gap-8 text-[12px] font-black uppercase tracking-[0.5em] text-white hover:text-[#FFD700] transition-all group"
                                >
                                    <ArrowRight className="rotate-180 group-hover:-translate-x-3 transition-transform" size={20} />
                                    Explore More in {countryName}
                                </Link>
                                <div className="flex items-center gap-10">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-700">Share This Editorial</p>
                                    <div className="flex gap-8">
                                        <Facebook size={22} className="text-gray-500 hover:text-white cursor-pointer transition-colors" />
                                        <Twitter size={22} className="text-gray-500 hover:text-white cursor-pointer transition-colors" />
                                        <Share2 size={22} className="text-gray-500 hover:text-white cursor-pointer transition-colors" />
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </main>
        );
    } catch (error) {
        console.error("City Blog Page Error:", error);
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-8 text-center">
                <div className="max-w-xl bg-[#151515] p-24 rounded-[4rem] border border-white/5 shadow-2xl">
                    <div className="w-24 h-24 bg-[#FFD700]/10 rounded-full flex items-center justify-center mx-auto mb-12">
                        <Compass className="text-[#FFD700]" size={40} />
                    </div>
                    <h1 className="text-5xl font-black text-white mb-8 font-playfair uppercase tracking-tighter leading-none">Scout Error</h1>
                    <p className="text-gray-400 font-serif italic text-2xl mb-14 leading-relaxed font-playfair opacity-80">
                        We're having trouble retrieving the guide for this specific route. The path may be temporarily blocked.
                    </p>
                    <Link href="/" className="inline-block px-14 py-7 bg-white text-black font-black uppercase tracking-[0.3em] text-xs rounded-full hover:bg-[#FFD700] transition-all shadow-xl">
                        Return to Explorer
                    </Link>
                </div>
            </div>
        );
    }
}

