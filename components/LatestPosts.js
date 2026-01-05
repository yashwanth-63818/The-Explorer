import Link from "next/link";

const posts = [
    {
        id: 1,
        title: "10 Reasons Why You Should Visit Patagonia",
        excerpt: "Patagonia is a vast region at the southern end of South America, shared by Argentina and Chile. Here is why you need to go.",
        date: "Oct 24, 2023",
        readTime: "8 min read",
        image: "https://images.unsplash.com/photo-1518182170546-0766ce6fecfa?q=80&w=2070&auto=format&fit=crop",
        slug: "patagonia-travel-guide"
    },
    {
        id: 2,
        title: "A Weekend in Paris: The Perfect Itinerary",
        excerpt: "Discover the best museums, cafes, and photo spots in the City of Light with this comprehensive 3-day guide.",
        date: "Nov 12, 2023",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop",
        slug: "weekend-in-paris"
    },
    {
        id: 3,
        title: "Exploring the Ancient Ruins of Petra",
        excerpt: "Journey through the Siq to reveal the Treasury and explore the vast archaeological site of Jordan's Rose City.",
        date: "Dec 05, 2023",
        readTime: "12 min read",
        image: "https://images.unsplash.com/photo-1579606038848-83b6329fc66c?q=80&w=2070&auto=format&fit=crop",
        slug: "explore-petra"
    }
];

export default function LatestPosts() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
                <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-12 text-center">Latest from the Journal</h2>
                <div className="space-y-16">
                    {posts.map((post) => (
                        <article key={post.id} className="group grid grid-cols-1 md:grid-cols-2 gap-8 items-center cursor-pointer">
                            {/* Image */}
                            <div className="relative overflow-hidden aspect-[4/3] md:aspect-[16/10] bg-gray-100">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-widest text-gray-500 mb-4">
                                    <span>{post.date}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <span>{post.readTime}</span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4 leading-tight group-hover:text-gray-600 transition-colors">
                                    <Link href={`/blog/${post.slug}`}>
                                        {post.title}
                                    </Link>
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    {post.excerpt}
                                </p>
                                <Link href={`/blog/${post.slug}`} className="text-sm font-bold uppercase tracking-wide border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-all">
                                    Read Article
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
