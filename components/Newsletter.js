"use client";
import { Send } from "lucide-react";
import { useState } from "react";

export default function Newsletter() {
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Thank you for subscribing to our newsletter!");
        setEmail("");
    };

    return (
        <section className="py-24 bg-black border-t border-white/5 relative overflow-hidden">
            {/* Decorative Ambient Glow */}
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-yellow-400/5 blur-[120px] rounded-full"></div>

            <div className="container mx-auto px-4 text-center max-w-xl relative z-10">
                <h2 className="text-3xl lg:text-5xl font-serif font-bold mb-4 text-white">Join the <span className="text-yellow-400 italic">Journey</span></h2>
                <p className="text-gray-400 mb-10 leading-relaxed text-lg">
                    Subscribe to receive travel stories, destination guides, and photography tips directly to your inbox.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 p-2 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="flex-1 px-6 py-4 bg-transparent border-none focus:outline-none text-white placeholder-white/30 font-medium"
                    />
                    <button
                        type="submit"
                        className="px-8 py-4 bg-yellow-400 text-black hover:bg-white transition-all flex items-center justify-center gap-3 font-black uppercase tracking-widest text-xs rounded-xl shadow-xl"
                    >
                        Subscribe
                        <Send size={16} strokeWidth={3} />
                    </button>
                </form>
                <p className="text-[10px] text-gray-500 mt-6 font-bold uppercase tracking-[0.2em]">
                    🔒 No spam, unsubscribe anytime.
                </p>
            </div>
        </section>
    );
}
