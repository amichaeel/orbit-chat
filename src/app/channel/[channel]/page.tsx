// src/app/channel/[channel]/page.tsx
import ChatContainer from "@/components/chat-container"
import { db } from "@/lib/db"
import { notFound } from "next/navigation"

const ChannelPage = async ({ params }: { params: { channel: string } }) => {
  const channel = await db.channel.findUnique({
    where: { name: params.channel }
  })

  if (!channel) {
    notFound()
  }

  return (
    <div className="flex-1 min-h-0">
      <ChatContainer channel={channel.name} />
    </div>
  )
}

export default ChannelPage