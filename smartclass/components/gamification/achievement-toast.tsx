"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Award, X } from "lucide-react"

interface AchievementToastProps {
  title: string
  description: string
  xp?: number
  onClose: () => void
}

export function AchievementToast({ title, description, xp, onClose }: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Allow animation to complete
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed bottom-4 right-4 z-50 max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="flex p-4">
            <div className="flex-shrink-0 mr-4">
              <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
              {xp && <p className="text-sm font-medium text-yellow-600 dark:text-yellow-500 mt-1">+{xp} XP</p>}
            </div>
            <button onClick={() => setIsVisible(false)} className="flex-shrink-0 ml-2">
              <X className="h-5 w-5 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400" />
            </button>
          </div>
          <div className="h-1 bg-yellow-500 animate-pulse" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
