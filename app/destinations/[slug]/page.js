import { getDynamicDestinationData } from "@/lib/destinationService";
import {
    ChevronRight,
    ArrowRight,
    Plane,
    Bed,
    Train
} from "lucide-react";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import ScrollButton from "@/components/ScrollButton";

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
        if (!data) throw new Error("No data found");

        const { name, facts, images, content } = data;
        const heroImage = images[0]?.url || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800";

        const getPostSlug = (cityName) => {
            const cityPart = cityName.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]/g, '');
            const countryPart = name.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]/g, '');
            return `${cityPart}-${countryPart}-travel-guide`;
        };

        return (
            <main className="bg-[#0f0f0f] min-h-screen text-gray-200 selection:bg-[#FFD700] selection:text-black font-inter scroll-smooth">

                {/* 1. HERO SECTION (100vh) */}
                <section className="relative h-screen flex items-center justify-center overflow-hidden pt-32">
                    <div className="absolute inset-0 z-0">
                        <SafeImage
                            src={heroImage}
                            alt={name}
                            fill
                            priority
                            className="object-cover scale-105 brightness-[0.5]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-black/30"></div>
                    </div>

                    {/* Map SVG Overlay */}
                    <div className="absolute inset-0 z-1 pointer-events-none flex items-center justify-center opacity-[0.05] transform scale-[1.3] translate-y-10">
                        <SafeImage
                            src={`https://raw.githubusercontent.com/djaiss/mapsicon/master/all/${facts.code.toLowerCase()}/vector.svg`}
                            alt={`${name} map`}
                            width={1000}
                            height={1000}
                            className="invert select-none transition-opacity duration-1000"
                            fallbackSrc=""
                        />
                    </div>

                    <div className="relative z-10 container mx-auto px-4 text-center">
                        <nav className="flex justify-center items-center gap-2 text-[10px] font-black uppercase tracking-[0.5em] text-[#FFD700] mb-8 font-inter">
                            <Link href="/destinations" className="hover:text-white transition-colors">Destinations</Link>
                            <ChevronRight size={10} className="opacity-50" />
                            <span>{facts.region}</span>
                            <ChevronRight size={10} className="opacity-50" />
                            <span className="text-white">{name}</span>
                        </nav>

                        <h1 className="text-[4.5rem] md:text-[9rem] xl:text-[11rem] font-black uppercase tracking-tighter leading-[0.85] mb-10 text-white font-playfair drop-shadow-2xl">
                            {name}
                        </h1>

                        <div className="flex flex-col items-center gap-8">
                            {content && (
                                <>
                                    <p className="max-w-2xl mx-auto text-xl md:text-2xl font-serif italic text-gray-200 mb-4 opacity-90 leading-relaxed font-playfair">
                                        "{content.tagline}"
                                    </p>

                                    <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto mb-8">
                                        {(content.bestPlaces || []).map((place, i) => (
                                            <Link
                                                key={i}
                                                href={`/posts/${getPostSlug(place.city)}`}
                                                className="px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#FFD700] hover:text-black hover:border-[#FFD700] transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
                                            >
                                                {place.city}
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            )}

                            <div className="flex flex-col items-center gap-4 py-6 px-10 bg-black/40 backdrop-blur-md rounded-2xl border border-white/5">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FFD700]">
                                    Editorial Status: {content ? "Verified" : "Syncing"}
                                </p>
                                <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400">
                                    “This guide is community-powered and continuously updated.”
                                </p>
                                {content && (
                                    <ScrollButton
                                        className="mt-4 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white hover:text-[#FFD700] transition-colors group cursor-pointer"
                                    >
                                        Read Overview <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </ScrollButton>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="relative z-20">
                    {/* 2. OVERVIEW & WHY VISIT */}
                    {content && (
                        <section id="overview" className="container mx-auto px-4 py-32 border-b border-white/5">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                                <div>
                                    <span className="text-[#FFD700] text-[10px] font-black uppercase tracking-[0.5em] block mb-8">The Vibe</span>
                                    <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none mb-12 font-playfair text-white">
                                        Why Visit {name}?
                                    </h2>
                                    <div className="space-y-8 text-xl text-gray-400 font-serif leading-relaxed opacity-90 font-playfair">
                                        {(content.whyVisit || "").split('\n\n').filter(Boolean).map((para, i) => (
                                            <p key={i}>{para}</p>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-8">
                                    <div className="p-10 bg-[#151515] rounded-[3rem] border border-white/5">
                                        <h4 className="text-[#FFD700] text-[10px] font-black uppercase tracking-[0.4em] mb-8">Fast Facts</h4>
                                        <div className="grid grid-cols-2 gap-8">
                                            {[
                                                { label: "Capital", value: facts?.capital || "N/A" },
                                                { label: "Currency", value: facts?.currency || "N/A" },
                                                { label: "Population", value: facts?.population || "N/A" },
                                                { label: "Languages", value: facts?.languages || "N/A" },
                                            ].map((f, i) => (
                                                <div key={i}>
                                                    <p className="text-[9px] uppercase font-black tracking-widest text-gray-600 mb-1">{f.label}</p>
                                                    <p className="text-white font-bold">{f.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {content.travelTips && (
                                        <div className="p-10 bg-[#FFD700] rounded-[3rem] text-black">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-8 opacity-60">Pro Tips</h4>
                                            <div className="space-y-6">
                                                <div>
                                                    <p className="text-[9px] uppercase font-black tracking-widest mb-1">Greeting</p>
                                                    <p className="font-bold text-lg">"{content.travelTips.greeting || "Hello"}"</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] uppercase font-black tracking-widest mb-1">Etiquette</p>
                                                    <p className="font-medium leading-tight">{content.travelTips.etiquette || "Follow local customs."}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] uppercase font-black tracking-widest mb-1">Safety</p>
                                                    <p className="font-medium leading-tight">{content.travelTips.safety || "Stay alert."}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* 3. FEATURE ARTICLE CARD */}
                    <section className="container mx-auto px-4 py-32">
                        {content && content.featuredArticle ? (
                            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-0 bg-[#151515] rounded-[3.5rem] overflow-hidden border border-white/5 group shadow-2xl">
                                <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto relative overflow-hidden">
                                    <SafeImage
                                        src={images[1]?.url || heroImage}
                                        alt={content.featuredArticle.title}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                    <div className="absolute top-10 left-10">
                                        <span className="px-6 py-2.5 bg-[#FFD700] text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl">
                                            {content.featuredArticle.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="lg:col-span-5 p-12 lg:p-24 flex flex-col justify-center">
                                    <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-[1.05] mb-8 font-playfair text-white">
                                        {content.featuredArticle.title}
                                    </h2>
                                    <p className="text-xl text-gray-400 font-serif leading-relaxed mb-12 font-playfair opacity-80">
                                        {content.featuredArticle.subtitle}
                                    </p>
                                    <Link href="#" className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.5em] text-[#FFD700] hover:text-white transition-all transform hover:translate-x-2">
                                        Read Exploration <ArrowRight size={18} />
                                    </Link>
                                </div>
                            </div>
                        ) : null}
                    </section>

                    {/* 4. THINGS TO DO */}
                    {content && content.thingsToDo && content.thingsToDo.length > 0 && (
                        <section className="bg-white text-black py-40 rounded-[4rem]">
                            <div className="container mx-auto px-4">
                                <div className="text-center mb-24">
                                    <span className="text-[10px] font-black uppercase tracking-[0.5em] block mb-5">Curated Experiences</span>
                                    <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter font-playfair leading-[1.1]">Must-Do Activities</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                                    {content.thingsToDo.map((thing, i) => (
                                        <div key={i} className="flex gap-8 items-start group">
                                            <span className="text-6xl font-black text-gray-100 group-hover:text-[#FFD700] transition-colors duration-500 leading-none">0{i + 1}</span>
                                            <div>
                                                <h4 className="text-2xl font-black uppercase tracking-tight mb-4 font-playfair">{thing}</h4>
                                                <p className="text-gray-500 font-serif italic text-lg leading-relaxed">Experience the unique charm of this exclusive {name} activity.</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* 5. UTILITY CARDS */}
                    <section className="container mx-auto px-4 py-32">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { title: `Flights to ${name}`, icon: Plane, sub: "Check rates via Skyscanner" },
                                { title: `Hotels in ${name}`, icon: Bed, sub: "Find stays via Booking.com" },
                                { title: `Transports in ${name}`, icon: Train, sub: "Book routes via Omio" },
                            ].map((util, i) => (
                                <div key={i} className="p-14 bg-[#151515] rounded-[3rem] border border-white/5 hover:border-[#FFD700]/30 transition-all group flex flex-col items-center text-center cursor-pointer shadow-xl relative overflow-hidden">
                                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#FFD700]/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-10 group-hover:bg-[#FFD700] transition-all duration-500 transform group-hover:scale-110">
                                        <util.icon size={36} className="text-white group-hover:text-black transition-colors" strokeWidth={1.5} />
                                    </div>
                                    <h4 className="text-2xl font-black uppercase tracking-tighter mb-4 text-white font-playfair">{util.title}</h4>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 group-hover:text-gray-300 transition-colors">{util.sub}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 6. GRID OF BLOG POSTS */}
                    <section className="bg-[#0c0c0c] py-40 border-t border-white/5">
                        <div className="container mx-auto px-4">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
                                <div className="max-w-2xl">
                                    <span className="text-[#FFD700] text-[10px] font-black uppercase tracking-[0.5em] block mb-5">Editorial Journals</span>
                                    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white font-playfair leading-[1.1]">Latest from {name}</h2>
                                </div>
                                <div className="flex-1 h-px bg-white/5 hidden md:block mb-8"></div>
                            </div>

                            {content && content.blogPosts && content.blogPosts.length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                                    {content.blogPosts.map((post, i) => (
                                        <Link key={i} href={`/posts/${getPostSlug(name)}`} className="group flex flex-col">
                                            <div className="relative aspect-[16/10] rounded-[3rem] overflow-hidden mb-12 border border-white/5 shadow-2xl">
                                                <SafeImage
                                                    src={images[i + 2]?.url || images[0]?.url}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                <div className="absolute top-10 left-10">
                                                    <span className="px-6 py-2 bg-black/50 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-full border border-white/10">
                                                        {post.category}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="px-4">
                                                <h3 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter leading-tight mb-6 group-hover:text-[#FFD700] transition-colors font-playfair text-white">
                                                    {post.title}
                                                </h3>
                                                <p className="text-xl text-gray-400 font-serif italic mb-10 line-clamp-2 font-playfair opacity-80 leading-relaxed">
                                                    {post.snippet}
                                                </p>
                                                <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-700">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[8px] text-[#FFD700]">TS</span>
                                                        <span className="text-gray-400">{post.author}</span>
                                                    </div>
                                                    <span className="w-1.5 h-1.5 bg-white/10 rounded-full"></span>
                                                    <span className="text-gray-500">{post.date}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    </section>
                </div>
            </main>
        );

    } catch (error) {
        console.error("Destination Page Error:", error);
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-8">
                <div className="text-center max-w-2xl bg-[#151515] p-20 rounded-[4rem] border border-white/5 shadow-2xl">
                    <div className="w-24 h-24 bg-[#FFD700]/10 rounded-full flex items-center justify-center mx-auto mb-12">
                        <ArrowRight className="text-[#FFD700] rotate-180" size={40} />
                    </div>
                    <h1 className="text-5xl font-black text-white mb-8 font-playfair uppercase tracking-tighter leading-none">Expedition Interrupted</h1>
                    <p className="text-gray-400 mb-14 font-serif italic text-2xl leading-relaxed font-playfair opacity-80">
                        We encountered an issue while mapping your journey to {countryName}. Our scouts are already investigating.
                    </p>
                    <Link href="/" className="inline-flex items-center gap-6 px-14 py-7 bg-[#FFD700] text-black font-black uppercase tracking-[0.3em] text-xs rounded-full hover:bg-white transition-all transform hover:-translate-y-1 shadow-xl">
                        Return to Explorer <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        );
    }
}

