"use client";

import { ArrowRight } from "lucide-react";

export default function ScrollButton({ children, className, targetId }) {
    const handleScroll = () => {
        if (targetId) {
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                return;
            }
        }
        window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    };

    return (
        <button
            onClick={handleScroll}
            className={className}
        >
            {children}
        </button>
    );
}
