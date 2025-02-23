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
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.2,
        duration: 0.5,
        mass: 0.8,
        stiffness: 350,
        damping: 30
      }
    },
    expanded: {
      width: 300,
      height: "auto",
      borderRadius: 28,
      padding: 12,
      y: 20,
      transition: {
        type: "spring",
        bounce: 0.2,
        duration: 0.5,
        mass: 0.8,
        stiffness: 350,
        damping: 30
      }
    }
  }

  const contentVariants = {
    collapsed: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.15,
        ease: "easeOut"
      }
    },
    expanded: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.25,
        ease: "easeOut",
        delay: 0.1
      }
    }
  }

  const backdropVariants = {
    hidden: {
      opacity: 0,
      backdropFilter: "blur(0px)",
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    visible: {
      opacity: 1,
      backdropFilter: "blur(8px)",
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
              "fixed inset-0",
              isDarkMode ? "bg-black/20" : "bg-white/20"
            )}
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
            isDarkMode 
              ? "bg-white text-black" 
              : "bg-black text-white"
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
                "px-3 py-0.5 rounded-full text-sm font-medium",
                isDarkMode ? "bg-black/10" : "bg-white/10"
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
                      "w-full px-3 py-2 text-left text-sm rounded-lg transition-colors",
                      activeSection === section.id 
                        ? isDarkMode 
                          ? "bg-black/10 font-medium" 
                          : "bg-white/10 font-medium"
                        : "hover:bg-black/5 dark:hover:bg-white/5"
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