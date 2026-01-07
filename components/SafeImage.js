"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * A Client Component for safe image rendering with fallback.
 * Solves the "Event handlers cannot be passed to Client Component props" error
 * by encapsulating interactive logic here.
 */
export default function SafeImage({
    src,
    alt,
    fallbackSrc = "/fallback-image.jpg",
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

    const handleError = () => {
        if (!hasError) {
            setImgSrc(fallbackSrc);
            setHasError(true);
        }
    };

    // If fill is true, Next.js Image requires absolute positioning and doesn't want width/height
    const imageProps = fill
        ? { fill, priority, quality, className, alt, ...props }
        : { width, height, priority, quality, className, alt, ...props };

    return (
        <Image
            {...imageProps}
            src={imgSrc || fallbackSrc}
            onError={handleError}
            unoptimized={imgSrc?.startsWith('http')} // Unsplash etc might need this if loader not configured
        />
    );
}
