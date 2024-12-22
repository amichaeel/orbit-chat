"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "./ui/button"

interface ChannelHeaderProps {
  name: string
  description?: string | null
}

export const ChannelHeader = ({ name, description }: ChannelHeaderProps) => {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="border-b">
      <div className="flex items-center justify-between px-4 py-2">
        <div className={`flex-1 transition-all duration-200 ${isExpanded ? '' : 'truncate'}`}>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-medium">#{name}</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6 p-0"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
          {isExpanded && description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  )
}