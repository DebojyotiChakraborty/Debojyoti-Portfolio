"use client";
import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const FlipWords = ({
  words,
  duration = 3000,
  className,
}: {
  words: string[];
  duration?: number;
  className?: string;
}) => {
  const [mounted, setMounted] = useState(false);
  const [currentWord, setCurrentWord] = useState(words[0]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const startAnimation = useCallback(() => {
    const word = words[words.indexOf(currentWord) + 1] || words[0];
    setCurrentWord(word);
    setIsAnimating(true);
  }, [currentWord, words]);

  useEffect(() => {
    if (!isAnimating && mounted) {
      const timer = setTimeout(() => {
        startAnimation();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, duration, startAnimation, mounted]);

  // Function to split text while preserving emojis
  const splitTextPreservingEmojis = (text: string) => {
    // This regex will match emojis and other characters
    return text.match(/\p{Extended_Pictographic}|\S+/gu) || [];
  };

  if (!mounted) {
    return (
      <div className={cn(
        "z-10 inline-block relative text-left text-neutral-900 dark:text-neutral-100",
        className
      )}>
        {words[0]}
      </div>
    );
  }

  return (
    <div className="relative">
      <AnimatePresence mode="popLayout" onExitComplete={() => setIsAnimating(false)}>
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
            position: "absolute",
          }}
          animate={{
            opacity: 1,
            y: 0,
            position: "relative",
          }}
          exit={{
            opacity: 0,
            y: -20,
            position: "absolute",
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 1,
          }}
          className={cn(
            "z-10 inline-block text-left text-neutral-900 dark:text-neutral-100",
            className
          )}
          key={currentWord}
        >
          {splitTextPreservingEmojis(currentWord).map((part, partIndex) => (
            <motion.span
              key={`${part}-${partIndex}`}
              initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
              transition={{
                delay: partIndex * 0.1,
                duration: 0.2,
                ease: "easeOut",
              }}
              className="inline-block whitespace-nowrap mr-1"
            >
              {/\p{Extended_Pictographic}/u.test(part) ? (
                // If it's an emoji, render it as is
                <span className="inline-block text-2xl align-middle">{part}</span>
              ) : (
                // If it's text, animate each letter
                part.split("").map((letter, letterIndex) => (
                  <motion.span
                    key={`${letter}-${letterIndex}`}
                    initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
                    transition={{
                      delay: partIndex * 0.1 + letterIndex * 0.03,
                      duration: 0.15,
                      ease: "easeOut",
                    }}
                    className="inline-block"
                  >
                    {letter}
                  </motion.span>
                ))
              )}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}; 