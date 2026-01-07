import { getAboutPageData } from "@/lib/aboutService";
import SafeImage from "@/components/SafeImage";
import { Map, Route, Wallet, Camera, Info, Instagram, Youtube, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "About | The Explorer",
    description: "Learn about the mission, philosophy, and the creator behind The Explorer travel blog.",
};

const iconMap = {
    Map: Map,
    Route: Route,
    Wallet: Wallet,
    Camera: Camera,
    Info: Info,
};

export default async function AboutPage() {
    const data = await getAboutPageData();

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-white">
                <p>Something went wrong. Please try again later.</p>
            </div>
        );
    }

    const { hero, story, features, philosophy, author } = data;

    return (
        <div className="bg-[#0f0f0f] text-white selection:bg-yellow-400 selection:text-black">
            {/* 1. HERO SECTION */}
            <section className="relative h-[70vh] min-h-[500px] flex flex-col items-center justify-center overflow-hidden pt-[var(--nav-height)]">
                <div className="absolute inset-0 z-0">
                    <SafeImage
                        src={hero.image}
                        alt="About Hero"
                        fill
                        priority
                        className="object-cover brightness-[0.35] scale-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0f0f0f]"></div>
                </div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-black uppercase tracking-tight mb-6 leading-tight drop-shadow-2xl">
                        {hero.title}
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-300 font-medium leading-relaxed italic opacity-90 px-4">
                        "{hero.subtitle}"
                    </p>
                </div>
            </section>

            {/* 2. OUR STORY */}
            <section className="py-20 md:py-32 container mx-auto px-4">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold text-yellow-500 mb-8 flex items-center gap-4">
                        <span className="w-10 h-px bg-yellow-500/30"></span>
                        Our Story
                    </h2>
                    <div className="space-y-8 text-lg md:text-xl font-serif leading-relaxed text-zinc-300">
                        {story.map((para, i) => (
                            <p key={i} className="first-letter:text-4xl first-letter:font-black first-letter:mr-2 first-letter:float-left first-letter:text-yellow-500 first-letter:leading-none">
                                {para}
                            </p>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. WHAT YOU'LL FIND HERE */}
            <section className="py-24 bg-zinc-900/40 relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-2xl mx-auto mb-16 text-center">
                        <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold text-yellow-500 mb-4">The Content</h2>
                        <h3 className="text-3xl md:text-5xl font-serif font-bold tracking-tight">What You'll Find Here</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {features.map((feature, i) => {
                            const Icon = iconMap[feature.icon] || Info;
                            return (
                                <div key={i} className="group relative p-8 bg-[#121212] border border-zinc-800/50 hover:border-yellow-500/50 transition-all duration-700">
                                    <div className="w-12 h-12 bg-zinc-800/50 flex items-center justify-center mb-6 group-hover:bg-yellow-500 transition-all duration-500 rounded-none transform group-hover:-rotate-3">
                                        <Icon className="text-yellow-500 group-hover:text-black transition-colors duration-500" size={24} />
                                    </div>
                                    <h4 className="text-xl font-bold mb-4 font-serif group-hover:text-yellow-500 transition-colors duration-500">{feature.title}</h4>
                                    <p className="text-zinc-400 text-base leading-relaxed font-inter opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 4. OUR PHILOSOPHY */}
            <section className="py-28 container mx-auto px-4 text-center">
                <div className="max-w-3xl mx-auto">
                    <div className="relative inline-block mb-8">
                        <span className="text-6xl text-yellow-500/10 font-serif absolute -top-8 -left-8 select-none italic">“</span>
                        <blockquote className="text-2xl md:text-4xl font-serif font-medium leading-tight relative z-10 px-6">
                            {philosophy.quote}
                        </blockquote>
                        <span className="text-6xl text-yellow-500/10 font-serif absolute -bottom-10 -right-8 select-none italic">”</span>
                    </div>
                    <div className="mt-8 flex items-center justify-center gap-3">
                        <span className="w-6 h-px bg-zinc-800"></span>
                        <cite className="not-italic text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">
                            {philosophy.author}
                        </cite>
                        <span className="w-6 h-px bg-zinc-800"></span>
                    </div>
                </div>
            </section>

            {/* 5. AUTHOR / CREATOR SECTION */}
            <section className="py-24 bg-[#0a0a0a]">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-14">
                        <div className="w-full lg:w-[380px] aspect-[4/5] relative flex-shrink-0 group">
                            <div className="absolute inset-0 border-2 border-yellow-500 translate-x-4 translate-y-4 z-0 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500"></div>
                            <div className="relative z-10 w-full h-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
                                <SafeImage
                                    src={author.image}
                                    alt={author.name}
                                    fill
                                    className="object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
                                />
                            </div>
                        </div>
                        <div className="flex-1 text-center lg:text-left">
                            <h2 className="text-[10px] uppercase tracking-[0.5em] font-bold text-yellow-500 mb-4 font-inter underline underline-offset-4 decoration-yellow-500/30">Behind the Lens</h2>
                            <h3 className="text-4xl md:text-5xl font-serif font-black mb-6 tracking-tight text-white">Meet {author.name}</h3>
                            <p className="text-lg md:text-xl text-zinc-400 font-serif leading-relaxed mb-8 max-w-2xl">
                                {author.bio}
                            </p>
                            <div className="flex justify-center lg:justify-start gap-6 items-center">
                                <span className="text-[9px] uppercase tracking-[0.3em] font-black text-zinc-600">Connect</span>
                                <div className="flex gap-4">
                                    <a href={author.socials.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-white transition-all duration-300">
                                        <Instagram size={18} />
                                    </a>
                                    <a href={author.socials.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-white transition-all duration-300">
                                        <Youtube size={18} />
                                    </a>
                                    <a href={`mailto:${author.socials.email}`} className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-white transition-all duration-300">
                                        <Mail size={18} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. CTA SECTION */}
            <section className="py-28 bg-zinc-900 border-t border-zinc-800 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <h2 className="text-4xl md:text-6xl font-serif font-black uppercase mb-10 tracking-tight">The world is <span className="text-yellow-500 italic">waiting</span>.</h2>
                    <Link
                        href="/destinations"
                        className="inline-flex items-center gap-4 bg-white text-black px-10 py-5 text-[10px] uppercase tracking-[0.4em] font-black hover:bg-yellow-500 transition-all duration-500 group"
                    >
                        Start Exploring
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-500" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
