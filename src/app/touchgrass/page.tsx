"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamic import to avoid SSR issues with Three.js
const GrassField = dynamic(() => import("@/components/touchgrass/GrassField"), {
    ssr: false,
    loading: () => (
        <div className="fixed inset-0 bg-gradient-to-b from-sky-300 via-sky-400 to-sky-500 flex items-center justify-center">
            <div className="text-white/80 text-lg font-medium animate-pulse">
                Loading grass field...
            </div>
        </div>
    ),
});

export default function TouchGrassPage() {
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        // Detect touch capability
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden bg-sky-300">
            {/* Grass field canvas */}
            <GrassField />

            {/* Instructions overlay - responsive */}
            <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 text-white/70 text-xs sm:text-sm font-medium pointer-events-none select-none max-w-[90vw]">
                <span className="bg-black/20 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full block text-center">
                    {isTouchDevice
                        ? "Tap and drag to touch the grass 🌿"
                        : "Move cursor to rustle • Click and drag to touch grass"
                    }
                </span>
            </div>

            {/* Back button - responsive */}
            <a
                href="/"
                className="absolute top-4 left-4 sm:top-6 sm:left-6 text-white/80 hover:text-white text-xs sm:text-sm font-medium bg-black/20 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full transition-colors active:scale-95"
            >
                ← Back
            </a>
        </div>
    );
}
