import { getCityData, getDynamicDestinationData } from "@/lib/destinationService";
import { ArrowLeft, ArrowRight, Clock, Calendar, Info, MapPin, Star, ShieldCheck, Plane, Bed, Compass, Ticket, Car, Bus, Train, Shield } from "lucide-react";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import CountryHero from "@/components/CountryHero";
import { EXTERNAL_PARTNERS, getPartnerRedirectUrl } from "@/lib/navigationService";

export async function generateMetadata({ params }) {
    const { city } = await params;
    const name = city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return {
        title: `${name} Travel Guide | The Explorer`,
        description: `Everything you need to know about visiting ${name}.`,
    };
}

export default async function CityDetailPage({ params }) {
    const { slug, city: citySlug } = await params;
    const cityData = await getCityData(citySlug);
    const countryData = await getDynamicDestinationData(slug);

    if (!cityData) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center pt-32">
                <div className="text-center">
                    <h1 className="text-4xl font-black text-white mb-4 uppercase">Discovery in Progress</h1>
                    <p className="text-gray-400 mb-8 italic">We're gathering the most editorial content for this location.</p>
                    <Link href={`/destinations/${slug}`} className="text-[#FFD700] uppercase tracking-[0.3em] font-black text-[10px] hover:underline flex items-center justify-center gap-2">
                        <ArrowLeft size={14} /> Back to {countryData?.name || slug}
                    </Link>
                </div>
            </div>
        );
    }

    const utilityButtons = [
        { label: `Flights To ${cityData.name}`, icon: Plane, sub: EXTERNAL_PARTNERS.SKYSCANNER },
        { label: `Hotels In ${cityData.name}`, icon: Bed, sub: EXTERNAL_PARTNERS.BOOKING },
        { label: `Things To Do`, icon: Compass, sub: EXTERNAL_PARTNERS.VIATOR },
        { label: `Rental Cars`, icon: Car, sub: EXTERNAL_PARTNERS.DISCOVERCARS },
    ];

    // Split best time to visit into a shorter summary if possible
    const bestTimeSummary = cityData.bestTimeToVisit ? cityData.bestTimeToVisit.split(',')[0].split('.')[0] : "Check local weather";

    return (
        <main className="bg-[#0f0f0f] min-h-screen text-gray-200 font-inter selection:bg-[#FFD700] selection:text-black scroll-smooth">
            {/* 1. CINEMATIC HERO SECTION */}
            <CountryHero
                name={cityData.name}
                facts={countryData?.facts || { region: "Destinations" }}
                intro={cityData.heroDescription}
                parentName={countryData?.name || slug}
                parentSlug={`/destinations/${slug}`}
                scrollId="why-visit"
                isCity={true}
            />


            {/* 2. OVERVIEW STRIP */}
            <section className="border-y border-white/5 bg-white/[0.02] py-10 relative z-20 -mt-px shadow-2xl">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl">
                    <div className="flex items-center gap-5 justify-center md:justify-start">
                        <Calendar className="text-[#FFD700]" size={24} />
                        <div>
                            <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-1">Best Time</span>
                            <span className="text-sm font-bold uppercase tracking-widest">{bestTimeSummary}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 justify-center">
                        <MapPin className="text-[#FFD700]" size={24} />
                        <div>
                            <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-1">Location</span>
                            <span className="text-sm font-bold uppercase tracking-widest">{countryData?.name}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 justify-center md:justify-end">
                        <ShieldCheck className="text-[#FFD700]" size={24} />
                        <div>
                            <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-1">Vibe</span>
                            <span className="text-sm font-bold uppercase tracking-widest">Editorial Discovery</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. UTILITY CARDS GRID (Plan a Trip) */}
            <section className="py-20 bg-[#0c0c0c] border-b border-white/5">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                        {utilityButtons.map((btn, i) => (
                            <a
                                key={i}
                                href={getPartnerRedirectUrl(btn.sub, { cityName: cityData.name, countryName: countryData?.name })}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col sm:flex-row items-center gap-4 p-6 bg-[#18181b] rounded-2xl border border-white/5 hover:border-[#FFD700]/30 transition-all group hover:bg-[#1c1c21] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#FFD700] group-hover:bg-[#FFD700]/10 transition-all">
                                    <btn.icon size={20} className="text-white/40 group-hover:text-[#FFD700]" />
                                </div>
                                <div className="flex flex-col text-center sm:text-left">
                                    <span className="text-[10px] font-black text-white/90 uppercase tracking-[0.2em] group-hover:text-white leading-tight">{btn.label}</span>
                                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1">via {btn.sub}</span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. MAIN EDITORIAL CONTENT */}
            <div className="container mx-auto px-4 py-32">
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-24">

                    {/* LEFT COLUMN: Why Visit & Experiences */}
                    <div className="lg:w-2/3 space-y-32">

                        {/* Why Visit Section */}
                        <div id="why-visit">
                            <div className="flex items-center gap-6 mb-16">
                                <div className="w-12 h-1 px-1 bg-[#FFD700]"></div>
                                <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-[#FFD700]">The Perspective</h2>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-12 leading-[1.1]">
                                Why Visit {cityData.name}?
                            </h2>
                            <div className="space-y-8">
                                {cityData.whyVisit.map((reason, i) => (
                                    <div key={i} className="group flex gap-8 p-10 bg-white/[0.02] rounded-[2.5rem] border border-white/5 hover:bg-white/[0.04] transition-all duration-500 hover:border-white/10">
                                        <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-[#FFD700]/5 flex items-center justify-center border border-[#FFD700]/10">
                                            <span className="text-2xl font-black text-[#FFD700] italic">0{i + 1}</span>
                                        </div>
                                        <p className="text-xl text-white/80 leading-relaxed font-inter font-medium">{reason}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Experiences Grid */}
                        <div id="experiences">
                            <div className="flex items-center gap-6 mb-16">
                                <div className="w-12 h-1 px-1 bg-[#FFD700]"></div>
                                <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-[#FFD700]">The Essentials</h2>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-16">Top Experiences</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {cityData.topExperiences.map((exp, i) => (
                                    <div key={i} className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5">
                                        <SafeImage
                                            src={`https://images.unsplash.com/photo-1540959733332-e94e270b2d42?q=80&w=1000&sig=${i}`} // Randomized city images
                                            alt={exp}
                                            fill
                                            className="object-cover transition-all duration-1000 group-hover:scale-110 brightness-[0.6] group-hover:brightness-[0.4]"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                                        <div className="absolute inset-x-0 bottom-0 p-10 transform group-hover:-translate-y-2 transition-transform duration-500">
                                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#FFD700] mb-4 block">Highlight 0{i + 1}</span>
                                            <p className="text-2xl font-black text-white leading-tight uppercase tracking-tight">{exp}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Sidebar (Pro Tips) */}
                    <aside className="lg:w-1/3">
                        <div className="sticky top-32 space-y-10 bg-[#121214] p-12 rounded-[3rem] border border-white/5 shadow-2xl">
                            <div className="flex flex-col gap-2">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#FFD700]">Insider Knowledge</h3>
                                <h3 className="text-3xl font-black uppercase tracking-tight text-white">Pro Tips</h3>
                            </div>
                            <div className="space-y-12">
                                {cityData.travelTips.map((tip, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <div className="flex-shrink-0 mt-1">
                                            <ShieldCheck size={20} className="text-[#FFD700] opacity-30 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-white/70 leading-[1.8] font-medium">{tip}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Card in Sidebar */}
                            <div className="pt-8 mt-8 border-t border-white/5">
                                <Link
                                    href={`/destinations/${slug}`}
                                    className="flex items-center justify-between w-full p-6 bg-white/5 rounded-2xl hover:bg-[#FFD700] hover:text-black transition-all group"
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest">Back to {countryData?.name}</span>
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* 5. NAVIGATION FOOTER */}
            <section className="bg-black py-24 border-t border-white/5">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.6em] mb-8">Adventure Continues</p>
                    <Link
                        href={`/destinations/${slug}`}
                        className="text-5xl md:text-8xl font-black uppercase tracking-[0.1em] text-white hover:text-[#FFD700] transition-colors leading-none"
                    >
                        Explore {countryData?.name}
                    </Link>
                </div>
            </section>
        </main>
    );
}
