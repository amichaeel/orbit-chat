/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/lib/db";

export const createChannel = async (name: string, description?: string) => {
  try {
    const channel = await db.channel.create({
      data: {
        name,
        description,
      },
    });
    return channel;
  } catch (error: any) {
    throw new Error(error.message);
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      orderBy: {
        createdAt: 'asc',
      },
    });
    return messages;
  } catch (error: any) {
    throw new Error(error.message);
  }
}