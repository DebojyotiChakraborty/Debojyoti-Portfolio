"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useMemo } from "react";

interface BlurFadeTextProps {
  text: string;
  className?: string;
  variant?: {
    hidden: { y: number };
    visible: { y: number };
  };
  duration?: number;
  characterDelay?: number;
  delay?: number;
  yOffset?: number;
  animateByCharacter?: boolean;
}
const BlurFadeText = ({
  text,
  className,
  variant,
  characterDelay = 0.03,
  delay = 0,
  yOffset = 8,
  animateByCharacter = false,
}: BlurFadeTextProps) => {
  const defaultVariants: Variants = {
    hidden: { y: yOffset, opacity: 0, filter: "blur(8px)" },
    visible: { y: -yOffset, opacity: 1, filter: "blur(0px)" },
  };
  const combinedVariants = variant || defaultVariants;
  const characters = useMemo(() => Array.from(text), [text]);

  if (animateByCharacter) {
    return (
      <div className="flex">
        <AnimatePresence>
          {characters.map((char, i) => (
            <motion.span
              key={i}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={combinedVariants}
              transition={{
                delay: delay + i * characterDelay,
                ease: "easeOut",
              }}
              className={cn("inline-block", className)}
              style={{ width: char.trim() === "" ? "0.2em" : "auto" }}
            >
              {/\p{Extended_Pictographic}/u.test(char) ? (
                <span className={cn(
                  "inline-block align-middle",
                  char === "👋" ? "origin-[70%_70%] animate-wave" : ""
                )}>{char}</span>
              ) : (
                char
              )}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex">
      <AnimatePresence>
        <motion.span
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={combinedVariants}
          transition={{
            delay,
            ease: "easeOut",
          }}
          className={cn("inline-block", className)}
        >
          {text.split(/(\p{Extended_Pictographic})/u).map((part, i) => (
            /\p{Extended_Pictographic}/u.test(part) ? (
              <span key={i} className={cn(
                "inline-block align-middle",
                part === "👋" ? "origin-[70%_70%] animate-wave" : ""
              )}>{part}</span>
            ) : (
              <span key={i}>{part}</span>
            )
          ))}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default BlurFadeText;
