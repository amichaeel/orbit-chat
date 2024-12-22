import ChatContainer from "@/components/chat-container";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

type Params = Promise<{ channel: string }>;

interface ChannelPageProps {
  params: Params;
}

const ChannelPage = async ({ params }: ChannelPageProps) => {
  const resolvedParams = await params;
  const channel = await db.channel.findUnique({
    where: {
      name: resolvedParams.channel,
    },
  });

  if (!channel) {
    notFound();
  }

  return (
    <div className="flex-1 min-h-0">
      <ChatContainer channel={channel.id} />
    </div>
  );
};

export default ChannelPage;
