"use client";
import SafeImage from "./SafeImage";
import { Play } from "lucide-react";
import Link from "next/link";

export default function VideoCard({ video, onClick, href }) {
    if (!video) return null;

    const CardContent = (
        <div className="group bg-[#1a1a1a] overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-500 h-full">
            <div className="relative aspect-video overflow-hidden">
                <SafeImage
                    src={video.thumbnail || video.thumbnailUrl}
                    alt={video.title}
                    fill
                    className="object-cover scale-100 group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:bg-yellow-500 group-hover:border-yellow-500 transition-all duration-500 transform group-hover:scale-110">
                        <Play size={20} className="text-white group-hover:text-black fill-current ml-1" />
                    </div>
                </div>

                {/* Duration */}
                <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 text-[10px] font-bold text-white tracking-widest uppercase">
                    {video.duration}
                </div>

                {/* Country Label */}
                {video.country && (
                    <div className="absolute top-3 left-3 bg-yellow-500 px-2 py-0.5 text-[9px] font-black text-black tracking-[0.2em] uppercase">
                        {video.country}
                    </div>
                )}
            </div>

            <div className="p-5">
                <h4 className="text-base font-bold font-serif mb-2 line-clamp-2 leading-tight text-white group-hover:text-yellow-500 transition-colors duration-300">
                    {video.title}
                </h4>
                <div className="flex items-center justify-between mt-4 border-t border-white/5 pt-4">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold truncate pr-4">
                        {video.channel || video.author}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-600 whitespace-nowrap">
                        {video.viewCount ? `${video.viewCount} VIEWS` : (video.publishedAt || "RECENT")}
                    </span>
                </div>
            </div>
        </div>
    );

    if (href) {
        return (
            <Link href={href} className="block cursor-pointer">
                {CardContent}
            </Link>
        );
    }

    return (
        <div
            className="cursor-pointer"
            onClick={() => onClick && onClick(video)}
        >
            {CardContent}
        </div>
    );
}
