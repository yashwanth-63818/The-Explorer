import Link from "next/link";
import { ArrowRight } from "lucide-react";

const featuredPosts = [
    {
        id: 1,
        title: "The Ultimate Guide to Backpacking Japan",
        excerpt: "From the neon streets of Tokyo to the ancient temples of Kyoto, discover the perfect itinerary for your first trip to Japan.",
        category: "Guides",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop",
        slug: "backpacking-japan",
    },
    {
        id: 2,
        title: "Hidden Gems of the Amalfi Coast",
        category: "Destinations",
        image: "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?q=80&w=2070&auto=format&fit=crop",
        slug: "amalfi-coast",
    },
    {
        id: 3,
        title: "Safari Photography Tips for Beginners",
        category: "Photography",
        image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068&auto=format&fit=crop",
        slug: "safari-photography",
    }
];

export default function FeaturedPosts() {
    return (
        <section className="py-20 lg:py-28 bg-gray-50">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex justify-between items-end mb-12">
                    <h2 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900">Featured Stories</h2>
                    <Link href="/blog" className="hidden md:flex items-center gap-2 text-sm font-medium uppercase tracking-wide hover:gap-3 transition-all">
                        View All <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Large Post */}
                    <Link href={`/blog/${featuredPosts[0].slug}`} className="group relative h-[500px] lg:h-[600px] overflow-hidden block rounded-none">
                        <img
                            src={featuredPosts[0].image}
                            alt={featuredPosts[0].title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                        <div className="absolute bottom-0 left-0 p-8 lg:p-12 text-white">
                            <span className="inline-block px-3 py-1 bg-white text-black text-xs font-bold uppercase tracking-widest mb-4">
                                {featuredPosts[0].category}
                            </span>
                            <h3 className="text-3xl lg:text-5xl font-serif font-bold mb-4 leading-tight group-hover:underline decoration-1 underline-offset-4">
                                {featuredPosts[0].title}
                            </h3>
                            <p className="text-gray-200 text-lg max-w-xl line-clamp-2 hidden md:block">
                                {featuredPosts[0].excerpt}
                            </p>
                        </div>
                    </Link>

                    {/* Right Column Grid */}
                    <div className="flex flex-col gap-8">
                        {featuredPosts.slice(1).map((post) => (
                            <Link key={post.id} href={`/blog/${post.slug}`} className="group relative h-[240px] lg:h-[284px] overflow-hidden block flex-1 rounded-none">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                                <div className="absolute bottom-0 left-0 p-6 lg:p-8 text-white">
                                    <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest mb-3 border border-white/30">
                                        {post.category}
                                    </span>
                                    <h3 className="text-2xl lg:text-3xl font-serif font-bold leading-tight group-hover:underline decoration-1 underline-offset-4">
                                        {post.title}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
