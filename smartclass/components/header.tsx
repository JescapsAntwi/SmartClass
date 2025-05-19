"use client"
import { ThemeToggle } from "@/components/theme-toggle"
import { Home, BarChart } from "lucide-react"
import { useRouter } from "next/navigation"
import { XpProgress } from "@/components/gamification/xp-progress"
import { StreakCounter } from "@/components/gamification/streak-counter"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { getUserProgress } from "@/lib/gamification"
import { BadgeCard } from "@/components/gamification/badge-card"

export default function Header() {
  const router = useRouter()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleHomeClick = () => {
    router.push("/grade-selection")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="container flex h-14 items-center justify-between">
        <button onClick={handleHomeClick} className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
          <Home size={20} />
          <span>SmartClass</span>
        </button>

        <div className="flex items-center gap-4">
          <StreakCounter />

          <div className="w-48">
            <XpProgress />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <BarChart size={18} />
                <span className="sr-only">Progress</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Your Progress</SheetTitle>
                <SheetDescription>Track your learning journey and achievements</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Badges</h3>
                  <div className="space-y-3">
                    {getUserProgress().badges.map((badge) => (
                      <BadgeCard key={badge.id} badge={badge} />
                    ))}
                    {getUserProgress().badges.length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        You haven't earned any badges yet. Keep learning to unlock achievements!
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Stats</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Lessons Completed</p>
                      <p className="text-2xl font-bold">{getUserProgress().completedLessons.length}</p>
                    </div>
                    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Quizzes Completed</p>
                      <p className="text-2xl font-bold">{getUserProgress().completedQuizzes.length}</p>
                    </div>
                    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Current Level</p>
                      <p className="text-2xl font-bold">{getUserProgress().level}</p>
                    </div>
                    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Day Streak</p>
                      <p className="text-2xl font-bold">{getUserProgress().streak}</p>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
