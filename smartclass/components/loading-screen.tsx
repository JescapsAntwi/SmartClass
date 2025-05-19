"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface LoadingScreenProps {
  progress: number
}

export default function LoadingScreen({ progress }: LoadingScreenProps) {
  const router = useRouter()
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        setShowButton(true)
      }, 500)

      return () => clearTimeout(timeout)
    }
  }, [progress])

  const handleStart = () => {
    router.push("/grade-selection")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-white">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">SmartClass</h1>
          <p className="text-xl text-gray-600">Your Offline Learning Companion</p>
        </div>

        <div className="w-64 h-4 bg-gray-200 rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-blue-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <p className="text-gray-600 mb-8">
          {progress < 100 ? "Loading educational content..." : "Ready to start learning!"}
        </p>

        {showButton && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Button size="lg" onClick={handleStart} className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6">
              Start Learning
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
