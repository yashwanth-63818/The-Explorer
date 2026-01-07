import { getVideoBySlug, getRelatedVideos, getVideosByCountry } from "@/lib/videoService";
import { getComments } from "@/lib/commentService";
import VideoCard from "@/components/VideoCard";
import CommentSection from "@/components/CommentSection";
import ExpandableText from "@/components/ExpandableText";
import SafeImage from "@/components/SafeImage";
import { Clock, Calendar, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const video = await getVideoBySlug(slug);
    if (!video) return { title: "Video Not Found" };
    return {
        title: `${video.title} | The Explorer`,
        description: video.description.substring(0, 160),
    };
}

export default async function VideoDetailPage({ params }) {
    const { slug } = await params;
    const video = await getVideoBySlug(slug);

    if (!video) {
        notFound();
    }

    const [comments, topVideos, countryVideos] = await Promise.all([
        getComments(slug),
        getVideos(), // For general recommendations
        getRelatedVideos(video.country, slug)
    ]);

    const relatedVideos = topVideos.filter(v => v.slug !== slug).slice(0, 4);

    return (
        <div className="bg-[#0f0f0f] text-white min-h-screen pt-32 pb-24 selection:bg-yellow-400 selection:text-black">
            <div className="container mx-auto px-4 lg:px-8">

                {/* Back Link */}
                <Link href="/videos" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-yellow-500 transition-colors mb-10 group">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Videos
                </Link>

                <div className="flex flex-col lg:flex-row gap-16">

                    {/* Main Content Area */}
                    <div className="flex-1 lg:max-w-[70%]">

                        {/* 🎬 Video Player */}
                        <div className="relative aspect-video bg-black border border-white/5 shadow-2xl overflow-hidden mb-12 group">
                            <iframe
                                src={`${video.videoUrl}?autoplay=0&rel=0`}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>

                        {/* 🧾 Video Meta */}
                        <div className="mb-12 border-b border-white/5 pb-10">
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-black uppercase tracking-tighter text-white mb-6 leading-[0.9]">
                                {video.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                                <div className="flex items-center gap-2 text-zinc-500">
                                    <User size={14} className="text-yellow-500" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{video.author}</span>
                                </div>
                                <div className="flex items-center gap-2 text-zinc-500">
                                    <Calendar size={14} className="text-yellow-500" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{new Date(video.publishedAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-2 text-zinc-500">
                                    <Clock size={14} className="text-yellow-500" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{video.duration} MINS</span>
                                </div>
                            </div>
                        </div>

                        {/* 📝 Video Description */}
                        <div className="mb-20">
                            <h3 className="text-xs uppercase tracking-[0.4em] font-bold text-yellow-500 mb-6">About this journey</h3>
                            <ExpandableText text={video.description} />
                        </div>

                        {/* 🌍 More From Same Country Section */}
                        {countryVideos.length > 0 && (
                            <div className="mt-20 border-t border-white/5 pt-16">
                                <h3 className="text-xs uppercase tracking-[0.4em] font-bold text-yellow-500 mb-8">More from {video.country}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {countryVideos.map((v) => (
                                        <VideoCard key={v.slug} video={v} href={`/videos/${v.slug}`} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 💬 Comments Section */}
                        <CommentSection slug={slug} comments={comments} />

                    </div>

                    {/* ▶️ Sidebar - More Videos */}
                    <aside className="w-full lg:w-[30%]">
                        <div className="sticky top-32">
                            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Recommended</h3>
                                <Link href="/videos" className="text-[9px] font-black uppercase tracking-[0.2em] text-yellow-500 hover:text-white transition-colors">See All</Link>
                            </div>

                            <div className="space-y-8">
                                {relatedVideos.map((r) => (
                                    <Link key={r.slug} href={`/videos/${r.slug}`} className="group flex flex-col gap-4">
                                        <div className="relative aspect-video overflow-hidden border border-white/5">
                                            <SafeImage
                                                src={r.thumbnailUrl}
                                                alt={r.title}
                                                fill
                                                className="object-cover scale-100 group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-100"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                                                    <Clock size={16} className="text-black" />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold font-serif text-white group-hover:text-yellow-500 transition-colors line-clamp-2">
                                                {r.title}
                                            </h4>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mt-2">{r.duration} MINS • {r.country}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Newsletter or extra prompt */}
                            <div className="mt-16 bg-zinc-900 border border-white/5 p-8 text-center">
                                <h4 className="text-lg font-serif font-black uppercase mb-4">Never miss an episode</h4>
                                <p className="text-xs text-zinc-500 leading-relaxed mb-6">Join 10,000+ explorers getting weekly cinematic travel stories.</p>
                                <div className="flex flex-col gap-3">
                                    <input type="email" placeholder="Email Address" className="bg-black border border-white/10 px-4 py-3 text-xs focus:outline-none focus:border-yellow-500" />
                                    <button className="bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] py-3 hover:bg-yellow-500 transition-colors">Join Now</button>
                                </div>
                            </div>
                        </div>
                    </aside>

                </div>
            </div>
        </div>
    );
}
