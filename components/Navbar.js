"use client";
import Link from "next/link";
import { Search, Menu, X, ChevronDown, Flag, Instagram, Youtube, Twitter, Plane, Bed, Home, Bus, Train, Car, Compass, Ticket, Shield, Smartphone, Lock } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import DestinationsMegaMenu from "./DestinationsMegaMenu";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);
    const pathname = usePathname();
    const router = useRouter();

    // Close menus on route change
    useEffect(() => {
        setIsOpen(false);
        setActiveMenu(null);
    }, [pathname]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Lock body scroll when a mega menu is open
    useEffect(() => {
        if (activeMenu) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [activeMenu]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setActiveMenu(null);
                setIsOpen(false);
                setShowResults(false);
            }
        };

        const handleClickOutside = (e) => {
            if (!e.target.closest("header") && !e.target.closest(".search-results-dropdown")) {
                setActiveMenu(null);
                setShowResults(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchResults = async () => {
            if (searchQuery.length < 2) {
                setSearchResults([]);
                setShowResults(false);
                return;
            }

            setIsSearching(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
                const data = await res.json();
                setSearchResults(data);
                setShowResults(true);
            } catch (err) {
                console.error("Search error:", err);
            } finally {
                setIsSearching(false);
            }
        };

        const timer = setTimeout(fetchResults, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleResultClick = (result) => {
        setSearchQuery("");
        setShowResults(false);
        setIsOpen(false);
        if (result.type === 'country') {
            router.push(`/destinations/${result.slug}`);
        } else if (result.type === 'city') {
            router.push(`/destinations/${result.countrySlug}`);
        } else if (result.type === 'region') {
            router.push(`/destinations`);
        }
    };

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter' && searchResults.length > 0) {
            handleResultClick(searchResults[0]);
        }
    };

    const navItems = [
        { name: "Planning", href: "/planning", hasDropdown: true },
        { name: "Destinations", href: "/destinations", hasDropdown: true },
        { name: "About", href: "/about", hasDropdown: true },
        { name: "Video", href: "/videos", hasDropdown: false },
        { name: "Inspiration", href: "/inspiration", hasDropdown: false },
        { name: "Resources", href: "/resources", hasDropdown: false },
        { name: "Shop", href: "/shop", hasDropdown: true, hasBadge: true },
    ];

    const planningItems = [
        { name: "Find Cheap Flights", sub: "Best Deals", icon: Plane, href: "/planning/find-cheap-flights" },
        { name: "Find Hotels", sub: "via Booking.com", icon: Bed, href: "https://www.booking.com" },
        { name: "Find Hostels", sub: "via Hostelworld", icon: Home, href: "https://www.hostelworld.com" },
        { name: "Find Buses", sub: "via Omio", icon: Bus, href: "https://www.omio.com" },
        { name: "Find Trains", sub: "via Omio", icon: Train, href: "https://www.omio.com" },
        { name: "Rent a Car", sub: "via DiscoverCars", icon: Car, href: "https://www.discovercars.com" },
        { name: "Find Things to Do", sub: "via Viator", icon: Compass, href: "https://www.viator.com" },
        { name: "Find Ticket Deals", sub: "via GetYourGuide", icon: Ticket, href: "https://www.getyourguide.com" },
        { name: "Find Travel Insurance", sub: "via Heymondo", icon: Shield, href: "https://www.heymondo.com" },
        { name: "Find SIM Cards", sub: "via Airalo", icon: Smartphone, href: "https://www.airalo.com" },
        { name: "Download VPN", sub: "via ProtonVPN", icon: Lock, href: "https://protonvpn.com" },
    ];

    return (
        <header className="fixed top-0 w-full z-50">
            {/* Top Bar - Dark Background - Added relative and high z-index to keep search results on top */}
            <div className={`relative z-20 transition-all duration-300 ${scrolled ? 'bg-[#2d2d2d]/95 backdrop-blur-md shadow-md' : 'bg-[#2d2d2d]/80 backdrop-blur-sm'}`}>
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo Section */}
                        <Link href="/" onClick={() => { setActiveMenu(null); setIsOpen(false); }} className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-[#FFD700] rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#ffed4a] transition-colors">
                                <Flag size={20} className="text-black fill-black" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">The Explorer</span>
                        </Link>

                        {/* Middle Search Bar - Hidden on mobile, visible desktop */}
                        <div className="hidden lg:block flex-1 max-w-xl mx-8 relative" ref={searchRef}>
                            <div className="relative group">
                                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isSearching ? 'text-[#FFD700] animate-pulse' : 'text-gray-400 group-focus-within:text-white'}`} size={18} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                                    onKeyDown={handleSearchSubmit}
                                    placeholder="Search the blog"
                                    className="w-full bg-white/10 border border-white/10 rounded-full py-2.5 pl-12 pr-4 text-sm text-gray-200 placeholder:text-gray-400 focus:outline-none focus:bg-white/20 transition-all font-medium"
                                />
                            </div>

                            {/* Desktop Search Results Dropdown */}
                            {showResults && searchResults.length > 0 && (
                                <div className="absolute top-full left-0 w-full mt-2 bg-[#1a1a1b]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[60] search-results-dropdown animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="py-2">
                                        {searchResults.map((result) => (
                                            <button
                                                key={result.id}
                                                onClick={() => handleResultClick(result)}
                                                className="w-full px-5 py-3.5 flex items-center gap-4 hover:bg-white/10 transition-all text-left group border-b border-white/[0.03] last:border-0"
                                            >
                                                <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-[#FFD700] group-hover:text-black transition-all duration-300">
                                                    {result.type === 'country' ? <Flag size={15} /> : result.type === 'city' ? <Compass size={15} /> : <div className="text-[9px] font-black uppercase tracking-tighter">REG</div>}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-200 group-hover:text-white">{result.name}</span>
                                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">
                                                        {result.type === 'country' ? result.region :
                                                            result.type === 'city' ? `City in ${result.countryName}` :
                                                                'Global Region'}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {showResults && searchResults.length === 0 && searchQuery.length >= 2 && !isSearching && (
                                <div className="absolute top-full left-0 w-full mt-2 bg-[#1a1a1b] border border-white/10 rounded-2xl shadow-2xl p-6 text-center z-[60] search-results-dropdown">
                                    <p className="text-gray-400 text-sm italic">No destinations found for "{searchQuery}"</p>
                                </div>
                            )}
                        </div>

                        {/* Social Icons */}
                        <div className="hidden lg:flex items-center gap-5">
                            <a href="#" className="text-white hover:text-[#FFD700] transition-colors"><Instagram size={20} /></a>
                            {/* Using a custom SVG for Pinterest since it might not be in the default set or using generic icon */}
                            <a href="#" className="text-white hover:text-[#FFD700] transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 0 1-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            </a>
                            <a href="#" className="text-white hover:text-[#FFD700] transition-colors"><Youtube size={22} /></a>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="lg:hidden p-2 text-white"
                            onClick={() => { setIsOpen(!isOpen); setActiveMenu(null); }}
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Links Bar - Below Header */}
            {/* Only show on desktop, mobile has its own menu */}
            <div className={`hidden lg:block border-t border-white/10 transition-all duration-300 relative ${scrolled ? 'bg-[#2d2d2d]/95 backdrop-blur-md' : 'bg-black/20 backdrop-blur-[2px]'}`}>
                <div className="container mx-auto px-4 justify-center flex py-4">
                    <div className="flex items-center gap-8">
                        {navItems.map((item) => (
                            <div key={item.name} className="relative group flex items-center gap-1 cursor-pointer py-1">
                                <Link
                                    href={item.href}
                                    onClick={(e) => {
                                        if (["Planning", "Destinations"].includes(item.name)) {
                                            e.preventDefault();
                                            setActiveMenu(activeMenu === item.name ? null : item.name);
                                        } else {
                                            setActiveMenu(null);
                                        }
                                    }}
                                    className={`text-[15px] font-bold transition-colors tracking-wide flex items-center gap-1 shadow-black drop-shadow-md ${activeMenu === item.name ? 'text-white' : 'text-white/90 group-hover:text-white'}`}
                                >
                                    {item.name}
                                    {item.hasBadge && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 ml-1 mb-3"></span>
                                    )}
                                </Link>
                                {item.hasDropdown && (
                                    <ChevronDown size={14} className={`text-white/70 transition-colors mt-0.5 ${activeMenu === item.name ? 'rotate-180 text-white' : 'group-hover:text-white'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Planning Mega Menu - Full Width Dropdown */}
                {activeMenu === "Planning" && (
                    <div className="absolute top-full left-0 w-full bg-[#1a1a1a] border-t-2 border-[#FFD700] shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="container mx-auto px-4 py-8">
                            <h3 className="text-center font-bold tracking-[0.2em] uppercase text-gray-400 mb-8 text-sm">Plan a Trip</h3>
                            <div className="grid grid-cols-4 gap-x-6 gap-y-8 max-w-5xl mx-auto">
                                {planningItems.map((tool) => (
                                    <a
                                        key={tool.name}
                                        href={tool.href}
                                        target={tool.href.startsWith("http") ? "_blank" : "_self"}
                                        rel={tool.href.startsWith("http") ? "noopener noreferrer" : ""}
                                        onClick={() => setActiveMenu(null)}
                                        className="flex items-start gap-4 group/item hover:bg-white/5 p-3 rounded-lg text-left transition-all duration-200 ease-in-out hover:-translate-y-[3px] hover:shadow-[0_12px_30px_rgba(0,0,0,0.25)]"
                                        aria-label={tool.name}
                                    >
                                        <div className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center flex-shrink-0 text-white group-hover/item:border-[#FFD700] group-hover/item:text-[#FFD700] transition-colors">
                                            <tool.icon size={22} strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-base text-gray-100 group-hover/item:text-[#FFD700] transition-colors">{tool.name}</div>
                                            <div className="text-gray-500 text-xs mt-0.5">{tool.sub}</div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                            <div className="mt-10 text-center border-t border-gray-800 pt-4 max-w-5xl mx-auto">
                                <p className="text-gray-600 text-[10px] uppercase tracking-wide">Disclosure: Links here may be affiliate links and may take you to another page.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Destinations Mega Menu */}
                {activeMenu === "Destinations" && (
                    <div className="absolute top-full left-0 w-full z-50">
                        <DestinationsMegaMenu onClose={() => setActiveMenu(null)} />
                    </div>
                )}
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="lg:hidden fixed inset-0 top-20 bg-[#2d2d2d] z-40 overflow-y-auto w-full">
                    <div className="flex flex-col p-6 gap-6">
                        <div className="relative mb-4">
                            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isSearching ? 'text-[#FFD700]' : 'text-gray-400'}`} size={18} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search destinations..."
                                className="w-full bg-white/10 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder:text-gray-400 focus:outline-none"
                            />

                            {/* Mobile Search Results */}
                            {searchQuery.length >= 2 && (
                                <div className="mt-4 space-y-2">
                                    {isSearching ? (
                                        <div className="text-center py-4 text-gray-500 text-sm animate-pulse">Searching...</div>
                                    ) : searchResults.length > 0 ? (
                                        searchResults.map((result) => (
                                            <button
                                                key={result.id}
                                                onClick={() => handleResultClick(result)}
                                                className="w-full p-4 flex items-center gap-4 bg-white/5 border border-white/5 rounded-xl text-left"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#FFD700]">
                                                    {result.type === 'country' ? <Flag size={16} /> : result.type === 'city' ? <Compass size={16} /> : <div className="text-[10px] font-bold">REG</div>}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-base font-bold text-white">{result.name}</span>
                                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">
                                                        {result.type === 'country' ? result.region :
                                                            result.type === 'city' ? `City in ${result.countryName}` :
                                                                'Global Region'}
                                                    </span>
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="text-center py-4 text-gray-500 text-sm italic">No results found</div>
                                    )}
                                </div>
                            )}
                        </div>
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-lg font-bold text-white border-b border-white/10 pb-4"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}
