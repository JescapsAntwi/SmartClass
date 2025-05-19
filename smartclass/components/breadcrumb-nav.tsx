"use client"

import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface BreadcrumbNavProps {
  items: Array<{
    label: string
    href: string
  }>
  darkMode?: boolean
}

export default function BreadcrumbNav({ items, darkMode = false }: BreadcrumbNavProps) {
  const router = useRouter()

  const handleHomeClick = () => {
    router.push("/grade-selection")
  }

  return (
    <nav
      className={`${darkMode ? "bg-blue-900 border-blue-800" : "bg-white border-gray-200"} border-b py-3 px-4 shadow-sm`}
    >
      <ol className="flex flex-wrap items-center gap-1 text-sm">
        <li className="flex items-center">
          <button
            onClick={handleHomeClick}
            className={`${darkMode ? "text-gray-300 hover:text-white" : "text-gray-500 hover:text-blue-600"} flex items-center`}
          >
            <Home size={16} />
            <span className="sr-only">Home</span>
          </button>
        </li>

        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight size={14} className={darkMode ? "text-gray-500 mx-1" : "text-gray-400 mx-1"} />
            <Link
              href={item.href}
              className={`${
                index === items.length - 1
                  ? darkMode
                    ? "text-white font-medium"
                    : "text-blue-600 font-medium"
                  : darkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-500 hover:text-blue-600"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}
