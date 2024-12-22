// app/channels/[channelId]/not-found.tsx
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-semibold">Channel Not Found</h2>
      <p className="text-muted-foreground mb-4">
        The channel you are looking for does not exist or was deleted.
      </p>
      <Link
        href="/channels"
        className="text-primary hover:underline"
      >
        Return to channels list
      </Link>
    </div>
  )
}