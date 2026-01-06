import { destinations } from "@/lib/destinationData";
import { getDynamicDestinationData } from "@/lib/destinationService";
import Link from "next/link";
import { MapPin, Calendar, Wallet, CheckCircle, Info, Plane, Flag, Globe } from "lucide-react";

export default async function CountryPage(props) {
    const params = await props.params;
    const { slug } = params;
    // Decode and format: "south-africa" -> "South Africa"
    const countryName = decodeURIComponent(slug).split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    // 1. Try to fetch Dynamic API Data (Gemini + Unsplash + Facts)
    // This will return partial data if API keys are missing.
    const dynamicData = await getDynamicDestinationData(countryName);

    // 2. Get Static Data (Backup)
    const staticData = destinations[slug.toLowerCase()];

    // 3. Merged Data Strategy
    // Priority: Dynamic > Static > Generic Fallback
    // We construct the final object using available fields.

    // Fallback images if Unsplash fails (API Quota or No Key)
    const fallbackImages = [
        "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070",
        "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2068",
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070",
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021",
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070"
    ];

    const heroImage = (dynamicData?.images && dynamicData.images.length > 0)
        ? dynamicData.images[0].url
        : (staticData?.heroImage || fallbackImages[0]);

    // Use AI content if available, otherwise static, otherwise generic
    const intro = dynamicData?.intro || staticData?.intro || `${countryName} is a breathtaking destination waiting to be explored. From its vibrant culture to stunning landscapes, it offers an unforgettable adventure.`;
    const tagline = dynamicData?.tagline || staticData?.tagline || `Explore the beauty of ${countryName}`;

    // Best Places: AI gives us {title, desc}, Static gives {title, image}
    // We need to map AI data to the UI format (which needs images).
    // If we have AI places, we try to assign dynamic images to them from the pool.
    let bestPlaces = [];
    if (dynamicData?.bestPlaces) {
        bestPlaces = dynamicData.bestPlaces.map((place, i) => ({
            title: place.title,
            image: dynamicData.images[i + 1]?.url || fallbackImages[(i + 1) % fallbackImages.length] // Use subsequent dynamic images
        }));
    } else if (staticData?.bestPlaces) {
        bestPlaces = staticData.bestPlaces;
    } else {
        bestPlaces = [
            { title: "Capital City", image: fallbackImages[1] },
            { title: "National Park", image: fallbackImages[2] },
            { title: "Historic Old Town", image: fallbackImages[3] }
        ];
    }

    const thingsToDo = dynamicData?.thingsToDo || staticData?.thingsToDo || ["Explore Local Culture", "Try Traditional Food", "Visit Museums", "Nature Hiking"];

    // Tips
    // Dynamic Tips are "Cultural", Static are "Logistical"
    const tips = dynamicData?.culturalTips || staticData?.travelTips || {
        greeting: "Hello / Namaste / Hola",
        etiquette: "Respect local customs.",
        tipping: "Check local tipping rules."
    };

    // Facts (Unique to Dynamic Data)
    const facts = {
        capital: dynamicData?.capital || "Unknown",
        currency: dynamicData?.currency || "Local Currency",
        population: dynamicData?.population || "Unknown",
        flag: dynamicData?.flag || null
    };

    return (
        <div className="bg-[#121212] min-h-screen text-gray-200 font-sans selection:bg-[#FFD700] selection:text-black">

            {/* HERO SECTION */}
            <div className="relative h-[85vh] w-full overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <img
                    src={heroImage}
                    alt={countryName}
                    className="w-full h-full object-cover animate-in fade-in zoom-in duration-[2s]"
                />
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
                    <span className="text-[#FFD700] tracking-[0.3em] uppercase font-bold text-sm mb-6 animate-in slide-in-from-bottom-4 duration-1000 delay-300">
                        Destinations
                    </span>
                    <h1 className="text-white text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter mb-4 animate-in slide-in-from-bottom-8 duration-1000 delay-100">
                        {countryName}
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 font-serif italic max-w-2xl animate-in slide-in-from-bottom-6 duration-1000 delay-500">
                        {tagline}
                    </p>
                </div>
            </div>

            {/* FACTS BANNER (Dynamic Only) */}
            <div className="bg-[#1a1a1a] border-y border-white/5 py-6">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-wrap justify-center md:justify-between items-center gap-6">
                    {facts.flag && <img src={facts.flag} alt="Flag" className="h-8 w-auto shadow-sm" />}

                    <div className="flex items-center gap-2">
                        <Globe className="text-[#FFD700] w-4 h-4" />
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Capital</span>
                        <span className="text-white font-bold">{facts.capital}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Wallet className="text-[#FFD700] w-4 h-4" />
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Currency</span>
                        <span className="text-white font-bold">{facts.currency}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Info className="text-[#FFD700] w-4 h-4" />
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Population</span>
                        <span className="text-white font-bold">{facts.population}</span>
                    </div>
                </div>
            </div>

            {/* INTRO SECTION */}
            <section className="py-20 lg:py-32 px-4 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    <div className="lg:col-span-5">
                        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
                            Why you should visit <span className="text-[#FFD700] underline decoration-2 underline-offset-8">{countryName}</span>
                        </h2>
                        <div className="h-1 w-20 bg-[#FFD700] mb-8"></div>
                    </div>
                    <div className="lg:col-span-7">
                        <p className="text-xl text-gray-300 leading-relaxed font-light">
                            {intro}
                        </p>
                    </div>
                </div>
            </section>

            {/* BEST PLACES GRID */}
            <section className="py-20 bg-[#1a1a1a] px-4 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-end justify-between mb-16">
                        <div>
                            <span className="text-[#FFD700] font-bold tracking-widest uppercase text-xs mb-2 block">Highlights</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-white">Best Places to Visit</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {bestPlaces.map((place, index) => (
                            <div key={index} className="group relative aspect-[4/5] overflow-hidden rounded-xl cursor-pointer">
                                <img
                                    src={place.image}
                                    alt={place.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 w-full p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <h3 className="text-2xl font-bold text-white mb-2">{place.title}</h3>
                                    <div className="text-[#FFD700] text-sm font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 flex items-center gap-2">
                                        Explore <div className="w-4 h-[1px] bg-[#FFD700]"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* THINGS TO DO & TIPS */}
            <section className="py-20 lg:py-32 px-4 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

                    {/* Things to do */}
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                            <CheckCircle className="text-[#FFD700]" /> Things to Do
                        </h2>
                        <ul className="space-y-4">
                            {thingsToDo.map((thing, index) => (
                                <li key={index} className="flex items-start gap-4 p-4 bg-[#1a1a1a] rounded-lg border border-white/5 hover:border-[#FFD700]/30 transition-colors">
                                    <span className="text-[#FFD700] font-bold text-lg">0{index + 1}.</span>
                                    <span className="text-gray-300 font-medium text-lg">{thing}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Travel Tips (Dynamic vs Static structure mismatch handling) */}
                    <div className="bg-[#1a1a1a] p-8 lg:p-12 rounded-2xl border border-white/5">
                        <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                            <Info className="text-[#FFD700]" /> {dynamicData?.culturalTips ? "Cultural Insight" : "Essential Tips"}
                        </h2>
                        <div className="space-y-8">
                            {/* If Dynamic (Gemini) */}
                            {dynamicData?.culturalTips && (
                                <>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center shrink-0"><Flag className="text-[#FFD700]" /></div>
                                        <div><h4 className="text-white font-bold mb-1">Greeting</h4><p className="text-gray-400 text-sm">{dynamicData.culturalTips.greeting || tips.greeting}</p></div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center shrink-0"><CheckCircle className="text-[#FFD700]" /></div>
                                        <div><h4 className="text-white font-bold mb-1">Etiquette</h4><p className="text-gray-400 text-sm">{dynamicData.culturalTips.etiquette || tips.etiquette}</p></div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center shrink-0"><Wallet className="text-[#FFD700]" /></div>
                                        <div><h4 className="text-white font-bold mb-1">Tipping</h4><p className="text-gray-400 text-sm">{dynamicData.culturalTips.tipping || tips.tipping}</p></div>
                                    </div>
                                </>
                            )}

                            {/* If Static (Legacy Data Object) */}
                            {(!dynamicData?.culturalTips && tips.visa) && (
                                <>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center shrink-0"><MapPin className="text-[#FFD700]" /></div>
                                        <div><h4 className="text-white font-bold mb-1">Visa</h4><p className="text-gray-400 text-sm">{tips.visa}</p></div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center shrink-0"><Wallet className="text-[#FFD700]" /></div>
                                        <div><h4 className="text-white font-bold mb-1">Currency</h4><p className="text-gray-400 text-sm">{tips.currency}</p></div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
}
