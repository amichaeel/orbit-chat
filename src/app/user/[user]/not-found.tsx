import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-full">
      <h2 className="text-2xl font-semibold mb-2">User Not Found</h2>
      <p className="text-muted-foreground mb-4">
        The user you&apos;re looking for doesn&apos;t exist or was deleted.
      </p>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  )
}