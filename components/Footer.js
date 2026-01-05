import Link from "next/link";
import { Instagram, Youtube, Facebook, Twitter } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-black text-white py-16 border-t border-gray-800">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <h2 className="text-2xl font-serif font-bold mb-6">THE EXPLORER</h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Inspiring travelers to see the world, one story at a time.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Explore</h3>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><Link href="/destinations" className="hover:text-white transition-colors">Destinations</Link></li>
                            <li><Link href="/blog" className="hover:text-white transition-colors">Stories</Link></li>
                            <li><Link href="/guides" className="hover:text-white transition-colors">Travel Guides</Link></li>
                            <li><Link href="/photography" className="hover:text-white transition-colors">Photography</Link></li>
                        </ul>
                    </div>

                    {/* About */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Company</h3>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Follow Us</h3>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-gray-900 rounded-full hover:bg-white hover:text-black transition-all">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="p-2 bg-gray-900 rounded-full hover:bg-white hover:text-black transition-all">
                                <Youtube size={18} />
                            </a>
                            <a href="#" className="p-2 bg-gray-900 rounded-full hover:bg-white hover:text-black transition-all">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="p-2 bg-gray-900 rounded-full hover:bg-white hover:text-black transition-all">
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-500 text-xs">
                    &copy; {new Date().getFullYear()} The Explorer. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
