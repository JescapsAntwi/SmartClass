"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Home, ArrowRight, Award } from "lucide-react"
import confetti from "canvas-confetti"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { awardXP } from "@/lib/gamification"

interface CompletionScreenProps {
  topicTitle: string
  onNextTopic: () => void
  onGoHome: () => void
}

export default function CompletionScreen({ topicTitle, onNextTopic, onGoHome }: CompletionScreenProps) {
  const router = useRouter()

  useEffect(() => {
    // Trigger confetti animation
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Award XP for completing the entire topic
    awardXP(100)
  }, [])

  const handleGoHome = () => {
    router.push("/grade-selection")
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="mb-12">
            <div className="inline-block p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-6">
              <Award size={64} className="text-yellow-600 dark:text-yellow-500" />
            </div>
            <h1 className="text-4xl font-bold mb-4 dark:text-white">Congratulations!</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
              You've completed the <span className="font-semibold">{topicTitle}</span> topic.
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              You've mastered the content, quizzes, and exam practice for this topic. Keep up the great work!
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-12">
            <h2 className="text-xl font-bold mb-6 dark:text-white">Your Learning Achievements</h2>

            <div className="grid grid-cols-2 gap-6 mb-4">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-5 rounded-lg">
                <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-1">Content Mastered</h3>
                <p className="text-3xl font-bold text-blue-800 dark:text-blue-300">100%</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/30 p-5 rounded-lg">
                <h3 className="font-bold text-green-700 dark:text-green-400 mb-1">Quiz Score</h3>
                <p className="text-3xl font-bold text-green-800 dark:text-green-300">85%</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/30 p-5 rounded-lg">
                <h3 className="font-bold text-purple-700 dark:text-purple-400 mb-1">Exam Practice</h3>
                <p className="text-3xl font-bold text-purple-800 dark:text-purple-300">90%</p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/30 p-5 rounded-lg">
                <h3 className="font-bold text-yellow-700 dark:text-yellow-400 mb-1">Time Spent</h3>
                <p className="text-3xl font-bold text-yellow-800 dark:text-yellow-300">45 min</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onNextTopic}
              className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-black text-white px-8 py-4 rounded-full text-lg flex items-center gap-2"
            >
              Next Topic <ArrowRight size={18} />
            </Button>
            <Button
              onClick={handleGoHome}
              variant="outline"
              className="text-lg px-8 py-4 rounded-full border-2 border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 flex items-center gap-2 dark:text-white"
            >
              <Home size={18} /> Home
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
