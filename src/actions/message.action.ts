"use server";

import { pusherServer } from "@/lib/pusher";

export const sendMessage = async (message: string) => {
  try {
    // TODO: store message inside database

    // trigger websocket event
    pusherServer.trigger('global', 'upcoming-message', {
      message,
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message)
  }
}