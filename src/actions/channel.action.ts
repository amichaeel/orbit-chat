/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/lib/db";
import { z } from "zod"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const channelSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().optional()
})

export const createChannel = async (data: z.infer<typeof channelSchema>) => {
  try {
    const channel = await db.channel.create({
      data: {
        name: data.name,
        description: data.description
      }
    })
    return { success: true, channel }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, error: "Failed to create channel" }
  }
}

export const getChannels = async () => {
  try {
    const channels = await db.channel.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return channels;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export const getChannelMessages = async (channelId: string) => {
  try {
    const messages = await db.message.findMany({
      where: {
        channelId,
      },
      include: {
        user: {
          select: {
            username: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    return messages;
  } catch (error: any) {
    throw new Error(error.message);
  }
}