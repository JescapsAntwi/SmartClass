"use client"

import { useState, useEffect } from "react"
import { Flame } from "lucide-react"
import { getUserProgress } from "@/lib/gamification"

export function StreakCounter() {
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    const userProgress = getUserProgress()
    setStreak(userProgress.streak)
  }, [])

  return (
    <div className="flex items-center gap-1.5">
      <Flame size={16} className="text-orange-500" />
      <span className="text-sm font-medium">{streak} day streak</span>
    </div>
  )
}
