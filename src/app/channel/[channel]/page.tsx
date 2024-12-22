import ChatContainer from "@/components/chat-container"
import { db } from "@/lib/db"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    channel: string
  }
}

async function ChannelPage({ params }: PageProps) {
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