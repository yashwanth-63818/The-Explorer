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
    // Determine initial state. If src is missing, we use fallback immediately.
    const initialSrc = src || fallbackSrc;
    const [imgSrc, setImgSrc] = useState(initialSrc);
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Reset state if the source changes (important for navigation between destinations)
    useEffect(() => {
        setImgSrc(src || fallbackSrc);
        setHasError(false);
        setIsLoading(true);
    }, [src, fallbackSrc]);

    const handleError = () => {
        if (!hasError) {
            console.warn(`[SafeImage] Failed to load: ${imgSrc}. Falling back to default.`);
            setImgSrc(fallbackSrc);
            setHasError(true);
            setIsLoading(false);
        }
    };

    // Construct props carefully to avoid passing duplicates or invalid values to next/image
    const imageProps = {
        priority,
        quality,
        alt: alt || "Travel location",
        onError: handleError,
        onLoad: () => setIsLoading(false),
        className: `${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-700`,
        ...props
    };

    return (
        <div className={`relative ${fill ? 'w-full h-full' : ''} bg-gray-900/10 overflow-hidden`}>
            {isLoading && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-white/[0.02] via-white/[0.05] to-white/[0.02] z-10"></div>
            )}
            {fill ? (
                <Image
                    {...imageProps}
                    src={imgSrc || fallbackSrc}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: props.style?.objectFit || 'cover' }}
                />
            ) : (
                <Image
                    {...imageProps}
                    src={imgSrc || fallbackSrc}
                    width={width}
                    height={height}
                />
            )}
        </div>
    );
}
