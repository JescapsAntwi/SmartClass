"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function LoadingPage() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setShowButton(true)
          }, 500)
          return 100
        }
        return prev + 2
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  const handleStart = () => {
    router.push("/grade-selection")
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">SmartClass</h1>
          <p className="text-xl text-gray-600">Your Offline Learning Companion</p>
        </div>

        <div className="w-64 h-2 bg-gray-200 rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-yellow-400 rounded-full"
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
            <Button
              size="lg"
              onClick={handleStart}
              className="bg-black hover:bg-gray-800 text-white px-8 py-6 rounded-full text-lg"
            >
              Start Learning
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
