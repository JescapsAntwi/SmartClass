"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

interface LevelCardProps {
  level: number
  title: string
  description: string
  isRecommended?: boolean
  isActive?: boolean
  onClick: () => void
}

export default function LevelCard({
  level,
  title,
  description,
  isRecommended = false,
  isActive = false,
  onClick,
}: LevelCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`${isActive ? "" : "opacity-80"}`}
    >
      <Card
        className={`h-full cursor-pointer overflow-hidden border transition-all duration-200 ${
          isActive
            ? "border-yellow-400 dark:border-yellow-500 hover:border-yellow-500 dark:hover:border-yellow-600"
            : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
        }`}
        onClick={onClick}
      >
        <div className="p-6 flex flex-col items-center text-center h-full">
          <div className="mb-2">
            <div className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">LEVEL {level}</div>
            {isRecommended && (
              <div className="text-xs uppercase text-yellow-600 dark:text-yellow-500 font-medium mt-1">RECOMMENDED</div>
            )}
          </div>

          <h3 className="text-xl font-bold mb-3 dark:text-white">{title}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
        </div>
      </Card>
    </motion.div>
  )
}
