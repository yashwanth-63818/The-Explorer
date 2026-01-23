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
    const pathname = usePathname();

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
        };

        const handleClickOutside = (e) => {
            if (!e.target.closest("header")) {
                setActiveMenu(null);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
                        <Link href="/" onClick={() => { setActiveMenu(null); setIsOpen(false); }} className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-[#FFD700] rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#ffed4a] transition-colors">
                                <Flag size={20} className="text-black fill-black" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight italic font-serif">The Explorer</span>
                        </Link>

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

