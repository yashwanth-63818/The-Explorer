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
        <section className="py-24 bg-gray-50 border-t border-gray-200">
            <div className="container mx-auto px-4 text-center max-w-xl">
                <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-4">Join the Journey</h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    Subscribe to receive travel stories, destination guides, and photography tips directly to your inbox.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="flex-1 px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-black transition-colors"
                    />
                    <button
                        type="submit"
                        className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 font-medium uppercase tracking-wide text-sm"
                    >
                        Subscribe
                        <Send size={16} />
                    </button>
                </form>
                <p className="text-xs text-gray-500 mt-4">
                    No spam, unsubscribe anytime.
                </p>
            </div>
        </section>
    );
}
