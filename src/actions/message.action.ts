"use server";

import { pusherServer } from "@/lib/pusher";
import { db } from "@/lib/db";

export const sendMessage = async (message: string, channelId: string) => {
  try {
    const newMessage = await db.message.create({
      data: {
        content: message,
        channelId,
        userId: "anonymous",
      },
    })

    await pusherServer.trigger(`channel-${channelId}`, 'upcoming-message', {
      message,
      messageId: newMessage.id,
      timestamp: newMessage.createdAt,
      userId: newMessage.userId
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message)
  }
}