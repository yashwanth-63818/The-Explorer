export default function Loading() {
    return (
        <div className="bg-[#0f0f0f] min-h-screen text-white">
            {/* Skeleton Hero */}
            <div className="h-[60vh] bg-zinc-900 animate-pulse flex items-center justify-center">
                <div className="space-y-6 text-center">
                    <div className="h-4 w-32 bg-zinc-800 mx-auto rounded"></div>
                    <div className="h-20 w-80 md:w-[600px] bg-zinc-800 mx-auto rounded"></div>
                    <div className="h-4 w-60 bg-zinc-800 mx-auto rounded"></div>
                </div>
            </div>

            {/* Skeleton Featured */}
            <div className="container mx-auto px-4 -mt-20">
                <div className="max-w-6xl mx-auto aspect-video bg-zinc-800 animate-pulse rounded border border-white/5"></div>
            </div>

            {/* Skeleton Grids */}
            <div className="container mx-auto px-4 py-20 space-y-20">
                {[1, 2].map(i => (
                    <div key={i} className="space-y-10">
                        <div className="flex justify-between items-end border-b border-white/5 pb-8">
                            <div className="h-10 w-64 bg-zinc-900 rounded"></div>
                            <div className="h-4 w-32 bg-zinc-900 rounded"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map(j => (
                                <div key={j} className="space-y-4">
                                    <div className="aspect-video bg-zinc-900 rounded animate-pulse"></div>
                                    <div className="h-6 w-full bg-zinc-900 rounded"></div>
                                    <div className="h-4 w-2/3 bg-zinc-900 rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
