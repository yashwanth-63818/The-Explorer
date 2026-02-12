import Link from "next/link";
import { ChevronRight, MapPin, Globe, Compass } from "lucide-react";
import SafeImage from "@/components/SafeImage";

// Data imported/mirrored from DestinationsMegaMenu for consistency
const continents = [
    {
        name: "Africa",
        countries: [
            { name: "Algeria", code: "dz" }, { name: "Angola", code: "ao" }, { name: "Benin", code: "bj" },
            { name: "Botswana", code: "bw" }, { name: "Burkina Faso", code: "bf" }, { name: "Burundi", code: "bi" },
            { name: "Cabo Verde", code: "cv" }, { name: "Cameroon", code: "cm" }, { name: "Central African Republic", code: "cf" },
            { name: "Chad", code: "td" }, { name: "Comoros", code: "km" }, { name: "Congo (DRC)", code: "cd" },
            { name: "Congo (Republic)", code: "cg" }, { name: "Côte d'Ivoire", code: "ci" }, { name: "Djibouti", code: "dj" },
            { name: "Egypt", code: "eg" }, { name: "Equatorial Guinea", code: "gq" }, { name: "Eritrea", code: "er" },
            { name: "Eswatini", code: "sz" }, { name: "Ethiopia", code: "et" }, { name: "Gabon", code: "ga" },
            { name: "Gambia", code: "gm" }, { name: "Ghana", code: "gh" }, { name: "Guinea", code: "gn" },
            { name: "Guinea-Bissau", code: "gw" }, { name: "Kenya", code: "ke" }, { name: "Lesotho", code: "ls" },
            { name: "Liberia", code: "lr" }, { name: "Libya", code: "ly" }, { name: "Madagascar", code: "mg" },
            { name: "Malawi", code: "mw" }, { name: "Mali", code: "ml" }, { name: "Mauritania", code: "mr" },
            { name: "Mauritius", code: "mu" }, { name: "Morocco", code: "ma" }, { name: "Mozambique", code: "mz" },
            { name: "Namibia", code: "na" }, { name: "Niger", code: "ne" }, { name: "Nigeria", code: "ng" },
            { name: "Rwanda", code: "rw" }, { name: "São Tomé & Príncipe", code: "st" }, { name: "Senegal", code: "sn" },
            { name: "Seychelles", code: "sc" }, { name: "Sierra Leone", code: "sl" }, { name: "Somalia", code: "so" },
            { name: "South Africa", code: "za" }, { name: "South Sudan", code: "ss" }, { name: "Sudan", code: "sd" },
            { name: "Tanzania", code: "tz" }, { name: "Togo", code: "tg" }, { name: "Tunisia", code: "tn" },
            { name: "Uganda", code: "ug" }, { name: "Zambia", code: "zm" }, { name: "Zimbabwe", code: "zw" }
        ]
    },
    {
        name: "Asia",
        countries: [
            { name: "Afghanistan", code: "af" }, { name: "Armenia", code: "am" }, { name: "Azerbaijan", code: "az" },
            { name: "Bahrain", code: "bh" }, { name: "Bangladesh", code: "bd" }, { name: "Bhutan", code: "bt" },
            { name: "Brunei", code: "bn" }, { name: "Cambodia", code: "kh" }, { name: "China", code: "cn" },
            { name: "Georgia", code: "ge" }, { name: "Hong Kong", code: "hk" }, { name: "India", code: "in" },
            { name: "Indonesia", code: "id" }, { name: "Iran", code: "ir" }, { name: "Iraq", code: "iq" },
            { name: "Israel", code: "il" }, { name: "Japan", code: "jp" }, { name: "Jordan", code: "jo" },
            { name: "Kazakhstan", code: "kz" }, { name: "Kuwait", code: "kw" }, { name: "Kyrgyzstan", code: "kg" },
            { name: "Laos", code: "la" }, { name: "Lebanon", code: "lb" }, { name: "Macau", code: "mo" },
            { name: "Malaysia", code: "my" }, { name: "Maldives", code: "mv" }, { name: "Mongolia", code: "mn" },
            { name: "Myanmar", code: "mm" }, { name: "Nepal", code: "np" }, { name: "North Korea", code: "kp" },
            { name: "Oman", code: "om" }, { name: "Pakistan", code: "pk" }, { name: "Palestine", code: "ps" },
            { name: "Philippines", code: "ph" }, { name: "Qatar", code: "qa" }, { name: "Saudi Arabia", code: "sa" },
            { name: "Singapore", code: "sg" }, { name: "South Korea", code: "kr" }, { name: "Sri Lanka", code: "lk" },
            { name: "Syria", code: "sy" }, { name: "Taiwan", code: "tw" }, { name: "Tajikistan", code: "tj" },
            { name: "Thailand", code: "th" }, { name: "Timor-Leste", code: "tl" }, { name: "Turkey", code: "tr" },
            { name: "Turkmenistan", code: "tm" }, { name: "UAE", code: "ae" }, { name: "Uzbekistan", code: "uz" },
            { name: "Vietnam", code: "vn" }, { name: "Yemen", code: "ye" }
        ]
    },
    {
        name: "Europe",
        countries: [
            { name: "Albania", code: "al" }, { name: "Andorra", code: "ad" }, { name: "Austria", code: "at" },
            { name: "Belarus", code: "by" }, { name: "Belgium", code: "be" }, { name: "Bosnia & Herzegovina", code: "ba" },
            { name: "Bulgaria", code: "bg" }, { name: "Croatia", code: "hr" }, { name: "Cyprus", code: "cy" },
            { name: "Czech Republic", code: "cz" }, { name: "Denmark", code: "dk" }, { name: "Estonia", code: "ee" },
            { name: "Finland", code: "fi" }, { name: "France", code: "fr" }, { name: "Germany", code: "de" },
            { name: "Greece", code: "gr" }, { name: "Hungary", code: "hu" }, { name: "Iceland", code: "is" },
            { name: "Ireland", code: "ie" }, { name: "Italy", code: "it" }, { name: "Kosovo", code: "xk" },
            { name: "Latvia", code: "lv" }, { name: "Liechtenstein", code: "li" }, { name: "Lithuania", code: "lt" },
            { name: "Luxembourg", code: "lu" }, { name: "Malta", code: "mt" }, { name: "Moldova", code: "md" },
            { name: "Monaco", code: "mc" }, { name: "Montenegro", code: "me" }, { name: "Netherlands", code: "nl" },
            { name: "North Macedonia", code: "mk" }, { name: "Norway", code: "no" }, { name: "Poland", code: "pl" },
            { name: "Portugal", code: "pt" }, { name: "Romania", code: "ro" }, { name: "Russia", code: "ru" },
            { name: "San Marino", code: "sm" }, { name: "Serbia", code: "rs" }, { name: "Slovakia", code: "sk" },
            { name: "Slovenia", code: "si" }, { name: "Spain", code: "es" }, { name: "Sweden", code: "se" },
            { name: "Switzerland", code: "ch" }, { name: "Ukraine", code: "ua" }, { name: "United Kingdom", code: "gb" },
            { name: "Vatican City", code: "va" }
        ]
    },
    {
        name: "North America",
        countries: [
            { name: "Antigua & Barbuda", code: "ag" }, { name: "Bahamas", code: "bs" }, { name: "Barbados", code: "bb" },
            { name: "Belize", code: "bz" }, { name: "Canada", code: "ca" }, { name: "Costa Rica", code: "cr" },
            { name: "Cuba", code: "cu" }, { name: "Dominica", code: "dm" }, { name: "Dominican Republic", code: "do" },
            { name: "El Salvador", code: "sv" }, { name: "Grenada", code: "gd" }, { name: "Guatemala", code: "gt" },
            { name: "Haiti", code: "ht" }, { name: "Honduras", code: "hn" }, { name: "Jamaica", code: "jm" },
            { name: "Mexico", code: "mx" }, { name: "Nicaragua", code: "ni" }, { name: "Panama", code: "pa" },
            { name: "St. Kitts & Nevis", code: "kn" }, { name: "St. Lucia", code: "lc" }, { name: "St. Vincent", code: "vc" },
            { name: "Trinidad & Tobago", code: "tt" }, { name: "USA", code: "us" }
        ]
    },
    {
        name: "South America",
        countries: [
            { name: "Argentina", code: "ar" }, { name: "Bolivia", code: "bo" }, { name: "Brazil", code: "br" },
            { name: "Chile", code: "cl" }, { name: "Colombia", code: "co" }, { name: "Ecuador", code: "ec" },
            { name: "Guyana", code: "gy" }, { name: "Paraguay", code: "py" }, { name: "Peru", code: "pe" },
            { name: "Suriname", code: "sr" }, { name: "Uruguay", code: "uy" }, { name: "Venezuela", code: "ve" }
        ]
    },
    {
        name: "Oceania",
        countries: [
            { name: "Australia", code: "au" }, { name: "Fiji", code: "fj" }, { name: "Kiribati", code: "ki" },
            { name: "Marshall Islands", code: "mh" }, { name: "Micronesia", code: "fm" }, { name: "Nauru", code: "nr" },
            { name: "New Zealand", code: "nz" }, { name: "Palau", code: "pw" }, { name: "Papua New Guinea", code: "pg" },
            { name: "Samoa", code: "ws" }, { name: "Solomon Islands", code: "sb" }, { name: "Tonga", code: "to" },
            { name: "Tuvalu", code: "tv" }, { name: "Vanuatu", code: "vu" }
        ]
    }
];

const topDestinations = [
    { name: "Thailand", code: "th", image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1000&auto=format&fit=crop" },
    { name: "Indonesia", code: "id", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop" },
    { name: "Italy", code: "it", image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1000&auto=format&fit=crop" },
    { name: "Albania", code: "al", image: "https://images.unsplash.com/photo-1580216643062-cf460548a66a?q=80&w=1000&auto=format&fit=crop" },
    { name: "Canada", code: "ca", image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=1000&auto=format&fit=crop" },
    { name: "Switzerland", code: "ch", image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1000&auto=format&fit=crop" },
];

export const metadata = {
    title: "All Destinations | The Explorer",
    description: "Browse our complete directory of travel guides and expert recommendations for every country and territory in the world.",
};

export default function DestinationsPage() {
    return (
        <main className="bg-[#0b0b0b] min-h-screen pt-[var(--nav-height)]">
            {/* Header Section */}
            <section className="py-20 border-b border-white/5 bg-gradient-to-b from-black to-[#0b0b0b]">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="max-w-4xl">
                        <h1 className="text-gray-400 text-xs md:text-sm font-bold tracking-[0.4em] uppercase mb-4 flex items-center gap-3">
                            <Globe size={14} className="text-yellow-400" /> Complete Directory
                        </h1>
                        <h2 className="text-5xl md:text-7xl font-serif font-black text-white tracking-tight mb-8">
                            All <span className="text-yellow-400 italic">Destinations</span>
                        </h2>
                        <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                            Expert travel guides, cinematic visuals, and detailed planning tools for every corner of the globe. Simply click a destination to start your journey.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-4 lg:px-8">
                    {/* Top Highlights Grid */}
                    <div className="mb-20">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center text-black">
                                <Compass size={20} />
                            </div>
                            <h3 className="text-xl font-serif font-bold text-white uppercase tracking-wider">Top Destinations</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                            {topDestinations.map(dest => (
                                <Link
                                    key={dest.name}
                                    href={`/destinations/${dest.name.toLowerCase().replace(/ /g, '-')}`}
                                    className="group relative h-80 overflow-hidden rounded-3xl bg-white/5 border border-white/10 hover:border-yellow-400/50 transition-all duration-700 hover:-translate-y-2 shadow-2xl"
                                >
                                    <div className="absolute inset-0">
                                        <SafeImage
                                            src={dest.image}
                                            alt={dest.name}
                                            fill
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent group-hover:via-black/40 transition-all duration-500"></div>
                                    </div>

                                    <div className="absolute inset-x-0 bottom-0 p-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <SafeImage
                                                src={`https://flagcdn.com/w40/${dest.code}.png`}
                                                alt={`Flag of ${dest.name}`}
                                                className="w-5 h-3.5 object-cover rounded-[2px] shadow-lg border border-white/20"
                                                width={20}
                                                height={14}
                                            />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FFD700]">Explore</span>
                                        </div>
                                        <h4 className="text-xl font-serif font-black text-white group-hover:text-yellow-400 transition-colors uppercase tracking-tight">{dest.name}</h4>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Continent Directory Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 xl:gap-20">
                        {continents.map((continent) => (
                            <div key={continent.name} className="flex flex-col">
                                <div className="flex items-center justify-between mb-8 pb-3 border-b border-white/10">
                                    <h3 className="text-sm font-black uppercase tracking-[0.25em] text-gray-400">{continent.name}</h3>
                                    <span className="text-[10px] font-black bg-white/5 text-yellow-400/60 px-2 py-0.5 rounded-full">{continent.countries.length}</span>
                                </div>
                                <div className="grid grid-cols-1 gap-y-3.5">
                                    {continent.countries.map(country => (
                                        <Link
                                            key={country.name}
                                            href={`/destinations/${country.name.toLowerCase().replace(/ /g, '-')}`}
                                            className="flex items-center gap-4 text-gray-400 hover:text-white transition-all text-[14px] font-medium group hover:pl-2"
                                        >
                                            <SafeImage
                                                src={`https://flagcdn.com/w40/${country.code}.png`}
                                                alt={country.name}
                                                className="w-5 h-3.5 object-cover rounded-[2px] opacity-60 group-hover:opacity-100 transition-opacity"
                                                width={20}
                                                height={14}
                                            />
                                            <span className="group-hover:text-yellow-400 transition-colors uppercase tracking-widest text-[11px] font-black">
                                                {country.name}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
