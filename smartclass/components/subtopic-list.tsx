"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, CheckCircle } from "lucide-react"

interface SubtopicListProps {
  subtopics: Array<{
    id: string
    title: string
    description: string
    completed?: boolean
  }>
  onSelect: (subtopicId: string) => void
}

export default function SubtopicList({ subtopics, onSelect }: SubtopicListProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
      <h3 className="text-lg font-bold text-gray-700 ml-2 mb-3">Subtopics</h3>

      {subtopics.map((subtopic) => (
        <motion.div key={subtopic.id} variants={item}>
          <Card
            className="overflow-hidden border border-gray-200 hover:border-yellow-400 transition-all duration-200 cursor-pointer"
            onClick={() => onSelect(subtopic.id)}
          >
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {subtopic.completed && <CheckCircle size={16} className="text-green-500" />}
                    <h4 className="font-bold">{subtopic.title}</h4>
                  </div>
                  <p className="text-gray-600 text-sm">{subtopic.description}</p>
                </div>

                <ChevronRight size={18} className="text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
