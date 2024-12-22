import { db } from "@/lib/db"
import Link from "next/link"
import { Hash } from "lucide-react"
import type { Channel } from "@/types"

export default async function Home() {
  const channels = await db.channel.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  }) satisfies Channel[]

  return (
    <div className="min-h-screen min-w-screen font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-2xl mx-auto p-6">
        <div className="space-y-2">
          {channels.length === 0 ? (
            <p className="text-muted-foreground">No channels available</p>
          ) : (
            channels.map((channel: Channel) => (
              <Link
                key={channel.name}
                href={`/channel/${channel.name}`}
                className="flex items-center gap-2 p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <Hash className="h-4 w-4 text-muted-foreground" />
                <div>
                  <h2 className="font-medium">{channel.name}</h2>
                  {channel.description && (
                    <p className="text-sm text-muted-foreground">{channel.description}</p>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}