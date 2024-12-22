import Link from "next/link"
import { SearchX } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-full">
      <SearchX className="h-10 w-10" />
      <h2 className="text-2xl font-semibold">Channel Not Found</h2>
      <p className="text-muted-foreground mb-4">
        The channel you are looking for does not exist or was deleted.
      </p>
      <Link
        href="/"
        className="text-primary hover:underline"
      >
        Go home
      </Link>
    </div>
  )
}