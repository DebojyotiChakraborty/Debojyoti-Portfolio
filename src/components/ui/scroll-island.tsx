"use client"

import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface Section {
  id: string
  title: string
}

interface ScrollIslandProps {
  sections: Section[]
  isDarkMode?: boolean
  activeSection: string
  progress: number
  onSectionClick: (id: string) => void
}

export default function ScrollIsland({
  sections,
  isDarkMode = true,
  activeSection,
  progress,
  onSectionClick
}: ScrollIslandProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const containerVariants = {
    collapsed: {
      width: 190,
      height: 40,
      borderRadius: 24,
      padding: 0,
      transition: {
        type: "spring",
        bounce: 0.35,
        duration: 0.6,
        mass: 1.1,
        stiffness: 400,
        damping: 35
      }
    },
    expanded: {
      width: 300,
      height: 300,
      borderRadius: 28,
      padding: 12,
      transition: {
        type: "spring",
        bounce: 0.35,
        duration: 0.6,
        mass: 1.1,
        stiffness: 300,
        damping: 25
      }
    }
  }

  const contentVariants = {
    collapsed: {
      opacity: 0,
      filter: "blur(16px)",
      height: 0,
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    },
    expanded: {
      opacity: 1,
      filter: "blur(0px)",
      height: "auto",
      transition: {
        duration: 0.45,
        ease: [0.5, 0, 0.4, 1]
      }
    }
  }

  const backdropVariants = {
    hidden: {
      opacity: 0,
      backdropFilter: "blur(0px)",
      WebkitBackdropFilter: "blur(0px)",
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    visible: {
      opacity: 1,
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  const handleSectionClick = (id: string) => {
    onSectionClick(id)
    setIsExpanded(false)
  }

  return (
    <>
      {/* Backdrop blur when expanded */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={cn(
              "fixed inset-0 z-40",
              isDarkMode ? "bg-black/20" : "bg-white/20"
            )}
            style={{
              willChange: "backdrop-filter",
              backfaceVisibility: "hidden"
            }}
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* Floating pill container */}
      <div className="fixed top-12 left-0 right-0 flex justify-center z-50">
        <motion.div
          variants={containerVariants}
          initial="collapsed"
          animate={isExpanded ? "expanded" : "collapsed"}
          className={cn(
            "overflow-hidden shadow-lg will-change-transform",
            isDarkMode ? "bg-white text-black" : "bg-black text-white"
          )}
        >
          <div className="relative">
            {/* Header */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full px-1.5 h-10 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                {/* Circular progress */}
                <div className="w-6 h-6 relative">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      className="opacity-30"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${(progress / 100) * 62.83} 62.83`}
                      className="transition-all duration-300"
                    />
                  </svg>
                </div>
                <span className="font-bold">Index</span>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </div>
              <div className={cn(
                "px-4 py-1 rounded-full text-sm font-medium",
                isDarkMode ? "bg-gray-300" : "bg-zinc-600"
              )}>
                {progress}%
              </div>
            </button>

            {/* Expanded section links */}
            <motion.div
              variants={contentVariants}
              initial="collapsed"
              animate={isExpanded ? "expanded" : "collapsed"}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleSectionClick(section.id)}
                    className={cn(
                      "w-full text-left text-sm",
                      activeSection === section.id ? "opacity-100 font-medium" : "opacity-60 hover:opacity-100"
                    )}
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  )
} 