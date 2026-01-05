import Link from "next/link";
import { Clock, Calendar, ArrowLeft } from "lucide-react";

export default async function BlogPost({ params }) {
    const { slug } = await params;

    // Mock data - normally fetched via slug
    const post = {
        title: "The Ultimate Guide to Backpacking Japan",
        slug: slug,
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop",
        date: "October 24, 2023",
        readTime: "15 min read",
        author: "Alex Rivera",
        content: (
            <>
                <p className="mb-6 text-lg leading-relaxed text-gray-700">Japan is a country that seamlessly blends ancient traditions with futuristic technology. From the neon-lit streets of Tokyo to the serene temples of Kyoto, every corner of this island nation offers a unique experience. In this guide, we'll explore the best routes, budget tips, and must-see destinations for your backpacking adventure.</p>

                <h2 className="text-3xl font-serif font-bold mb-6 mt-12 text-gray-900">Planning Your Trip</h2>
                <p className="mb-6 text-lg leading-relaxed text-gray-700">Before you go, it's essential to understand the rail system. The JR Pass is a lifesaver for travelers, offering unlimited travel on JR lines. However, recent price hikes mean you should calculate if it's worth it for your specific itinerary.</p>

                <h2 className="text-3xl font-serif font-bold mb-6 mt-12 text-gray-900">Where to Stay</h2>
                <p className="mb-6 text-lg leading-relaxed text-gray-700">Accommodation in Japan ranges from luxury Ryokans (traditional inns) to capsule hotels. For backpackers, business hotels and hostels are excellent, clean, and affordable options.</p>

                <blockquote className="border-l-4 border-black pl-6 italic text-xl my-10 text-gray-800 font-serif">
                    "The true charm of Japan lies not just in its sights, but in its hospitality (Omotenashi)."
                </blockquote>

                <h2 className="text-3xl font-serif font-bold mb-6 mt-12 text-gray-900">Cultural Etiquette</h2>
                <p className="mb-6 text-lg leading-relaxed text-gray-700">Respect is paramount in Japanese culture. Always bow when greeting, take off your shoes when entering homes or certain temples, and never eat while walking on the street.</p>
            </>
        )
    };

    return (
        <article className="min-h-screen bg-white">
            {/* Full Width Hero */}
            <div className="relative h-[60vh] lg:h-[70vh] w-full overflow-hidden">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 flex flex-col justify-end pb-12 lg:pb-24 px-4 lg:px-8 container mx-auto">
                    <Link href="/" className="text-white/80 hover:text-white mb-6 flex items-center gap-2 text-sm uppercase tracking-widest font-medium transition-colors w-fit">
                        <ArrowLeft size={16} /> Back to Home
                    </Link>
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-4 text-white/90 text-sm font-medium uppercase tracking-widest mb-4">
                            <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
                            <span className="flex items-center gap-1"><Clock size={14} /> {post.readTime}</span>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex items-center gap-3 text-white/90 font-medium">
                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop" alt="Author" className="w-full h-full object-cover" />
                            </div>
                            <span>By {post.author}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-20 flex flex-col lg:flex-row gap-16">
                {/* Sidebar / TOC */}
                <aside className="lg:w-1/4 hidden lg:block h-fit sticky top-24">
                    <h3 className="font-bold uppercase tracking-widest text-xs text-gray-400 mb-6">Table of Contents</h3>
                    <ul className="space-y-4 text-sm font-medium text-gray-600 border-l border-gray-200 pl-4">
                        <li className="text-black border-l-2 border-black -ml-[17px] pl-4">Introduction</li>
                        <li className="hover:text-black cursor-pointer transition-colors block">Planning Your Trip</li>
                        <li className="hover:text-black cursor-pointer transition-colors block">Where to Stay</li>
                        <li className="hover:text-black cursor-pointer transition-colors block">Cultural Etiquette</li>
                    </ul>
                </aside>

                {/* Content */}
                <div className="lg:w-2/3 max-w-3xl">
                    <div className="font-serif">
                        {post.content}
                    </div>
                </div>
            </div>
        </article>
    );
}
