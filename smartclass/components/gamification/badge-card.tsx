"use client"

import type { Badge } from "@/lib/gamification"
import { Award, Brain, Trophy, Flame, Medal } from "lucide-react"

interface BadgeCardProps {
  badge: Badge
}

export function BadgeCard({ badge }: BadgeCardProps) {
  const getIcon = () => {
    switch (badge.icon) {
      case "award":
        return <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
      case "brain":
        return <Brain className="h-6 w-6 text-purple-600 dark:text-purple-500" />
      case "trophy":
        return <Trophy className="h-6 w-6 text-amber-600 dark:text-amber-500" />
      case "flame":
        return <Flame className="h-6 w-6 text-orange-600 dark:text-orange-500" />
      case "medal":
        return <Medal className="h-6 w-6 text-blue-600 dark:text-blue-500" />
      default:
        return <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
    }
  }

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-white dark:bg-gray-800">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
          {getIcon()}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">{badge.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{badge.description}</p>
        </div>
      </div>
    </div>
  )
}
