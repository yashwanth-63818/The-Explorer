"use client";

import { useTransition, useRef } from "react";
import { addComment } from "@/lib/commentService";
import { User, Mail, MessageSquare } from "lucide-react";

export default function CommentSection({ slug, comments = [] }) {
    const [isPending, startTransition] = useTransition();
    const formRef = useRef(null);

    const handleSubmit = async (formData) => {
        startTransition(async () => {
            const result = await addComment(slug, formData);
            if (result.success) {
                formRef.current?.reset();
            } else if (result.error) {
                alert(result.error);
            }
        });
    };

    return (
        <div className="mt-20 border-t border-white/10 pt-16">
            <h3 className="text-2xl font-serif font-bold mb-10 flex items-center gap-3 text-white">
                <MessageSquare size={24} className="text-yellow-500" />
                Join the Conversation ({comments.length})
            </h3>

            {/* Comment Form */}
            <form
                ref={formRef}
                action={handleSubmit}
                className="space-y-6 mb-16 bg-zinc-900/50 p-8 border border-white/5"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            required
                            className="w-full bg-black border border-white/10 py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-yellow-500 transition-colors"
                        />
                    </div>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            required
                            className="w-full bg-black border border-white/10 py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-yellow-500 transition-colors"
                        />
                    </div>
                </div>
                <div>
                    <textarea
                        name="comment"
                        rows="5"
                        placeholder="Share your thoughts..."
                        required
                        className="w-full bg-black border border-white/10 p-4 text-sm text-white focus:outline-none focus:border-yellow-500 transition-colors resize-none"
                    ></textarea>
                </div>
                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-yellow-500 text-black px-8 py-3 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white transition-colors disabled:opacity-50"
                >
                    {isPending ? "Posting..." : "Post Comment"}
                </button>
            </form>

            {/* Comments List */}
            <div className="space-y-10">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-6 pb-10 border-b border-white/5 last:border-0">
                            <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center flex-shrink-0 text-zinc-500 font-bold uppercase text-xs">
                                {comment.name.charAt(0)}
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="font-bold text-white text-sm uppercase tracking-wider">{comment.name}</span>
                                    <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{comment.date}</span>
                                </div>
                                <p className="text-zinc-400 text-base leading-relaxed font-inter">
                                    {comment.text}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-zinc-600 text-sm italic">Be the first to share your thoughts!</p>
                )}
            </div>
        </div>
    );
}
