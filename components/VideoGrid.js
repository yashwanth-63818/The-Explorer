"use client";
import { useState } from "react";
import VideoCard from "./VideoCard";
import { X } from "lucide-react";

export default function VideoGrid({ categories }) {
    const [selectedVideo, setSelectedVideo] = useState(null);

    const openVideo = (video) => {
        setSelectedVideo(video);
        document.body.style.overflow = 'hidden';
    };

    const closeVideo = () => {
        setSelectedVideo(null);
        document.body.style.overflow = 'unset';
    };

    const categoryArray = Object.values(categories);

    return (
        <>
            <div className="space-y-24 py-20">
                {categoryArray.map((category, idx) => (
                    <section key={idx} className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                            <div className="max-w-xl">
                                <hr className="w-12 border-2 border-yellow-500 mb-6" />
                                <h2 className="text-3xl md:text-5xl font-serif font-black uppercase tracking-tighter text-white">
                                    {category.name}
                                </h2>
                            </div>
                            <p className="text-zinc-500 text-sm font-bold uppercase tracking-[0.3em] font-inter">
                                {category.videos.length} Videos Available
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {category.videos.map((video) => (
                                <VideoCard key={video.id} video={video} onClick={openVideo} />
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            {/* Video Modal */}
            {selectedVideo && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
                    <button
                        onClick={closeVideo}
                        className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-2"
                    >
                        <X size={32} />
                    </button>

                    <div className="w-full max-w-6xl aspect-video px-4">
                        <iframe
                            src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
                            className="w-full h-full shadow-2xl"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>

                        <div className="mt-8 text-white">
                            <h3 className="text-2xl md:text-3xl font-serif font-bold mb-2">
                                {selectedVideo.title}
                            </h3>
                            <p className="text-zinc-400 uppercase tracking-widest text-xs font-bold">
                                {selectedVideo.channel} • {selectedVideo.viewCount} Views
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
