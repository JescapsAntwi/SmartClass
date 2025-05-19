"use client"

import { useEffect, useState } from "react"
import AceEditor from "react-ace"
import { useTheme } from "next-themes"

// Import Ace Editor modes and themes
import "ace-builds/src-noconflict/mode-python"
import "ace-builds/src-noconflict/theme-github"
import "ace-builds/src-noconflict/theme-monokai"
import "ace-builds/src-noconflict/ext-language_tools"

interface CodeEditorProps {
  code: string
  onChange: (code: string) => void
}

export default function CodeEditor({ code, onChange }: CodeEditorProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [value, setValue] = useState(code)

  // Update internal state when prop changes
  useEffect(() => {
    setValue(code)
  }, [code])

  // After mounting, we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleChange = (newValue: string) => {
    setValue(newValue)
    onChange(newValue)
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center">
        <span className="text-gray-500 dark:text-gray-400">Loading editor...</span>
      </div>
    )
  }

  return (
    <AceEditor
      mode="python"
      theme={theme === "dark" ? "monokai" : "github"}
      onChange={handleChange}
      value={value}
      name="python-editor"
      editorProps={{ $blockScrolling: true }}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        showLineNumbers: true,
        tabSize: 4,
        fontSize: 14,
        showPrintMargin: false,
      }}
      width="100%"
      height="250px"
      className="border border-gray-200 dark:border-gray-700 rounded-b-lg"
    />
  )
}
