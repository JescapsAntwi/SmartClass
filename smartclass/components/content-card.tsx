"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

interface ContentCardProps {
  content: {
    title: string
    body: string
    image?: string
  }
  onNext: () => void
  totalCards: number
  currentCard: number
}

export default function ContentCard({ content, onNext, totalCards, currentCard }: ContentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl"
    >
      <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardContent className="p-0">
          {/* Progress bar */}
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-1">
            <div
              className="bg-yellow-400 dark:bg-yellow-500 h-1"
              style={{ width: `${(currentCard / totalCards) * 100}%` }}
            ></div>
          </div>

          {/* Content */}
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">{content.title}</h2>

            <div
              className="prose dark:prose-invert max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: content.body }}
            />

            {content.image && (
              <div className="mt-6 mb-8 flex justify-center">
                <img
                  src={content.image || "/placeholder.svg?height=300&width=500"}
                  alt={content.title}
                  className="rounded-md max-h-64 object-contain"
                />
              </div>
            )}

            <div className="flex justify-between items-center mt-8">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {currentCard} of {totalCards}
              </div>

              <Button
                onClick={onNext}
                className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-black text-white px-6 py-2 rounded-full flex items-center gap-1"
              >
                Continue <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
