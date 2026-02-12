"use client";
import Link from "next/link";
import { Search, Menu, X, ChevronDown, ChevronRight, Instagram, Youtube, Twitter, Plane, Bed, Home, Bus, Train, Car, Compass, Ticket, Shield, Smartphone, Lock } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import DestinationsMegaMenu from "./DestinationsMegaMenu";
import SafeImage from "./SafeImage";
import SignInModal from "./SignInModal";
import { ALL_DESTINATIONS } from "../lib/destinationList";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Lock body scroll when a mega menu is open
    useEffect(() => {
        if (activeMenu || isSignInOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [activeMenu, isSignInOpen]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setActiveMenu(null);
                setIsOpen(false);
                setIsAccountMenuOpen(false);
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
                setIsAccountMenuOpen(false);
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

    const handleLogin = (userData) => {
        setUser(userData);
        setIsSignInOpen(false);
    };

    const handleLogout = () => {
        setUser(null);
        setIsAccountMenuOpen(false);
        router.push('/');
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
            {/* Top Bar - Replaced smoky grey with deep black */}
            <div className={`relative z-20 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-md shadow-2xl' : 'bg-black/80 backdrop-blur-sm'}`}>
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo Section */}
                        <Link href="/" onClick={() => { setActiveMenu(null); setIsOpen(false); }} className="flex items-center gap-3 group shrink-0">
                            <div className="w-14 h-14 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
                                <img src="/logo.png" alt="The Explorer Logo" className="w-full h-full object-cover rounded-full border-2 border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.5)]" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight italic font-serif hidden sm:block">The Explorer</span>
                        </Link>

                        {/* Search Box - Replaced gray with black/yellow theme */}
                        <div className="hidden md:flex items-center flex-1 max-w-sm mx-auto relative px-6">
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#FFD700]/50">
                                    <Search size={14} />
                                </div>
                                <input
                                    id="nav-search"
                                    type="text"
                                    placeholder="SEARCH DESTINATIONS..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="block w-full bg-white/5 border border-white/20 rounded-full py-2.5 pl-10 pr-10 text-[10px] font-black tracking-[0.1em] text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700] focus:bg-white/10 transition-all uppercase"
                                />
                            </div>
                        </div>

                        {/* Action Area */}
                        <div className="hidden lg:flex items-center gap-6">
                            <a href="#" className="text-[#FFD700]/80 hover:text-white transition-colors"><Instagram size={18} /></a>
                            <a href="#" className="text-[#FFD700]/80 hover:text-white transition-colors"><Youtube size={20} /></a>

                            {user ? (
                                <div className="relative account-menu-container">
                                    <button
                                        onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                                        className="flex items-center gap-3 bg-white/10 hover:bg-[#FFD700] px-5 py-2.5 rounded-full border border-white/20 transition-all group hover:text-black"
                                    >
                                        <div className="w-7 h-7 rounded-full bg-[#FFD700] group-hover:bg-black text-black group-hover:text-[#FFD700] flex items-center justify-center font-black text-xs transition-colors">
                                            {user.name[0]}
                                        </div>
                                        <span className="text-[11px] font-black text-white group-hover:text-black uppercase tracking-[0.1em]">{user.name}</span>
                                        <ChevronDown size={14} className={`text-[#FFD700] group-hover:text-black transition-transform duration-200 ${isAccountMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu - Pure White/Black/Yellow */}
                                    {isAccountMenuOpen && (
                                        <div className="absolute top-full right-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden py-3 animate-in fade-in slide-in-from-top-2 duration-200 ring-2 ring-[#FFD700]">
                                            <div className="px-5 py-4 border-b border-gray-100 mb-2">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Authenticated</p>
                                                <p className="text-sm font-black text-black truncate">{user.email || user.name}</p>
                                            </div>
                                            <Link
                                                href="/my-trips"
                                                onClick={() => setIsAccountMenuOpen(false)}
                                                className="w-full text-left px-5 py-3.5 text-xs font-black text-gray-800 hover:bg-[#FFD700] hover:text-black flex items-center gap-3 transition-all group"
                                            >
                                                <Plane size={16} className="text-[#FFD700] group-hover:text-black" /> MY TRIPS
                                            </Link>
                                            <Link
                                                href="/settings"
                                                onClick={() => setIsAccountMenuOpen(false)}
                                                className="w-full text-left px-5 py-3.5 text-xs font-black text-gray-800 hover:bg-[#FFD700] hover:text-black flex items-center gap-3 transition-all group"
                                            >
                                                <Shield size={16} className="text-[#FFD700] group-hover:text-black" /> TRAVEL SETTINGS
                                            </Link>
                                            <div className="border-t border-gray-100 mt-2 pt-2">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left px-5 py-3.5 text-xs font-black text-red-600 hover:bg-black hover:text-white flex items-center gap-3 transition-all"
                                                >
                                                    <X size={16} className="text-red-600" /> LOG OUT
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsSignInOpen(true)}
                                    className="px-8 py-3 bg-[#FFD700] hover:bg-white text-black font-black uppercase tracking-[0.1em] text-[11px] rounded-full transition-all shadow-xl active:scale-95 border-2 border-transparent hover:border-black"
                                >
                                    Sign in
                                </button>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="lg:hidden p-2 text-[#FFD700]"
                            onClick={() => { setIsOpen(!isOpen); setActiveMenu(null); }}
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Links Bar - Replaced smoky grey with black */}
            <div className={`hidden lg:block border-t border-white/10 transition-all duration-300 relative ${scrolled ? 'bg-black/95 backdrop-blur-md' : 'bg-black/90'}`}>
                <div className="container mx-auto px-4 justify-center flex py-4">
                    <div className="flex items-center gap-14">
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
                                    className={`text-[12px] font-black uppercase tracking-[0.25em] transition-all flex items-center gap-1 ${activeMenu === item.name ? 'text-[#FFD700] scale-105' : 'text-white/80 hover:text-[#FFD700]'}`}
                                >
                                    {item.name}
                                </Link>
                                {item.hasDropdown && (
                                    <ChevronDown size={12} className={`text-[#FFD700]/50 transition-transform duration-300 ${activeMenu === item.name ? 'rotate-180 text-[#FFD700]' : ''}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mega Menu - Themed */}
                {activeMenu && (
                    <div className="absolute top-full left-0 w-full bg-black border-t border-[#FFD700]/20 shadow-[0_40px_60px_rgba(0,0,0,0.8)] z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                        {activeMenu === "Planning" ? (
                            <div className="container mx-auto px-4 py-16">
                                <div className="grid grid-cols-4 gap-12 max-w-5xl mx-auto">
                                    {planningItems.map((tool) => (
                                        <a
                                            key={tool.name}
                                            href={tool.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() => setActiveMenu(null)}
                                            className="flex flex-col items-center gap-6 group/item p-8 rounded-[32px] hover:bg-white/5 transition-all text-center border border-transparent hover:border-[#FFD700]/30"
                                        >
                                            <div className="w-16 h-16 rounded-3xl bg-[#FFD700] flex items-center justify-center flex-shrink-0 text-black group-hover/item:scale-110 group-hover/item:rotate-3 transition-all shadow-xl">
                                                <tool.icon size={28} strokeWidth={2.5} />
                                            </div>
                                            <div>
                                                <div className="font-black text-[14px] uppercase tracking-[0.1em] text-white group-hover/item:text-[#FFD700] transition-colors">{tool.name}</div>
                                                <div className="text-[#FFD700]/40 text-[10px] uppercase font-black tracking-widest mt-2">{tool.sub}</div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ) : activeMenu === "Destinations" ? (
                            <DestinationsMegaMenu onClose={() => setActiveMenu(null)} />
                        ) : null}
                    </div>
                )}
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="lg:hidden fixed inset-0 top-20 bg-black z-40 overflow-y-auto w-full border-t border-white/10">
                    <div className="flex flex-col p-10 gap-10">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-4xl font-black uppercase tracking-tighter text-white hover:text-[#FFD700] transition-colors border-b-4 border-white/5 pb-8"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* SignIn Modal */}
            <SignInModal
                isOpen={isSignInOpen}
                onClose={() => setIsSignInOpen(false)}
                onLogin={handleLogin}
            />
        </header>
    );
}
