import { getDynamicDestinationData } from "@/lib/destinationService";
import fs from "fs/promises";
import path from "path";
import {
    ChevronRight,
    ArrowRight,
    Plane,
    Bed,
    Train,
    Bus,
    Car,
    Compass,
    Ticket,
    Shield,
    Smartphone,
    Play,
    Clock,
    User,
    MapPin
} from "lucide-react";
import Link from "next/link";
import CountryHero from "@/components/CountryHero";

import SafeImage from "@/components/SafeImage";

export async function generateStaticParams() {
    const editorialPath = path.join(process.cwd(), "data", "stored", "countries-and-cities-editorial.json");
    try {
        const content = await fs.readFile(editorialPath, "utf-8");
        const allData = JSON.parse(content);
        const countries = allData.countries || {};
        return Object.keys(countries).map((slug) => ({
            slug: slug,
        }));
    } catch (err) {
        console.warn("[Build] Failed to read editorial.json for static generation.");
        return [];
    }
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const countryName = decodeURIComponent(slug)
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    return {
        title: `${countryName} Travel Guide | The Explorer`,
        description: `Explore the best of ${countryName} with our premium, editorial travel guide.`,
    };
}

export default async function CountryPage({ params }) {
    const { slug } = await params;

    const countryName = decodeURIComponent(slug)
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    try {
        const data = await getDynamicDestinationData(countryName);

        if (!data) {
            return (
                <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-8 pt-[calc(var(--nav-height)+60px)]">
                    <div className="text-center max-w-2xl bg-[#151515] p-16 rounded-3xl border border-white/5 shadow-2xl">
                        <h1 className="text-4xl font-black text-white mb-6 uppercase tracking-widest">Discovery in Progress</h1>
                        <p className="text-gray-400 mb-8 italic">We're gathering the most editorial content for {countryName}.</p>
                        <Link href="/" className="inline-flex items-center gap-4 px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-[#FFD700] transition-all">
                            BACK TO BASE <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            );
        }

        const { name, facts, content } = data;

        const utilityButtons = [
            { label: "Find Cheap Flights", icon: Plane, href: "/planning/find-cheap-flights" },
            { label: "Find Hotels", icon: Bed, href: "/planning/find-hotels" },
            { label: "Find Buses", icon: Bus, href: "/planning/find-buses" },
            { label: "Find Trains", icon: Train, href: "/planning/find-trains" },
            { label: "Rent a Car", icon: Car, href: "/planning/rent-a-car" },
            { label: "Find Things To Do", icon: Compass, href: "/planning/things-to-do" },
            { label: "Travel Insurance", icon: Shield, href: "/planning/travel-insurance" },
            { label: "SIM Cards", icon: Smartphone, href: "/planning/sim-cards" },
        ];

        const itineraries = [
            { title: `Ultimate 2-Week ${name} Itinerary`, desc: `A complete journey through the most iconic highlights of ${name}, from bustling cities to serene landscapes.` },
            { title: `${name} Off The Beaten Path`, desc: "Discover hidden gems and local secrets away from the tourist crowds in this unique adventure." },
            { title: `Best of ${name} in 10 Days`, desc: "The perfect balance of culture, history, and nature for travelers with limited time." },
        ];

        const recentPosts = [
            { title: `10 Things I Wish I Knew Before Visiting ${name}`, author: "The Explorer", date: "Jan 2026" },
            { title: `Budget Travel Guide: How to see ${name} on $50 a day`, author: "The Explorer", date: "Jan 2026" },
            { title: `Is it safe to travel to ${name} right now?`, author: "The Explorer", date: "Dec 2025" },
        ];

        return (
            <main className="bg-[#0b0b0b] min-h-screen text-gray-200 selection:bg-[#FFD700] selection:text-black font-inter scroll-smooth">
                {/* 1 & 2. BREADCRUMB + COUNTRY HERO SECTION */}
                <CountryHero
                    name={name}
                    facts={facts}
                    intro={content.intro}
                    scrollId="destinations"
                />

                {/* 3. STATES / REGIONS SECTION */}
                {content.states && content.states.length > 0 ? (
                    <section id="destinations" className="py-24 bg-[#0f0f0f] border-y border-white/5 scroll-mt-20">
                        <div id="states" className="hidden" /> {/* Anchor for old ID */}
                        <div id="places-to-visit" className="hidden" /> {/* Anchor for old ID */}

                        <div className="container mx-auto px-4 max-w-6xl">
                            <div className="flex flex-col items-center mb-16">
                                <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-[#FFD700] mb-4 text-center">Explore by State</h2>
                                <div className="w-12 h-0.5 bg-white/10"></div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-12 gap-y-6">
                                {content.states.map((state, i) => (
                                    <Link
                                        key={i}
                                        href={`/destinations/${slug}/${state.slug}`}
                                        className="flex items-center gap-4 text-gray-400 hover:text-white transition-all group py-1"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-[#FFD700]/30 group-hover:bg-[#FFD700]/10 transition-all shrink-0">
                                            <MapPin size={14} className="text-gray-600 group-hover:text-[#FFD700] transition-colors" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-black uppercase tracking-[0.25em] group-hover:text-[#FFD700] transition-colors">
                                                {state.name}
                                            </span>
                                            <span className="text-[9px] font-bold text-white/10 uppercase tracking-widest group-hover:text-white/30 transition-colors">
                                                {state.type || "State"}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                ) : (
                    /* Fallback: Standard Places to Visit for countries without state data */
                    <section id="destinations" className="py-24 bg-[#0f0f0f] border-y border-white/5 scroll-mt-20">
                        <div id="places-to-visit" className="hidden" />
                        <div className="container mx-auto px-4 max-w-6xl">
                            <div className="flex flex-col items-center mb-16">
                                <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-[#FFD700] mb-4 text-center">Places to Visit</h2>
                                <div className="w-12 h-0.5 bg-white/10"></div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-12 gap-y-6">
                                {content.bestPlaces.popular.map((place, i) => (
                                    <Link
                                        key={i}
                                        href={`/destinations/${slug}/${place.slug}`}
                                        className="flex items-center gap-4 text-gray-400 hover:text-white transition-all group py-1"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-[#FFD700]/30 group-hover:bg-[#FFD700]/10 transition-all shrink-0">
                                            <MapPin size={14} className="text-gray-600 group-hover:text-[#FFD700] transition-colors" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-black uppercase tracking-[0.25em] group-hover:text-[#FFD700] transition-colors">
                                                {place.city}
                                            </span>
                                            <span className="text-[9px] font-bold text-white/10 uppercase tracking-widest group-hover:text-white/30 transition-colors">
                                                {place.category || "Destination"}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* 4. ITINERARIES */}
                <section className="py-24 bg-[#0b0b0b]">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-[#FFD700] mb-12 text-center">Itineraries</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {itineraries.map((it, i) => (
                                <div key={i} className="group p-10 bg-[#121212] border border-white/5 rounded-3xl hover:border-white/20 transition-all cursor-default">
                                    <h3 className="text-xl font-black text-white mb-4 group-hover:text-[#FFD700] transition-colors uppercase tracking-tight leading-tight">{it.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{it.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 5. PLAN YOUR TRIP */}
                <section className="py-24 bg-[#0f0f0f] border-y border-white/5">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-[#FFD700] mb-12 text-center">Plan Your Trip</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {utilityButtons.map((btn, i) => (
                                <Link
                                    key={i}
                                    href={btn.href}
                                    className="flex flex-col items-center gap-4 p-8 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#FFD700] group-hover:bg-[#FFD700]/10 transition-all">
                                        <btn.icon size={20} className="text-white/30 group-hover:text-[#FFD700]" />
                                    </div>
                                    <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] group-hover:text-white transition-colors">{btn.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 6. RECENT POSTS */}
                <section className="py-24 bg-[#0b0b0b]">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-[#FFD700] mb-12 text-center">Recent Posts About {name}</h2>
                        <div className="space-y-6">
                            {recentPosts.map((post, i) => (
                                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-white/[0.02] border-b border-white/5 hover:bg-white/[0.03] transition-all group cursor-default">
                                    <h3 className="text-xl font-bold text-white group-hover:text-[#FFD700] transition-colors">{post.title}</h3>
                                    <div className="flex items-center gap-6 mt-4 md:mt-0 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                                        <span>BY {post.author}</span>
                                        <span>{post.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 7. NEWSLETTER CTA (Optional) */}
                <section className="py-32 bg-[#FFD700]">
                    <div className="container mx-auto px-4 max-w-4xl text-center">
                        <h2 className="text-4xl md:text-6xl font-black text-black uppercase tracking-tighter mb-8 italic">Never miss an adventure.</h2>
                        <p className="text-black/60 font-medium mb-10 uppercase tracking-widest text-sm">Join 50,000+ travelers getting our monthly editorial guide.</p>
                        <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
                            <input type="email" placeholder="YOUR EMAIL" className="flex-1 px-8 py-4 bg-black/5 border-2 border-black/10 rounded-full text-black placeholder:text-black/30 font-bold focus:outline-none focus:border-black transition-colors" />
                            <button className="px-10 py-4 bg-black text-white font-black uppercase tracking-widest rounded-full hover:bg-black/80 transition-all">Join</button>
                        </div>
                    </div>
                </section>
            </main>
        );

    } catch (error) {
        console.error("Destination Page Error:", error);
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-8 pt-[calc(var(--nav-height)+60px)]">
                <div className="text-center max-w-2xl bg-[#151515] p-16 rounded-3xl border border-white/5 shadow-2xl">
                    <h1 className="text-4xl font-black text-white mb-6 uppercase tracking-widest">Discovery in Progress</h1>
                    <p className="text-gray-400 mb-8 italic">We're gathering the most editorial content for you.</p>
                    <Link href="/" className="inline-flex items-center gap-4 px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-[#FFD700] transition-all">
                        BACK TO BASE <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        );
    }
}
