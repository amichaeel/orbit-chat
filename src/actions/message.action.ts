"use server";

import { pusherServer } from "@/lib/pusher";
import { db } from "@/lib/db";

export const sendMessage = async (
  message: string,
  channelId: string,
  user: { id: string; username: string }
) => {
  try {
    const newMessage = await db.message.create({
      data: {
        content: message,
        channelId,
        userId: user.id,
      },
      include: {
        user: {
          select: {
            username: true
          }
        }
      }
    });

    await pusherServer.trigger(`channel-${channelId}`, 'upcoming-message', {
      id: newMessage.id,
      content: newMessage.content,
      createdAt: newMessage.createdAt,
      channelId: newMessage.channelId,
      userId: newMessage.userId,
      updatedAt: newMessage.updatedAt,
      user: {
        username: newMessage.user.username
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message);
  }
};