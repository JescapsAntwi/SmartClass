"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import SubjectIcon from "@/components/subject-icon"

interface SubjectCardProps {
  subject: {
    id: string
    name: string
    description: string
    icon: string
  }
  onSelect: () => void
}

export default function SubjectCard({ subject, onSelect }: SubjectCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
      <Card
        className="overflow-hidden border border-gray-200 hover:border-yellow-400 transition-all duration-200 cursor-pointer"
        onClick={onSelect}
      >
        <CardContent className="p-6 flex flex-col items-center">
          <div className="mb-3">
            <SubjectIcon subject={subject.id} />
          </div>
          <h3 className="text-lg font-bold mb-2">{subject.name}</h3>
          <p className="text-gray-600 text-sm text-center mb-4">{subject.description}</p>
          <div className="text-sm text-yellow-600 font-medium">SELECT SUBJECT →</div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
