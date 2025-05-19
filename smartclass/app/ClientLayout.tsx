"use client"

import type React from "react"
import Header from "@/components/header"
import { usePathname } from "next/navigation"

export function RootClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isSubjectIntroPage = pathname?.includes("/subject-introduction/")

  return (
    <>
      {!isSubjectIntroPage && <Header />}
      {children}
    </>
  )
}
