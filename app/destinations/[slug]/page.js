import { getDynamicDestinationData } from "@/lib/destinationService";
import { destinations as editorialData } from "@/lib/destinationData";
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
    Play,
    Clock,
    User
} from "lucide-react";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import CountryHero from "@/components/CountryHero";
import { EXTERNAL_PARTNERS, getPartnerRedirectUrl } from "@/lib/navigationService";

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

        // Pick a random image from the first 3 Unsplash results for variety, or fallback
        const dynamicHero = images.length > 0
            ? images[Math.floor(Math.random() * Math.min(images.length, 3))]?.url
            : null;

        const editorialHero = editorialData[slug]?.heroImage;

        const heroImage = dynamicHero || editorialHero || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800";

        const getPostSlug = (cityName) => {
            const cityPart = cityName.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]/g, '');
            const countryPart = name.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]/g, '');
            return `${cityPart}-${countryPart}-travel-guide`;
        };

        const utilityButtons = [
            { label: `Find Cheap Flights To ${name}`, icon: Plane, sub: EXTERNAL_PARTNERS.SKYSCANNER },
            { label: `Find Hotels In ${name}`, icon: Bed, sub: EXTERNAL_PARTNERS.BOOKING },
            { label: `Find Buses In ${name}`, icon: Bus, sub: EXTERNAL_PARTNERS.OMIO },
            { label: `Find Trains In ${name}`, icon: Train, sub: EXTERNAL_PARTNERS.OMIO },
            { label: `Rent A Car In ${name}`, icon: Car, sub: EXTERNAL_PARTNERS.DISCOVERCARS },
            { label: `Find Things To Do In ${name}`, icon: Compass, sub: EXTERNAL_PARTNERS.VIATOR },
            { label: `Find Ticket Deals In ${name}`, icon: Ticket, sub: EXTERNAL_PARTNERS.GETYOURGUIDE },
            { label: `Find Travel Insurance For ${name}`, icon: Shield, sub: EXTERNAL_PARTNERS.HEYMONDO },
        ];

        return (
            <main className="bg-[#0f0f0f] min-h-screen text-gray-200 selection:bg-[#FFD700] selection:text-black font-inter scroll-smooth">
                {/* A. HERO SECTION */}
                <CountryHero
                    name={name}
                    facts={facts}
                    heroImage={heroImage}
                    intro={content.intro}
                    bestPlaces={content.bestPlaces}
                />

                {/* B. UTILITY CARDS GRID */}
                <section id="utility-cards" className="py-20 bg-[#0c0c0c] border-b border-white/5">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                            {utilityButtons.map((btn, i) => (
                                <a
                                    key={i}
                                    href={getPartnerRedirectUrl(btn.sub, { countryName: name })}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col sm:flex-row items-center gap-4 p-6 bg-[#18181b] rounded-xl border border-white/5 hover:border-white/30 transition-all group hover:bg-[#1c1c21] hover:shadow-[0_12px_30px_rgba(0,0,0,0.25)] hover:-translate-y-1"
                                >
                                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#FFD700] group-hover:bg-[#FFD700]/5 transition-all">
                                        <btn.icon size={20} className="text-white/40 group-hover:text-[#FFD700]" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-white/90 uppercase tracking-[0.2em] group-hover:text-white">{btn.label}</span>
                                        <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">via {btn.sub}</span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* C. FEATURED GUIDES GRID */}
                <section className="py-32 container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {content.blogPosts.map((post, i) => (
                            <Link key={i} href={`/posts/${post.slug || getPostSlug(name)}`} className="group flex flex-col no-underline">
                                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6 shadow-xl">
                                    <SafeImage
                                        src={images[Math.min(i + 2, images.length - 1)]?.url || images[0]?.url}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-all duration-1000 group-hover:scale-105 brightness-[0.7] group-hover:brightness-[0.9]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                    <div className="absolute inset-x-0 bottom-0 p-10">
                                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#FFD700] mb-3 block">
                                            {name}
                                        </span>
                                        <h3 className="text-2xl font-black text-white leading-[1.2] font-inter group-hover:text-[#FFD700] transition-colors">
                                            {post.title}
                                        </h3>
                                        <div className="flex items-center gap-4 mt-6 text-[9px] text-white/40 font-black uppercase tracking-widest">
                                            <span>By {post.author}</span>
                                            <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                                            <span>{post.date}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* D. VIDEO SECTION */}
                <section className="bg-black py-32 overflow-hidden border-y border-white/5">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <span className="text-[12px] font-black uppercase tracking-[0.6em] text-white/40 mb-4 block">VIDEOS</span>
                        </div>
                        <div className="max-w-6xl mx-auto aspect-video rounded-3xl overflow-hidden relative group shadow-2xl">
                            <SafeImage
                                src={images[Math.min(images.length - 1, 5)]?.url || heroImage}
                                fill
                                alt="Video Preview"
                                className="object-cover brightness-[0.5] transition-all duration-1000 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                                <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform mb-8 group-hover:bg-[#FFD700] group-hover:border-[#FFD700]">
                                    <Play size={32} fill="white" className="ml-1 group-hover:fill-black group-hover:text-black transition-colors" />
                                </div>
                                <span className="text-[12px] font-black uppercase tracking-[0.5em] text-white/60 mb-4">A TRAVEL VIDEO</span>
                                <h3 className="text-5xl md:text-8xl font-black uppercase tracking-widest text-white font-serif italic">
                                    IMAGINE {name}
                                </h3>
                            </div>
                            <div className="absolute bottom-6 right-8 text-[10px] font-bold text-white/50 tracking-widest">03:42</div>
                        </div>
                    </div>
                </section>

                {/* E. LONG-FORM TRAVEL CONTENT */}
                <section id="guide-content" className="py-32 container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-20">
                        {/* Sticky TOC */}
                        <aside className="lg:w-1/4 hidden lg:block">
                            <div className="sticky top-32 space-y-8">
                                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 border-b border-white/10 pb-4">
                                    TABLE OF CONTENTS
                                </h4>
                                <nav className="flex flex-col gap-6">
                                    {Object.keys(content.sections).map((key) => (
                                        <a
                                            key={key}
                                            href={`#${key}`}
                                            className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
                                        >
                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        </aside>

                        {/* Content Sections */}
                        <div className="lg:w-3/4 max-w-3xl">
                            {Object.entries(content.sections).map(([key, value], idx) => (
                                <div key={key} id={key} className="mb-32 last:mb-0 scroll-mt-32">
                                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-16 font-inter leading-[1.1]">
                                        {key === "bestTime" ? `When To Visit ${name}?` :
                                            key === "transport" ? `How To Get Around ${name}?` :
                                                key === "budget" ? "Daily Budget" :
                                                    key === "stay" ? "Where To Stay" : key.replace(/([A-Z])/g, ' $1').trim()}
                                    </h2>

                                    {/* Section Image */}
                                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-12 shadow-2xl">
                                        <SafeImage
                                            src={images[Math.min(idx + 3, images.length - 1)]?.url || images[1]?.url}
                                            alt={key}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="text-lg md:text-xl text-white/80 font-inter leading-[1.8] space-y-8">
                                        {value.split('\n\n').map((p, i) => (
                                            <p key={i}>{p}</p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        );

    } catch (error) {
        console.error("Destination Page Error:", error);
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-8 pt-[var(--nav-height)]">
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
