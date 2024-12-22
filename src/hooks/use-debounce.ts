import { useCallback, useRef } from "react"

export function useDebounce(
  callback: (...args: string[]) => Promise<void>,
  delay: number
): (...args: string[]) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  return useCallback(
    (...args: string[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        void callback(...args)
      }, delay)
    },
    [callback, delay]
  )
}