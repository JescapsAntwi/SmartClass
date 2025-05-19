"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { grades } from "@/data/grades"
import { subjects } from "@/data/subjects"
import { topics } from "@/data/topics"
import { pythonLessons } from "@/data/python-lessons"
import CodeEditor from "@/components/code-editor"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"
import SubjectIcon from "@/components/subject-icon"
import { completeLesson } from "@/lib/gamification"
import { AchievementToast } from "@/components/gamification/achievement-toast"

export default function CodingPage({
  params,
}: {
  params: { gradeId: string; topicId: string; subtopicId: string }
}) {
  const router = useRouter()
  const { gradeId, topicId, subtopicId } = params

  const [code, setCode] = useState("")
  const [output, setOutput] = useState("")
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showAchievement, setShowAchievement] = useState(false)
  const [waitingForInput, setWaitingForInput] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const grade = grades.find((g) => g.id === gradeId)
  const subject = subjects.find((s) => s.id === "coding")
  const topic = topics.find((t) => t.id === topicId)

  // Find the lesson index based on the subtopic ID
  useEffect(() => {
    const lessonIndex = pythonLessons.findIndex((lesson) => lesson.id === subtopicId)
    if (lessonIndex !== -1) {
      setCurrentLessonIndex(lessonIndex)
      setCode(pythonLessons[lessonIndex].startingCode)
    } else {
      setCurrentLessonIndex(0)
      setCode(pythonLessons[0].startingCode)
    }
    setIsLoading(false)
  }, [subtopicId])

  const currentLesson = pythonLessons[currentLessonIndex]

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
  }

  const handleRunCode = () => {
    setOutput("Executing code...\n")
    setWaitingForInput(false)

    // Reset input value
    setInputValue("")

    // Execute the code
    simulatePythonExecution(code, "", (result) => {
      setOutput((prev) => prev + result)
    })

    // Mark lesson as attempted when code is run
    completeLesson(`coding-${topicId}-${subtopicId}`)

    // Show achievement toast
    setShowAchievement(true)
    setTimeout(() => setShowAchievement(false), 5000)
  }

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!waitingForInput) return

    // Add the input to the output with a newline
    setOutput((prev) => `${prev}${inputValue}\n`)

    // Continue execution with the provided input
    simulatePythonExecution(code, inputValue, (result) => {
      setOutput((prev) => prev + result)
    })

    // Reset input state
    setWaitingForInput(false)
    setInputValue("")
  }

  const handleNextLesson = () => {
    if (currentLessonIndex < pythonLessons.length - 1) {
      const nextLesson = pythonLessons[currentLessonIndex + 1]
      router.push(`/coding/${gradeId}/${topicId}/${nextLesson.id}`)
    }
  }

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      const prevLesson = pythonLessons[currentLessonIndex - 1]
      router.push(`/coding/${gradeId}/${topicId}/${prevLesson.id}`)
    }
  }

  const handleBackToTopics = () => {
    router.push(`/topics/${gradeId}/coding`)
  }

  // Focus input when waiting for input
  useEffect(() => {
    if (waitingForInput && inputRef.current) {
      inputRef.current.focus()
    }
  }, [waitingForInput])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-xl dark:text-white">Loading lesson...</div>
      </div>
    )
  }

  // Simulate Python execution (in a real app, this would be done server-side)
  function simulatePythonExecution(code: string, input: string, callback: (output: string) => void) {
    try {
      // Check for input() function calls
      if (code.includes("input(") && !input) {
        setWaitingForInput(true)
        callback("Waiting for input...\n")
        return
      }

      let output = ""

      // Handle print statements
      const printRegex = /print\s*$$(.*?)$$/g
      let printMatch

      while ((printMatch = printRegex.exec(code)) !== null) {
        const content = printMatch[1].trim()

        // Handle string literals
        if ((content.startsWith('"') && content.endsWith('"')) || (content.startsWith("'") && content.endsWith("'"))) {
          output += content.substring(1, content.length - 1) + "\n"
        }
        // Handle variables (simple simulation)
        else if (content.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
          const varAssignmentRegex = new RegExp(`${content}\\s*=\\s*(.+)`)
          const varMatch = code.match(varAssignmentRegex)

          if (varMatch) {
            const varValue = varMatch[1].trim()
            if (
              (varValue.startsWith('"') && varValue.endsWith('"')) ||
              (varValue.startsWith("'") && varValue.endsWith("'"))
            ) {
              output += varValue.substring(1, varValue.length - 1) + "\n"
            } else if (!isNaN(Number(varValue))) {
              output += varValue + "\n"
            } else {
              output += "[Variable: " + content + "]\n"
            }
          } else {
            output += "[Variable: " + content + "]\n"
          }
        }
        // Handle expressions
        else {
          // Simple arithmetic
          try {
            // Replace Python-specific operations with JavaScript equivalents
            const jsExpression = content
              .replace(/\*\*/g, "Math.pow") // Replace ** with Math.pow
              .replace(/(\d+)\s*\*\*\s*(\d+)/g, "Math.pow($1, $2)")

            // Evaluate simple expressions
            if (/^[\d\s+\-*/.]+$/.test(jsExpression)) {
              const result = eval(jsExpression)
              output += result + "\n"
            } else {
              output += "[Expression: " + content + "]\n"
            }
          } catch (e) {
            output += "[Expression: " + content + "]\n"
          }
        }
      }

      // Handle input function (basic simulation)
      if (code.includes("input(") && input) {
        // Replace input() with the provided value in variables
        const inputRegex = /(\w+)\s*=\s*input\s*$$[^)]*$$/g
        let inputMatch

        while ((inputMatch = inputRegex.exec(code)) !== null) {
          const varName = inputMatch[1]
          // Add to output that we received input
          output += `Received input: ${input}\n`

          // Simulate variable assignment
          code = code.replace(inputMatch[0], `${varName} = "${input}"`)
        }
      }

      // Handle for loops (very basic simulation)
      if (code.includes("for ") && code.includes(" in range(") && code.includes("):")) {
        output += "Loop executed\n"
      }

      // Handle if statements
      if (code.includes("if ") && code.includes(":")) {
        output += "Conditional executed\n"
      }

      // Handle function definitions
      if (code.includes("def ") && code.includes("):")) {
        output += "Function defined\n"
      }

      // If no output was generated but code exists
      if (output === "" && code.trim() !== "") {
        output = "Code executed successfully (no output)\n"
      }

      callback(output)
    } catch (error) {
      callback(`Error: ${error}\n`)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <button
          onClick={handleBackToTopics}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-8"
        >
          <ChevronLeft size={20} className="mr-2" />
          <span>Back to Topics</span>
        </button>

        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-4">
            <SubjectIcon subject="coding" />
          </div>
          <div className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
            {topic?.title || "Python Basics"}
          </div>
          <h1 className="text-2xl font-bold mb-2 dark:text-white">{currentLesson.title}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div
              className="prose dark:prose-invert max-w-none mb-6"
              dangerouslySetInnerHTML={{ __html: currentLesson.instructions }}
            />

            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md mb-6">
              <h3 className="font-bold dark:text-white mb-2">Example:</h3>
              <pre className="bg-gray-800 text-white p-3 rounded-md overflow-x-auto">
                <code>{currentLesson.example}</code>
              </pre>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 rounded-md">
              <h3 className="font-bold text-yellow-800 dark:text-yellow-400 mb-2">Challenge:</h3>
              <p className="dark:text-gray-300">{currentLesson.challenge}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gray-800 text-white p-3 flex justify-between items-center">
                <h3 className="font-mono">Python Editor</h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleRunCode}
                    className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-black"
                  >
                    <Play size={14} /> Run Code
                  </Button>
                </div>
              </div>
              <CodeEditor code={code || currentLesson.startingCode} onChange={handleCodeChange} />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gray-800 text-white p-3">
                <h3 className="font-mono">Output</h3>
              </div>
              <div className="bg-black text-green-400 p-4 font-mono h-48 overflow-y-auto whitespace-pre-wrap">
                {output || "Run your code to see the output here..."}

                {waitingForInput && (
                  <form onSubmit={handleInputSubmit} className="mt-2 flex">
                    <span className="mr-2">{">"}</span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="flex-1 bg-transparent border-b border-green-400 focus:outline-none"
                      autoFocus
                    />
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePreviousLesson}
            disabled={currentLessonIndex === 0}
            className="flex items-center gap-1 border-gray-300 dark:border-gray-700 dark:text-white"
          >
            <ChevronLeft size={16} /> Previous Lesson
          </Button>

          <Button
            onClick={handleNextLesson}
            disabled={currentLessonIndex === pythonLessons.length - 1}
            className="flex items-center gap-1 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-black text-white"
          >
            Next Lesson <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {showAchievement && (
        <AchievementToast
          title="Code Executed!"
          description="You've successfully run your Python code"
          xp={5}
          onClose={() => setShowAchievement(false)}
        />
      )}
    </div>
  )
}
