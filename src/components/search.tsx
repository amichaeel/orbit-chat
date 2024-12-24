"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Input } from "./ui/input"
import { Search as SearchIcon } from "lucide-react"
import Link from "next/link"
import { useDebounce } from "@/hooks/use-debounce"
import { Hash } from "lucide-react"

type Channel = {
  id: string
  name: string
  description?: string | null
}

const Search = () => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [channels, setChannels] = useState<Channel[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false)

  const fetchRandomChannels = async () => {
    const response = await fetch('/api/channels/random')
    const data = await response.json()
    setChannels(data)
  }

  const onFocus = async () => {
    setOpen(true)
    if (!hasLoadedInitial) {
      await fetchRandomChannels()
      setHasLoadedInitial(true)
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'j') {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const debouncedSearch = useDebounce(async (search: string) => {
    if (search.length === 0) {
      const response = await fetch('/api/channels/random')
      const data = await response.json()
      setChannels(data)
    } else {
      const response = await fetch(`/api/channels/search?q=${search}`)
      const data = await response.json()
      setChannels(data)
    }
  }, 300)

  const onInputChange = useCallback((value: string) => {
    setValue(value)
    setOpen(true)
    debouncedSearch(value)
  }, [debouncedSearch])

  return (
    <div className="relative w-full max-w-xl">
      <div className="relative flex items-center">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          placeholder="Search channels..."
          className="pl-9 pr-12 rounded-full"
          value={value}
          onChange={(e) => onInputChange(e.target.value)}
          onFocus={onFocus}
        />
        <span className="absolute text-xs right-6 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50">⌘J</span>
      </div>

      {open && (
        <div
          ref={dropdownRef}
          className="absolute mt-2 w-full bg-popover rounded-md shadow-lg border border-border overflow-hidden z-50"
        >
          {channels.length === 0 && value.length > 0 ? (
            <div className="p-4 text-sm text-muted-foreground">
              No results found
            </div>
          ) : (
            <div className="py-2">
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                {value ? "Results" : "Suggested Channels"}
              </div>
              {channels.map((channel) => (
                <Link
                  key={channel.id}
                  href={`/channel/${channel.name}`}
                  onClick={() => {
                    setOpen(false)
                    setValue("")
                  }}
                >
                  <div className="px-3 flex items-center gap-2 py-2 hover:bg-muted cursor-pointer">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <div className="text-sm font-medium">{channel.name}</div>
                      {channel.description && (
                        <div className="text-xs text-muted-foreground truncate">
                          {channel.description}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Search