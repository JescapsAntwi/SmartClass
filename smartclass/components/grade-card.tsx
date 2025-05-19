"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Users, Award } from "lucide-react"

interface GradeCardProps {
  grade: {
    id: string
    name: string
    description: string
    icon: string
  }
  onSelect: () => void
}

export default function GradeCard({ grade, onSelect }: GradeCardProps) {
  const getIcon = () => {
    switch (grade.icon) {
      case "book":
        return <BookOpen size={24} className="text-gray-700" />
      case "users":
        return <Users size={24} className="text-gray-700" />
      case "award":
        return <Award size={24} className="text-gray-700" />
      default:
        return <BookOpen size={24} className="text-gray-700" />
    }
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
      <Card
        className="overflow-hidden border border-gray-200 hover:border-yellow-400 transition-all duration-200 cursor-pointer"
        onClick={onSelect}
      >
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            {getIcon()}
            <h3 className="text-xl font-bold">{grade.name}</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">{grade.description}</p>
          <div className="text-sm text-yellow-600 font-medium">SELECT GRADE →</div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
