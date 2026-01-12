"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageMagnifierProps {
    src: string;
    alt: string;
    width: number;
    height: number;
    magnifierSize?: number;
    zoomLevel?: number;
    className?: string;
}

export function ImageMagnifier({
    src,
    alt,
    width,
    height,
    magnifierSize = 150,
    zoomLevel = 2.5,
    className,
}: ImageMagnifierProps) {
    const [showMagnifier, setShowMagnifier] = useState(false);
    const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();

            // Calculate position relative to the container
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            setCursorPosition({ x, y });
            setMagnifierPosition({ x, y });
        },
        []
    );

    const handleMouseEnter = useCallback(() => {
        setShowMagnifier(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setShowMagnifier(false);
    }, []);

    return (
        <div
            ref={containerRef}
            className={cn("relative overflow-hidden cursor-zoom-in", className)}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className="w-full h-auto object-cover transition-transform duration-300"
            />

            {/* Magnifier glass */}
            {showMagnifier && (
                <div
                    className="absolute pointer-events-none rounded-full border-2 border-white/50 shadow-2xl"
                    style={{
                        width: magnifierSize,
                        height: magnifierSize,
                        left: cursorPosition.x - magnifierSize / 2,
                        top: cursorPosition.y - magnifierSize / 2,
                        backgroundImage: `url(${src})`,
                        backgroundSize: `${containerRef.current ? containerRef.current.offsetWidth * zoomLevel : width * zoomLevel}px ${containerRef.current ? containerRef.current.offsetHeight * zoomLevel : height * zoomLevel}px`,
                        backgroundPosition: `-${magnifierPosition.x * zoomLevel - magnifierSize / 2}px -${magnifierPosition.y * zoomLevel - magnifierSize / 2}px`,
                        backgroundRepeat: "no-repeat",
                        boxShadow: `
              0 0 0 3px rgba(255, 255, 255, 0.3),
              0 8px 32px rgba(0, 0, 0, 0.3),
              inset 0 0 20px rgba(255, 255, 255, 0.1)
            `,
                        backdropFilter: "blur(1px)",
                    }}
                />
            )}

            {/* Subtle overlay to indicate interactivity */}
            <div
                className={cn(
                    "absolute inset-0 bg-black/0 transition-all duration-300",
                    showMagnifier && "bg-black/5"
                )}
            />
        </div>
    );
}
