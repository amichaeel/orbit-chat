import React from "react"
export default function Loading() {
  return (
    <div className="min-h-screen min-w-screen font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-2xl mx-auto p-6">
        <div className="h-8 w-48 bg-muted rounded-md mb-6 animate-pulse" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2 p-3 rounded-lg bg-muted animate-pulse"
            >
              <div className="h-4 w-4 bg-muted-foreground/20 rounded" />
              <div className="space-y-2">
                <div className="h-5 w-32 bg-muted-foreground/20 rounded" />
                <div className="h-4 w-48 bg-muted-foreground/20 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}