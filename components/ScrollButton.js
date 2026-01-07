"use client";

import { ArrowRight } from "lucide-react";

export default function ScrollButton({ children, className }) {
    return (
        <button
            onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
            className={className}
        >
            {children}
        </button>
    );
}
