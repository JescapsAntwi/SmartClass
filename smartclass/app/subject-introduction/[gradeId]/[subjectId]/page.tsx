"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { subjects } from "@/data/subjects"
import { grades } from "@/data/grades"
import { Play, BookmarkPlus, ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function SubjectIntroductionPage({
  params,
}: {
  params: { gradeId: string; subjectId: string }
}) {
  const router = useRouter()
  const { gradeId, subjectId } = params
  const [activeTab, setActiveTab] = useState("lessons")

  const subject = subjects.find((s) => s.id === subjectId)
  const grade = grades.find((g) => g.id === gradeId)

  const handleStartClass = () => {
    router.push(`/topics/${gradeId}/${subjectId}`)
  }

  const handleBack = () => {
    router.push(`/subject-selection/${gradeId}`)
  }

  // Get subject description or a default one
  const getSubjectDescription = () => {
    switch (subjectId) {
      case "mathematics":
        return "Explore numbers, patterns, and problem-solving techniques that form the foundation of mathematical thinking."
      case "english":
        return "Develop reading, writing, and communication skills through engaging with diverse texts and creative expression."
      case "science":
        return "Discover the natural world through observation, experimentation, and understanding scientific principles."
      case "social-studies":
        return "Understand societies, cultures, and human interactions across time and geography."
      case "coding":
        return "Learn programming fundamentals and computational thinking through hands-on coding exercises."
      case "maps":
        return "Explore geography, cartography, and spatial relationships through interactive map experiences."
      default:
        return subject?.description || "Explore this subject through interactive lessons and engaging content."
    }
  }

  // Get subject image based on subject ID
  const getSubjectImage = () => {
    return `/placeholder.svg?height=400&width=600&text=${subject?.name || "Subject"}`
  }

  return (
    <div className="min-h-screen bg-black dark:bg-black text-white">
      {/* Back button and theme toggle */}
      <div className="absolute top-4 left-4 z-50">
        <button onClick={handleBack} className="flex items-center text-white/80 hover:text-white">
          <ArrowLeft size={20} className="mr-2" />
          <span>Back</span>
        </button>
      </div>
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="relative">
        {/* Background image with overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10"></div>
        <div className="h-[70vh] bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={getSubjectImage() || "/placeholder.svg"}
              alt={subject?.name || "Subject"}
              className="w-full h-full object-cover opacity-40"
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-20 -mt-40 px-4 pb-20 max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2 uppercase tracking-wider">{subject?.name || "Subject"}</h1>
          <div className="w-12 h-1 bg-yellow-400 mx-auto mb-4"></div>
          <p className="text-center text-gray-300 mb-8">{getSubjectDescription()}</p>

          <Button
            onClick={handleStartClass}
            className="w-full py-6 text-lg font-medium bg-yellow-400 hover:bg-yellow-500 text-black transition-colors rounded-none"
          >
            START CLASS
          </Button>

          <div className="flex justify-center mt-6 gap-8">
            <button className="flex flex-col items-center text-sm text-gray-300 hover:text-white">
              <Play size={20} className="mb-1" />
              TRAILER
            </button>
            <button className="flex flex-col items-center text-sm text-gray-300 hover:text-white">
              <BookmarkPlus size={20} className="mb-1" />
              MY LIST
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-10 border-b border-gray-800">
            <div className="flex">
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "lessons" ? "text-yellow-400 border-b-2 border-yellow-400" : "text-gray-400"
                }`}
                onClick={() => setActiveTab("lessons")}
              >
                LESSONS
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "overview" ? "text-yellow-400 border-b-2 border-yellow-400" : "text-gray-400"
                }`}
                onClick={() => setActiveTab("overview")}
              >
                OVERVIEW
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "resources" ? "text-yellow-400 border-b-2 border-yellow-400" : "text-gray-400"
                }`}
                onClick={() => setActiveTab("resources")}
              >
                CLASS RESOURCES
              </button>
            </div>
          </div>

          {/* Tab content */}
          <div className="mt-6">
            {activeTab === "lessons" && (
              <div className="space-y-4">
                <p className="text-gray-300">
                  This class includes multiple lessons covering key concepts and practical applications in{" "}
                  {subject?.name || "this subject"}.
                </p>
                <Button
                  onClick={handleStartClass}
                  className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-black transition-colors rounded-none"
                >
                  Start Learning
                </Button>
              </div>
            )}
            {activeTab === "overview" && (
              <div className="space-y-4">
                <p className="text-gray-300">
                  {subject?.name || "This subject"} provides a comprehensive foundation for students in{" "}
                  {grade?.name || "this grade"}. Through interactive lessons and engaging content, students will develop
                  essential skills and knowledge.
                </p>
              </div>
            )}
            {activeTab === "resources" && (
              <div className="space-y-4">
                <p className="text-gray-300">
                  Additional resources including practice exercises, reference materials, and supplementary content are
                  available to enhance your learning experience.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
