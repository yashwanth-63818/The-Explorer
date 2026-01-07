"use client";
import { useState } from "react";
import SafeImage from "./SafeImage";
import { Play, X } from "lucide-react";

export default function FeaturedVideo({ video }) {
    const [isOpen, setIsOpen] = useState(false);

    if (!video) return null;

    const openVideo = () => {
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeVideo = () => {
        setIsOpen(false);
        document.body.style.overflow = 'unset';
    };

    return (
        <>
            <div
                className="max-w-6xl mx-auto group cursor-pointer"
                onClick={openVideo}
            >
                <div className="relative aspect-video shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10 group-hover:border-yellow-500/30 transition-all duration-700">
                    {/* Thumbnail with Play Button Overlay */}
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 group-hover:bg-black/10 transition-colors duration-500">
                        <div className="w-20 h-20 md:w-32 md:h-32 bg-yellow-500 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-700 shadow-2xl">
                            <Play size={32} className="text-black fill-current ml-2" />
                        </div>
                        <div className="mt-8 text-center px-4">
                            <h2 className="text-2xl md:text-4xl font-serif font-black uppercase text-white tracking-tight mb-2 max-w-2xl drop-shadow-lg">
                                {video.title}
                            </h2>
                            <p className="text-yellow-500 text-xs font-bold uppercase tracking-[0.3em] font-inter">
                                Featured Episode • {video.channel}
                            </p>
                        </div>
                    </div>

                    <SafeImage
                        src={video.thumbnail}
                        alt="Featured Video"
                        fill
                        className="object-cover brightness-50 scale-100 group-hover:scale-105 transition-transform duration-[3s]"
                    />
                </div>
            </div>

            {/* Video Modal - Duplicate logic for simplicity or extract to hook */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
                    <button
                        onClick={closeVideo}
                        className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-2"
                    >
                        <X size={32} />
                    </button>

                    <div className="w-full max-w-6xl aspect-video px-4">
                        <iframe
                            src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                            className="w-full h-full shadow-2xl"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>

                        <div className="mt-8 text-white">
                            <h3 className="text-2xl md:text-3xl font-serif font-bold mb-2">
                                {video.title}
                            </h3>
                            <p className="text-zinc-400 uppercase tracking-widest text-xs font-bold">
                                {video.channel} • {video.viewCount} Views
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
