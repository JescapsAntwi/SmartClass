"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { getUserProgress, calculateXpForNextLevel } from "@/lib/gamification"

export function XpProgress() {
  const [xpInfo, setXpInfo] = useState({ current: 0, next: 100, progress: 0, level: 1, totalXp: 0 })

  useEffect(() => {
    const userProgress = getUserProgress()
    const xpForNextLevel = calculateXpForNextLevel(userProgress.xp)

    setXpInfo({
      current: xpForNextLevel.current,
      next: xpForNextLevel.next,
      progress: xpForNextLevel.progress,
      level: userProgress.level,
      totalXp: userProgress.xp,
    })
  }, [])

  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0 w-8 h-8 bg-yellow-400 dark:bg-yellow-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
        {xpInfo.level}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500 dark:text-gray-400">{xpInfo.current} XP</span>
          <span className="text-gray-500 dark:text-gray-400">{xpInfo.next} XP</span>
        </div>
        <Progress value={xpInfo.progress} className="h-2" />
      </div>
    </div>
  )
}
