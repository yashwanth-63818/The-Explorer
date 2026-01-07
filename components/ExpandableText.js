"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ExpandableText({ text }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const words = text.split(" ");
    const limit = 40;
    const isLong = words.length > limit;

    const displayParagraphs = isExpanded ? text : words.slice(0, limit).join(" ") + (isLong ? "..." : "");

    return (
        <div className="space-y-4">
            <div className="text-zinc-400 text-lg md:text-xl leading-relaxed font-serif whitespace-pre-line">
                {displayParagraphs}
            </div>
            {isLong && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 text-yellow-500 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-colors"
                >
                    {isExpanded ? (
                        <>Read Less <ChevronUp size={14} /></>
                    ) : (
                        <>Read More <ChevronDown size={14} /></>
                    )}
                </button>
            )}
        </div>
    );
}
