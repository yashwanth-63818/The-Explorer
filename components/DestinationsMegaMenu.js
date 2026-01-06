import Link from "next/link";
import { ChevronRight } from "lucide-react";

// COMPLETE list of countries/territories by Continent
// codes from https://flagcdn.com/en/codes.json
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
    },
    {
        name: "Antarctica",
        countries: [
            { name: "Antarctica", code: "aq" } // Unique case
        ]
    }
];

const topDestinations = [
    { name: "Thailand", code: "th" },
    { name: "Indonesia", code: "id" },
    { name: "Italy", code: "it" },
    { name: "Albania", code: "al" },
    { name: "Canada", code: "ca" },
    { name: "Switzerland", code: "ch" },
];

const topRegions = [
    "Balkans",
    "South America",
    "Southeast Asia",
    "Central Asia",
    "Nordics",
    "Patagonia"
];

export default function DestinationsMegaMenu({ onClose }) {
    return (
        <div className="bg-[#1a1a1a] text-white w-full border-t-2 border-[#FFD700] shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300 h-[calc(100vh-80px)] overflow-y-auto custom-scrollbar overscroll-contain">
            {/* Inner Content Container */}
            <div className="container mx-auto px-4 lg:px-8 py-8 pb-32">

                {/* Top Section: Highlights */}
                <div className="flex flex-col xl:flex-row gap-8 pb-8 border-b border-white/5 mb-10 items-start xl:items-center shrink-0">
                    <div className="flex flex-wrap items-center gap-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#9CA3AF] mr-2">Top Destinations</span>
                        {topDestinations.map(dest => (
                            <Link
                                key={dest.name}
                                href={`/destinations/${dest.name.toLowerCase().replace(/ /g, '-')}`}
                                onClick={onClose}
                                className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FFD700] px-3 py-1.5 rounded-md transition-all group"
                            >
                                <img
                                    src={`https://flagcdn.com/w40/${dest.code}.png`}
                                    srcSet={`https://flagcdn.com/w80/${dest.code}.png 2x`}
                                    alt={`Flag of ${dest.name}`}
                                    className="w-5 h-3.5 object-cover rounded-[2px]"
                                />
                                <span className="text-sm font-medium text-gray-300 group-hover:text-white">{dest.name}</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </Link>
                        ))}
                    </div>

                    <div className="hidden xl:block w-px h-6 bg-white/10"></div>

                    <div className="flex flex-wrap items-center gap-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#9CA3AF] mr-2">Top Regions</span>
                        {topRegions.map(region => (
                            <Link
                                key={region}
                                href={`/region/${region.toLowerCase().replace(' ', '-')}`}
                                onClick={onClose}
                                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FFD700] px-4 py-1.5 rounded-md transition-all"
                            >
                                <span className="text-sm font-medium text-gray-300 hover:text-white">{region}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Main Content: Continents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12">

                    {/* Column 1: Africa */}
                    <div>
                        <div className="flex items-center justify-between mb-5 group cursor-pointer border-b border-white/5 pb-2 sticky top-0 bg-[#1a1a1a] z-10">
                            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 group-hover:text-[#FFD700] transition-colors">{continents[0].name}</h3>
                            <ChevronRight size={14} className="text-gray-600 group-hover:text-[#FFD700] transition-colors" />
                        </div>
                        <div className="grid grid-cols-1 gap-y-2.5">
                            {continents[0].countries.map(country => (
                                <Link
                                    key={country.name}
                                    href={`/destinations/${country.name.toLowerCase().replace(/ /g, '-')}`}
                                    onClick={onClose}
                                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-[13px] font-medium group py-0.5 hover:pl-1 transition-all"
                                >
                                    <img
                                        src={`https://flagcdn.com/w40/${country.code}.png`}
                                        alt={country.name}
                                        className="w-[20px] h-[14px] object-cover rounded-[2px] opacity-80 group-hover:opacity-100 transition-opacity shadow-sm"
                                    />
                                    {country.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Asia */}
                    <div>
                        <div className="flex items-center justify-between mb-5 group cursor-pointer border-b border-white/5 pb-2 sticky top-0 bg-[#1a1a1a] z-10">
                            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 group-hover:text-[#FFD700] transition-colors">{continents[1].name}</h3>
                            <ChevronRight size={14} className="text-gray-600 group-hover:text-[#FFD700] transition-colors" />
                        </div>
                        <div className="grid grid-cols-1 gap-y-2.5">
                            {continents[1].countries.map(country => (
                                <Link
                                    key={country.name}
                                    href={`/destinations/${country.name.toLowerCase().replace(/ /g, '-')}`}
                                    onClick={onClose}
                                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-[13px] font-medium group py-0.5 hover:pl-1 transition-all"
                                >
                                    <img
                                        src={`https://flagcdn.com/w40/${country.code}.png`}
                                        alt={country.name}
                                        className="w-[20px] h-[14px] object-cover rounded-[2px] opacity-80 group-hover:opacity-100 transition-opacity shadow-sm"
                                    />
                                    {country.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Column 3: Europe */}
                    <div>
                        <div className="flex items-center justify-between mb-5 group cursor-pointer border-b border-white/5 pb-2 sticky top-0 bg-[#1a1a1a] z-10">
                            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 group-hover:text-[#FFD700] transition-colors">{continents[2].name}</h3>
                            <ChevronRight size={14} className="text-gray-600 group-hover:text-[#FFD700] transition-colors" />
                        </div>
                        <div className="grid grid-cols-1 gap-y-2.5">
                            {continents[2].countries.map(country => (
                                <Link
                                    key={country.name}
                                    href={`/destinations/${country.name.toLowerCase().replace(/ /g, '-')}`}
                                    onClick={onClose}
                                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-[13px] font-medium group py-0.5 hover:pl-1 transition-all"
                                >
                                    <img
                                        src={`https://flagcdn.com/w40/${country.code}.png`}
                                        alt={country.name}
                                        className="w-[20px] h-[14px] object-cover rounded-[2px] opacity-80 group-hover:opacity-100 transition-opacity shadow-sm"
                                    />
                                    {country.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Column 4: Americas, Oceania, Antarctica */}
                    <div className="space-y-12">
                        {/* North America */}
                        <div>
                            <div className="flex items-center justify-between mb-5 group cursor-pointer border-b border-white/5 pb-2 sticky top-0 bg-[#1a1a1a] z-10">
                                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 group-hover:text-[#FFD700] transition-colors">{continents[3].name}</h3>
                                <ChevronRight size={14} className="text-gray-600 group-hover:text-[#FFD700] transition-colors" />
                            </div>
                            <div className="grid grid-cols-1 gap-y-2.5">
                                {continents[3].countries.map(country => (
                                    <Link
                                        key={country.name}
                                        href={`/destinations/${country.name.toLowerCase().replace(/ /g, '-')}`}
                                        onClick={onClose}
                                        className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-[13px] font-medium group py-0.5 hover:pl-1 transition-all"
                                    >
                                        <img
                                            src={`https://flagcdn.com/w40/${country.code}.png`}
                                            alt={country.name}
                                            className="w-[20px] h-[14px] object-cover rounded-[2px] opacity-80 group-hover:opacity-100 transition-opacity shadow-sm"
                                        />
                                        {country.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* South America */}
                        <div>
                            <div className="flex items-center justify-between mb-5 group cursor-pointer border-b border-white/5 pb-2 sticky top-0 bg-[#1a1a1a] z-10">
                                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 group-hover:text-[#FFD700] transition-colors">{continents[4].name}</h3>
                                <ChevronRight size={14} className="text-gray-600 group-hover:text-[#FFD700] transition-colors" />
                            </div>
                            <div className="grid grid-cols-1 gap-y-2.5">
                                {continents[4].countries.map(country => (
                                    <Link
                                        key={country.name}
                                        href={`/destinations/${country.name.toLowerCase().replace(/ /g, '-')}`}
                                        onClick={onClose}
                                        className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-[13px] font-medium group py-0.5 hover:pl-1 transition-all"
                                    >
                                        <img
                                            src={`https://flagcdn.com/w40/${country.code}.png`}
                                            alt={country.name}
                                            className="w-[20px] h-[14px] object-cover rounded-[2px] opacity-80 group-hover:opacity-100 transition-opacity shadow-sm"
                                        />
                                        {country.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Oceania */}
                        <div>
                            <div className="flex items-center justify-between mb-5 group cursor-pointer border-b border-white/5 pb-2 sticky top-0 bg-[#1a1a1a] z-10">
                                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 group-hover:text-[#FFD700] transition-colors">{continents[5].name}</h3>
                                <ChevronRight size={14} className="text-gray-600 group-hover:text-[#FFD700] transition-colors" />
                            </div>
                            <div className="grid grid-cols-1 gap-y-2.5">
                                {continents[5].countries.map(country => (
                                    <Link
                                        key={country.name}
                                        href={`/destinations/${country.name.toLowerCase().replace(/ /g, '-')}`}
                                        onClick={onClose}
                                        className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-[13px] font-medium group py-0.5 hover:pl-1 transition-all"
                                    >
                                        <img
                                            src={`https://flagcdn.com/w40/${country.code}.png`}
                                            alt={country.name}
                                            className="w-[20px] h-[14px] object-cover rounded-[2px] opacity-80 group-hover:opacity-100 transition-opacity shadow-sm"
                                        />
                                        {country.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Antarctica */}
                        <div>
                            <div className="flex items-center justify-between mb-5 group cursor-pointer border-b border-white/5 pb-2 sticky top-0 bg-[#1a1a1a] z-10">
                                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 group-hover:text-[#FFD700] transition-colors">{continents[6].name}</h3>
                                <ChevronRight size={14} className="text-gray-600 group-hover:text-[#FFD700] transition-colors" />
                            </div>
                            <div className="grid grid-cols-1 gap-y-2.5">
                                {continents[6].countries.map(country => (
                                    <Link
                                        key={country.name}
                                        href={`/destinations/${country.name.toLowerCase().replace(/ /g, '-')}`}
                                        onClick={onClose}
                                        className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-[13px] font-medium group py-0.5 hover:pl-1 transition-all"
                                    >
                                        <img
                                            src={`https://flagcdn.com/w40/${country.code}.png`}
                                            alt={country.name}
                                            className="w-[20px] h-[14px] object-cover rounded-[2px] opacity-80 group-hover:opacity-100 transition-opacity shadow-sm"
                                        />
                                        {country.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
            {/* Footer of Menu */}
            <div className="bg-[#151515] py-4 border-t border-white/5 text-center shrink-0">
                <Link
                    href="/destinations"
                    onClick={onClose}
                    className="text-xs font-bold uppercase tracking-widest text-[#9CA3AF] hover:text-[#FFD700] transition-colors flex items-center justify-center gap-2"
                >
                    View All Destinations <ChevronRight size={12} />
                </Link>
            </div>
        </div>
    );
}
