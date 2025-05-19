"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ContentCard from "@/components/content-card"
import QuizCard from "@/components/quiz-card"
import { grades } from "@/data/grades"
import { subjects } from "@/data/subjects"
import { topics, getContentForSubtopic, getQuizForTopic } from "@/data/topics"
import CompletionScreen from "@/components/completion-screen"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import SubjectIcon from "@/components/subject-icon"
import { completeLesson, completeQuiz } from "@/lib/gamification"
import { AchievementToast } from "@/components/gamification/achievement-toast"

type ContentState =
  | "intro"
  | "content"
  | "thank-you"
  | "main-quiz"
  | "main-quiz-review"
  | "exam-practice"
  | "exam-review"
  | "completion"

export default function ContentPage({
  params,
}: {
  params: { gradeId: string; subjectId: string; topicId: string; subtopicId: string }
}) {
  const router = useRouter()
  const { gradeId, subjectId, topicId, subtopicId } = params

  const [contentState, setContentState] = useState<ContentState>("intro")
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({})
  const [quizResults, setQuizResults] = useState<Record<number, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)

  const [showAchievement, setShowAchievement] = useState(false)
  const [achievementData, setAchievementData] = useState({ title: "", description: "", xp: 0 })

  const grade = grades.find((g) => g.id === gradeId)
  const subject = subjects.find((s) => s.id === subjectId)
  const topic = topics.find((t) => t.id === topicId)
  const subtopic = topic?.subtopics.find((s) => s.id === subtopicId)

  const content = getContentForSubtopic(subtopicId)
  const mainQuiz = getQuizForTopic(topicId, "main")
  const examQuiz = getQuizForTopic(topicId, "exam")

  useEffect(() => {
    // Reset state when navigating to a new subtopic
    setContentState("intro")
    setCurrentCardIndex(0)
    setQuizAnswers({})
    setQuizResults({})
    setIsLoading(false)
  }, [subtopicId])

  useEffect(() => {
    if (contentState === "thank-you") {
      // Mark lesson as completed
      completeLesson(`${topicId}-${subtopicId}`)

      // Show achievement toast
      setAchievementData({
        title: "Lesson Completed!",
        description: `You've completed ${subtopic?.title || "this lesson"}`,
        xp: 20,
      })
      setShowAchievement(true)
    } else if (contentState === "main-quiz-review") {
      // Calculate score
      const correctAnswers = Object.values(quizResults).filter((result) => result).length
      const totalQuestions = mainQuiz.length
      const score = Math.round((correctAnswers / totalQuestions) * 100)

      // Mark quiz as completed
      completeQuiz(`${topicId}-${subtopicId}-quiz`, score)

      // Show achievement toast
      setAchievementData({
        title: "Quiz Completed!",
        description: `You scored ${score}% on this quiz`,
        xp: Math.round(30 * (score / 100)),
      })
      setShowAchievement(true)
    }
  }, [contentState, topicId, subtopicId, quizResults, mainQuiz, subtopic?.title])

  // Introduction and thank you content
  const introContent = [
    {
      title: `Introduction to ${topic?.title || "Topic"}`,
      body: `<p>Welcome to this lesson on ${topic?.title || "this topic"}!</p>
             <p>In this module, you will learn about:</p>
             <ul class="list-disc pl-6 my-4 space-y-2">
               <li>${topic?.description || "Various concepts related to this topic"}</li>
               <li>Key principles and applications</li>
               <li>Practical examples and exercises</li>
             </ul>
             <p>Let's get started with our first subtopic: <strong>${subtopic?.title || "Subtopic"}</strong></p>`,
    },
  ]

  const thankYouContent = [
    {
      title: `Thank You for Completing ${subtopic?.title || "This Subtopic"}`,
      body: `<p>Congratulations on completing this subtopic!</p>
             <p>You've learned about:</p>
             <ul class="list-disc pl-6 my-4 space-y-2">
               <li>${subtopic?.description || "Key concepts in this subtopic"}</li>
               <li>Important principles and applications</li>
               <li>Practical examples and exercises</li>
             </ul>
             <p>Now it's time to test your knowledge with a quiz!</p>`,
    },
  ]

  // Determine the current content based on state
  const currentContent = (() => {
    switch (contentState) {
      case "intro":
        return introContent
      case "content":
        return content
      case "thank-you":
        return thankYouContent
      case "main-quiz":
      case "main-quiz-review":
        return mainQuiz
      case "exam-practice":
      case "exam-review":
        return examQuiz
      default:
        return []
    }
  })()

  const handleNextCard = () => {
    if (currentCardIndex < currentContent.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
    } else {
      // Transition to next state based on current state
      switch (contentState) {
        case "intro":
          setContentState("content")
          setCurrentCardIndex(0)
          break
        case "content":
          setContentState("thank-you")
          setCurrentCardIndex(0)
          break
        case "thank-you":
          // After thank you, go directly to main quiz
          setContentState("main-quiz")
          setCurrentCardIndex(0)
          setQuizAnswers({})
          break
        case "main-quiz":
          evaluateQuiz(mainQuiz)
          setContentState("main-quiz-review")
          setCurrentCardIndex(0)
          break
        case "main-quiz-review":
          setContentState("exam-practice")
          setCurrentCardIndex(0)
          setQuizAnswers({})
          break
        case "exam-practice":
          evaluateQuiz(examQuiz)
          setContentState("exam-review")
          setCurrentCardIndex(0)
          break
        case "exam-review":
          setContentState("completion")
          break
      }
    }
  }

  const evaluateQuiz = (quiz: any[]) => {
    const results: Record<number, boolean> = {}
    quiz.forEach((question, index) => {
      results[index] = quizAnswers[index] === question.correctAnswer
    })
    setQuizResults(results)
  }

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionIndex]: answer,
    })
  }

  const handleNextTopic = () => {
    // Find the next topic in the sequence
    const currentTopicIndex = topics.findIndex((t) => t.id === topicId)
    if (currentTopicIndex < topics.length - 1) {
      const nextTopic = topics[currentTopicIndex + 1]
      if (nextTopic && nextTopic.subtopics.length > 0) {
        router.push(`/content/${gradeId}/${subjectId}/${nextTopic.id}/${nextTopic.subtopics[0].id}`)
      }
    }
  }

  const handleGoHome = () => {
    router.push("/grade-selection")
  }

  const handleBack = () => {
    router.push(`/topics/${gradeId}/${subjectId}`)
  }

  // Special handling for coding and maps modules
  useEffect(() => {
    if (subjectId === "coding") {
      router.push(`/coding/${gradeId}/${topicId}/${subtopicId}`)
    } else if (subjectId === "maps") {
      router.push(`/maps/${gradeId}/${topicId}/${subtopicId}`)
    }
  }, [subjectId, gradeId, topicId, subtopicId, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-xl dark:text-white">Loading content...</div>
      </div>
    )
  }

  if (contentState === "completion") {
    return <CompletionScreen topicTitle={topic?.title || ""} onNextTopic={handleNextTopic} onGoHome={handleGoHome} />
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span>Back to Topics</span>
        </button>

        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-4">
            <SubjectIcon subject={subjectId} />
          </div>
          <div className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
            {topic?.title || "Topic"}
          </div>
          <h1 className="text-2xl font-bold mb-2 dark:text-white">
            {(() => {
              switch (contentState) {
                case "intro":
                  return "Introduction"
                case "content":
                  return subtopic?.title || "Learning Content"
                case "thank-you":
                  return "Thank You"
                case "main-quiz":
                  return "Main Quiz"
                case "main-quiz-review":
                  return "Quiz Review"
                case "exam-practice":
                  return "Exam Practice"
                case "exam-review":
                  return "Exam Review"
                default:
                  return "Learning Content"
              }
            })()}
          </h1>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${contentState}-${currentCardIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center"
          >
            {currentContent[currentCardIndex] &&
              (["intro", "content", "thank-you"].includes(contentState) ? (
                <ContentCard
                  content={currentContent[currentCardIndex]}
                  onNext={handleNextCard}
                  totalCards={currentContent.length}
                  currentCard={currentCardIndex + 1}
                />
              ) : ["main-quiz", "exam-practice"].includes(contentState) ? (
                <QuizCard
                  question={currentContent[currentCardIndex]}
                  selectedAnswer={quizAnswers[currentCardIndex] || ""}
                  onAnswerSelect={(answer) => handleAnswerSelect(currentCardIndex, answer)}
                  onNext={handleNextCard}
                  totalQuestions={currentContent.length}
                  currentQuestion={currentCardIndex + 1}
                  isReview={false}
                />
              ) : (
                <QuizCard
                  question={currentContent[currentCardIndex]}
                  selectedAnswer={quizAnswers[currentCardIndex] || ""}
                  isCorrect={quizResults[currentCardIndex]}
                  onNext={handleNextCard}
                  totalQuestions={currentContent.length}
                  currentQuestion={currentCardIndex + 1}
                  isReview={true}
                />
              ))}
          </motion.div>
        </AnimatePresence>
        {showAchievement && (
          <AchievementToast
            title={achievementData.title}
            description={achievementData.description}
            xp={achievementData.xp}
            onClose={() => setShowAchievement(false)}
          />
        )}
      </div>
    </div>
  )
}
