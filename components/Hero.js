import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0 bg-gray-900">
                <img
                    src="https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=2070&auto=format&fit=crop"
                    alt="Zermatt Matterhorn Night"
                    className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-black/40"></div>
            </div>

            {/* Giant Background Text */}
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                <h2 className="text-[15vw] font-black text-white/5 tracking-tighter leading-none whitespace-nowrap blur-sm transform -translate-y-12">
                    WELCOME
                </h2>
            </div>

            {/* Content Grid */}
            <div className="relative z-10 w-full max-w-7xl px-4 lg:px-8 h-full flex flex-col justify-end pb-20 lg:pb-32 pt-40 lg:pt-56">

                {/* Top Right Bio (Absolute or Grid positioning) */}
                <div className="absolute top-48 right-4 lg:right-8 max-w-xs text-right hidden lg:block animate-in fade-in slide-in-from-right duration-1000 delay-500">
                    <p className="text-gray-300 text-sm font-medium leading-relaxed">
                        I am a travel blogger based in the Mountains, specializing in backpacking, hiking, and photography. <span className="text-white border-b border-[#FFD700] pb-0.5">Learn more here.</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
                    {/* Main Text Content */}
                    <div className="lg:col-span-8 text-left animate-in fade-in slide-in-from-bottom duration-1000">
                        <h1 className="font-sans font-black text-6xl md:text-8xl lg:text-[100px] leading-[0.9] text-white uppercase tracking-tighter mb-8">
                            I'M THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">EXPLORER.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed mb-10 border-l-4 border-[#FFD700] pl-6">
                            I create travel guides and backpacking itineraries from around the world, as well as sharing photography resources and more to inspire your next adventure.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5">
                            <Link
                                href="/destinations"
                                className="px-10 py-4 bg-[#FFD700] text-black font-bold tracking-widest uppercase hover:bg-[#FFE55C] transition-all transform hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
                            >
                                Start Exploring
                            </Link>
                            <Link
                                href="/video"
                                className="px-10 py-4 bg-transparent border-2 border-white/20 text-white font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all"
                            >
                                Watch Videos
                            </Link>
                        </div>
                    </div>

                    {/* Latest Video Card (Floating) */}
                    <div className="lg:col-span-4 hidden lg:block animate-in fade-in zoom-in duration-1000 delay-300">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl hover:bg-white/20 transition-all cursor-pointer group">
                            <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                                <img
                                    src="https://images.unsplash.com/photo-1540206395-688085723adb?q=80&w=1000&auto=format&fit=crop"
                                    alt="Latest Video"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                                    <div className="w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center pl-1">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="black"><path d="M8 5v14l11-7z" /></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="text-[#FFD700] text-xs font-bold uppercase tracking-widest">Latest Video</span>
                                    <h3 className="text-white font-bold text-lg leading-tight mt-1">Sumatra: Reconnecting with Nature</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Curved Divider */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="block w-full h-16 md:h-24 fill-[#121212]">
                    <path d="M0,0 C150,100 350,0 600,60 C850,120 1050,20 1200,80 L1200,120 L0,120 Z"></path>
                </svg>
            </div>
        </section>
    );
}
