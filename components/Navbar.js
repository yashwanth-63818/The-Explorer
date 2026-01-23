"use client";
import Link from "next/link";
import { Search, Menu, X, ChevronDown, ChevronRight, Instagram, Youtube, Twitter, Plane, Bed, Home, Bus, Train, Car, Compass, Ticket, Shield, Smartphone, Lock } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import DestinationsMegaMenu from "./DestinationsMegaMenu";
import { ALL_DESTINATIONS } from "../lib/destinationList";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
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
            }
            if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
                e.preventDefault();
                document.getElementById("nav-search")?.focus();
            }
        };

        const handleClickOutside = (e) => {
            if (!e.target.closest("header")) {
                setActiveMenu(null);
                setSearchResults([]);
                setSearchQuery("");
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim().length > 1) {
            const filtered = ALL_DESTINATIONS.filter(d =>
                d.name.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 8);
            setSearchResults(filtered);
        } else {
            setSearchResults([]);
        }
    };

    const navItems = [
        { name: "Destinations", href: "/destinations", hasDropdown: true },
        { name: "About", href: "/about", hasDropdown: false },
        { name: "Planning", href: "/planning", hasDropdown: true },
        { name: "Inspiration", href: "/inspiration", hasDropdown: false },
        { name: "Resources", href: "/resources", hasDropdown: false },
    ];

    const planningItems = [
        { name: "Find Hotels", sub: "Premium Stays", icon: Bed, href: "https://www.booking.com" },
        { name: "Things to Do", sub: "Guided Tours", icon: Compass, href: "https://www.viator.com" },
        { name: "Ticket Deals", sub: "Fast Track", icon: Ticket, href: "https://www.getyourguide.com" },
        { name: "SIM Cards", sub: "Global Data", icon: Smartphone, href: "https://www.airalo.com" },
    ];

    return (
        <header className="fixed top-0 w-full z-50">
            {/* Top Bar - Dark Background */}
            <div className={`relative z-20 transition-all duration-300 ${scrolled ? 'bg-[#2d2d2d]/95 backdrop-blur-md shadow-md' : 'bg-[#2d2d2d]/80 backdrop-blur-sm'}`}>
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo Section */}
                        <Link href="/" onClick={() => { setActiveMenu(null); setIsOpen(false); }} className="flex items-center gap-3 group shrink-0">
                            <div className="w-14 h-14 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
                                <img src="/logo.png" alt="The Explorer Logo" className="w-full h-full object-cover rounded-full border-2 border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.3)]" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight italic font-serif hidden sm:block">The Explorer</span>
                        </Link>

                        {/* Search Box - Center */}
                        <div className="hidden md:flex items-center flex-1 max-w-sm mx-auto relative group px-6">
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search size={14} className="text-white/20 group-focus-within:text-[#FFD700] transition-colors" />
                                </div>
                                <input
                                    id="nav-search"
                                    type="text"
                                    placeholder="Search destinations..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="block w-full bg-white/5 border border-white/10 rounded-full py-2 pl-9 pr-10 text-[11px] font-medium tracking-wider text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700] focus:bg-white/10 transition-all uppercase"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span className="text-[9px] font-black text-white/20 border border-white/10 px-1.5 py-0.5 rounded-md bg-white/5 uppercase">/</span>
                                </div>

                                {/* Search Results Dropdown */}
                                {searchResults.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-3 bg-[#1e1e1e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
                                            {searchResults.map((result) => (
                                                <button
                                                    key={result.name}
                                                    onClick={() => {
                                                        router.push(`/destinations/${result.name.toLowerCase().replace(/ /g, '-')}`);
                                                        setSearchQuery("");
                                                        setSearchResults([]);
                                                    }}
                                                    className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-white/5 transition-all group/item text-left border-b border-white/5 last:border-none"
                                                >
                                                    <img
                                                        src={`https://flagcdn.com/w40/${result.code}.png`}
                                                        alt={result.name}
                                                        className="w-5 h-3.5 object-cover rounded-[2px] opacity-60 group-hover/item:opacity-100 transition-opacity"
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="text-[12px] font-bold text-white/80 group-hover/item:text-[#FFD700] transition-colors">{result.name}</span>
                                                        <span className="text-[9px] text-white/30 uppercase tracking-widest mt-0.5">Destination Guide</span>
                                                    </div>
                                                    <ChevronRight size={14} className="ml-auto text-white/10 group-hover/item:text-[#FFD700] group-hover/item:translate-x-1 transition-all" />
                                                </button>
                                            ))}
                                        </div>
                                        <div className="bg-black/20 px-5 py-2 border-t border-white/5">
                                            <span className="text-[9px] text-white/20 uppercase font-black tracking-widest">Showing {searchResults.length} results</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Social Icons */}
                        <div className="hidden lg:flex items-center gap-8">
                            <a href="#" className="text-white/60 hover:text-[#FFD700] transition-colors"><Instagram size={18} /></a>
                            <a href="#" className="text-white/60 hover:text-[#FFD700] transition-colors"><Youtube size={20} /></a>
                            <Link
                                href="/destinations"
                                className="px-6 py-2 bg-white/5 hover:bg-[#FFD700] hover:text-black border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                            >
                                Start Journey
                            </Link>
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

            {/* Navigation Links Bar */}
            <div className={`hidden lg:block border-t border-white/5 transition-all duration-300 relative ${scrolled ? 'bg-[#2d2d2d]/95 backdrop-blur-md' : 'bg-black/20 backdrop-blur-[2px]'}`}>
                <div className="container mx-auto px-4 justify-center flex py-4">
                    <div className="flex items-center gap-12">
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
                                    className={`text-[12px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-1 drop-shadow-md ${activeMenu === item.name ? 'text-[#FFD700]' : 'text-white/70 group-hover:text-white'}`}
                                >
                                    {item.name}
                                </Link>
                                {item.hasDropdown && (
                                    <ChevronDown size={12} className={`text-white/30 transition-transform duration-300 ${activeMenu === item.name ? 'rotate-180 text-[#FFD700]' : ''}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Planning Mega Menu */}
                {activeMenu === "Planning" && (
                    <div className="absolute top-full left-0 w-full bg-[#111111] border-t border-white/5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="container mx-auto px-4 py-12">
                            <div className="grid grid-cols-4 gap-8 max-w-5xl mx-auto">
                                {planningItems.map((tool) => (
                                    <a
                                        key={tool.name}
                                        href={tool.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => setActiveMenu(null)}
                                        className="flex items-center gap-5 group/item p-4 rounded-2xl hover:bg-white/[0.03] transition-all"
                                    >
                                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0 text-white group-hover/item:border-[#FFD700] group-hover/item:text-[#FFD700] transition-colors">
                                            <tool.icon size={20} />
                                        </div>
                                        <div>
                                            <div className="font-black text-[11px] uppercase tracking-widest text-white group-hover/item:text-[#FFD700] transition-colors">{tool.name}</div>
                                            <div className="text-white/30 text-[9px] uppercase tracking-tighter mt-1">{tool.sub}</div>
                                        </div>
                                    </a>
                                ))}
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
                <div className="lg:hidden fixed inset-0 top-20 bg-[#0f0f0f] z-40 overflow-y-auto w-full border-t border-white/5">
                    <div className="flex flex-col p-8 gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-2xl font-black uppercase tracking-tighter text-white border-b border-white/5 pb-6"
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

