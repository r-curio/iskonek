"use client"

import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    </div>
  )
}

