"use client"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { topics } from "@/data/topics"
import { grades } from "@/data/grades"
import { subjects } from "@/data/subjects"
import SubjectIcon from "@/components/subject-icon"
import LevelCard from "@/components/level-card"

export default function TopicsPage({
  params,
}: {
  params: { gradeId: string; subjectId: string }
}) {
  const router = useRouter()
  const { gradeId, subjectId } = params

  const grade = grades.find((g) => g.id === gradeId)
  const subject = subjects.find((s) => s.id === subjectId)

  // Group topics by level
  const topicsByLevel = topics
    .filter((topic) => topic.subjectId === subjectId)
    .reduce(
      (acc, topic, index) => {
        const level = topic.level || index + 1
        if (!acc[level]) {
          acc[level] = []
        }
        acc[level].push(topic)
        return acc
      },
      {} as Record<number, typeof topics>,
    )

  const levels = Object.keys(topicsByLevel)
    .map(Number)
    .sort((a, b) => a - b)

  const handleStartTopic = (topicId: string) => {
    const topic = topics.find((t) => t.id === topicId)
    if (topic && topic.subtopics.length > 0) {
      router.push(`/content/${gradeId}/${subjectId}/${topicId}/${topic.subtopics[0].id}`)
    }
  }

  const handleBack = () => {
    router.push(`/subject-introduction/${gradeId}/${subjectId}`)
  }

  const handleGetStarted = () => {
    // Find the first topic of the first level
    if (levels.length > 0 && topicsByLevel[levels[0]].length > 0) {
      const firstTopic = topicsByLevel[levels[0]][0]
      if (firstTopic.subtopics.length > 0) {
        router.push(`/content/${gradeId}/${subjectId}/${firstTopic.id}/${firstTopic.subtopics[0].id}`)
      }
    }
  }

  // Get subject description
  const getSubjectDescription = () => {
    switch (subjectId) {
      case "mathematics":
        return "Master key mathematical concepts and problem-solving techniques"
      case "english":
        return "Develop essential reading, writing, and communication skills"
      case "science":
        return "Master key scientific ideas & technologies of the future"
      case "social-studies":
        return "Understand societies, cultures, and human interactions"
      case "coding":
        return "Build programming skills and computational thinking"
      case "maps":
        return "Explore geography and spatial relationships"
      default:
        return `Master key concepts in ${subject?.name || "this subject"}`
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span>Back</span>
        </button>

        <div className="flex flex-col items-center text-center mb-12">
          <div className="mb-4">
            <SubjectIcon subject={subjectId} size="large" />
          </div>
          <div className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
            YOUR LEARNING PATH
          </div>
          <h1 className="text-3xl font-bold mb-2 dark:text-white">{subject?.name || "Subject"}</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg">{getSubjectDescription()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {levels.map((level, index) => {
            const levelTopics = topicsByLevel[level]
            const firstTopic = levelTopics[0]

            return (
              <LevelCard
                key={level}
                level={level}
                title={firstTopic.title}
                description={firstTopic.description}
                isRecommended={index === 0}
                isActive={index === 0}
                onClick={() => handleStartTopic(firstTopic.id)}
              />
            )
          })}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleGetStarted}
            className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-black text-white px-12 py-6 rounded-full text-lg"
          >
            Get started
          </Button>
        </div>
      </div>
    </div>
  )
}
