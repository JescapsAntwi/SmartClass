"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, CheckCircle, XCircle } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface QuizCardProps {
  question: {
    question: string
    options: string[]
    correctAnswer: string
    explanation: string
  }
  selectedAnswer: string
  isCorrect?: boolean
  onAnswerSelect?: (answer: string) => void
  onNext: () => void
  totalQuestions: number
  currentQuestion: number
  isReview: boolean
}

export default function QuizCard({
  question,
  selectedAnswer,
  isCorrect,
  onAnswerSelect,
  onNext,
  totalQuestions,
  currentQuestion,
  isReview,
}: QuizCardProps) {
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
              style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
            ></div>
          </div>

          {/* Content */}
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-8 dark:text-white">{question.question}</h2>

            {isReview ? (
              <div className="space-y-4 mb-8">
                {question.options.map((option, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      option === question.correctAnswer
                        ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/30"
                        : option === selectedAnswer && option !== question.correctAnswer
                          ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30"
                          : "border-gray-200 dark:border-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {option === question.correctAnswer ? (
                        <CheckCircle size={18} className="text-green-600 dark:text-green-500 flex-shrink-0" />
                      ) : option === selectedAnswer && option !== question.correctAnswer ? (
                        <XCircle size={18} className="text-red-600 dark:text-red-500 flex-shrink-0" />
                      ) : null}
                      <span className="dark:text-white">{option}</span>
                    </div>
                  </div>
                ))}

                <div className="mt-8 p-5 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-lg">
                  <h3 className="font-bold text-blue-800 dark:text-blue-400 mb-2">Explanation</h3>
                  <p className="text-gray-700 dark:text-gray-300">{question.explanation}</p>
                </div>
              </div>
            ) : (
              <RadioGroup value={selectedAnswer} onValueChange={onAnswerSelect} className="mb-8">
                <div className="space-y-4">
                  {question.options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 border border-gray-200 dark:border-gray-800 p-4 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                    >
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="text-base cursor-pointer flex-1 dark:text-white">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}

            <div className="flex justify-between items-center mt-8">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Question {currentQuestion} of {totalQuestions}
              </div>

              <Button
                onClick={onNext}
                disabled={!isReview && !selectedAnswer}
                className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-black text-white px-6 py-2 rounded-full flex items-center gap-1"
              >
                {isReview ? "Continue" : "Submit"} <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
