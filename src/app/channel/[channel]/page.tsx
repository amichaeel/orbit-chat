import ChatContainer from "@/components/chat-container";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ChannelHeader } from "@/components/channel-header";

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
    <div className="flex flex-col h-full overflow-hidden"> {/* Changed classes */}
      <ChannelHeader name={channel.name} description={channel.description} />
      <div className="flex-1 overflow-hidden"> {/* Added wrapper */}
        <ChatContainer channel={channel.id} />
      </div>
    </div>
  );
};

export default ChannelPage;
