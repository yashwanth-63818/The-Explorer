import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center justify-center px-4">
            <h1 className="text-9xl font-serif font-black text-yellow-500 mb-4 opacity-20">404</h1>
            <h2 className="text-4xl md:text-6xl font-serif font-bold uppercase tracking-tight mb-8">Page Not Found</h2>
            <p className="text-zinc-500 text-lg mb-12 max-w-md text-center">
                The destination you are looking for has been moved or doesn't exist. Let's get you back on track.
            </p>
            <Link
                href="/"
                className="flex items-center gap-3 bg-white text-black px-8 py-4 text-xs font-black uppercase tracking-[0.3em] hover:bg-yellow-500 transition-colors"
            >
                <ArrowLeft size={16} />
                Back to Home
            </Link>
        </div>
    );
}
