import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { format } from 'date-fns'

type Params = Promise<{ user: string }>;

interface UserPageProps {
  params: Params;
}

export default async function UserPage({ params }: UserPageProps) {
  const resolvedParams = await params;
  const user = await db.user.findUnique({
    where: { username: resolvedParams.user },
    include: {
      messages: {
        include: {
          channel: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  if (!user) {
    notFound()
  }

  return (
    <div className="flex items-center bg=white justify-center">
      <div className="container max-w-4xl py-8">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{user.username}</h1>
              <p className="text-sm text-muted-foreground">
                Joined {format(new Date(user.createdAt), 'MMMM yyyy')}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Messages</h3>
            <p className="text-2xl font-semibold">{user.messages.length}</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Channels Active</h3>
            <p className="text-2xl font-semibold">
              {new Set(user.messages.map(m => m.channelId)).size}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Member Since</h3>
            <p className="text-2xl font-semibold">
              {format(new Date(user.createdAt), 'MMM yyyy')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}