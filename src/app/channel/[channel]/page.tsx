// src/app/channel/[channel]/page.tsx
import ChatContainer from "@/components/chat-container"
import { db } from "@/lib/db"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{
    channel: string
  }>
}

const ChannelPage = async ({ params }: PageProps) => {
  const { channel } = await params

  const channelData = await db.channel.findUnique({
    where: {
      id: channel
    }
  })

  if (!channelData) {
    notFound()
  }

  return (
    <div className="flex-1 min-h-0">
      <ChatContainer channel={channelData.id} />
    </div>
  )
}

export default ChannelPage