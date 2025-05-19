"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Plus } from "lucide-react"

interface TopicCardProps {
  topic: {
    id: string
    title: string
    description: string
    progress?: number
    subtopics: Array<{
      id: string
      title: string
      description: string
    }>
  }
  onExpand: () => void
  onExpandSubtopics: () => void
}

export default function TopicCard({ topic, onExpand, onExpandSubtopics }: TopicCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
      <Card
        className="overflow-hidden border border-gray-200 hover:border-yellow-400 transition-all duration-200 cursor-pointer"
        onClick={onExpand}
      >
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-6">
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1">{topic.title}</h3>
              <p className="text-gray-600 text-sm">{topic.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="rounded-full p-2 hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation()
                  onExpandSubtopics()
                }}
              >
                <Plus size={18} className="text-gray-500" />
              </button>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
