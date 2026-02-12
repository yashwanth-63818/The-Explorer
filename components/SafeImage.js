"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

/**
 * A Client Component for safe image rendering with fallback.
 * Solves the "Event handlers cannot be passed to Client Component props" error
 * by encapsulating interactive logic here.
 */
export default function SafeImage({
    src,
    alt,
    fallbackSrc = "https://images.unsplash.com/photo-1469442232812-5503c13bc726?q=80&w=2070&auto=format&fit=crop",
    className = "",
    width,
    height,
    fill = false,
    priority = false,
    quality = 75,
    ...props
}) {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Sync state if src changes (crucial for dynamic routes)
    useEffect(() => {
        setImgSrc(src);
        setHasError(false);
        setIsLoading(true);
    }, [src]);

    const handleError = () => {
        if (!hasError) {
            setImgSrc(fallbackSrc);
            setHasError(true);
            setIsLoading(false);
        }
    };

    const finalSrc = imgSrc || fallbackSrc;

    // If fill is true, Next.js Image requires absolute positioning and doesn't want width/height
    const imageProps = fill
        ? { fill, priority, quality, className: `${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-700`, alt: alt || "", ...props }
        : { width, height, priority, quality, className: `${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-700`, alt: alt || "", ...props };

    return (
        <div className={`relative ${fill ? 'w-full h-full' : ''} bg-white/[0.03] overflow-hidden`}>
            {isLoading && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-white/[0.02] via-white/[0.05] to-white/[0.02]"></div>
            )}
            <Image
                {...imageProps}
                src={finalSrc}
                onError={handleError}
                onLoad={() => setIsLoading(false)}
                unoptimized={typeof finalSrc === 'string' && finalSrc.startsWith('http')}
            />
        </div>
    );
}
