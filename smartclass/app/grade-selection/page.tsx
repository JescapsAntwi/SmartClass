"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { grades } from "@/data/grades"
import SubjectIcon from "@/components/subject-icon"

export default function GradeSelectionPage() {
  const router = useRouter()
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null)

  const handleGradeSelect = (gradeId: string) => {
    setSelectedGrade(gradeId)
    router.push(`/subject-selection/${gradeId}`)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="mb-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <SubjectIcon subject="all" />
            </div>
          </div>
          <div className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
            YOUR LEARNING PATH
          </div>
          <h1 className="text-3xl font-bold mb-2 dark:text-white">Select Your Grade Level</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg">
            Choose your grade to access appropriate learning materials
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {grades.map((grade) => (
            <div
              key={grade.id}
              onClick={() => handleGradeSelect(grade.id)}
              className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 cursor-pointer hover:border-yellow-400 dark:hover:border-yellow-500 transition-all duration-200"
            >
              <h2 className="text-xl font-bold mb-2 dark:text-white">{grade.name}</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{grade.description}</p>
              <div className="text-sm text-yellow-600 dark:text-yellow-500 font-medium">SELECT GRADE →</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
