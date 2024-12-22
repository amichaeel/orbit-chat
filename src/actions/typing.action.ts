"use server";
import { pusherServer } from "@/lib/pusher";

export const sendTypingIndicator = async (isTyping: boolean, clientId: string) => {
  try {
    await pusherServer.trigger("global", "typing-indicator", {
      isTyping,
      clientId
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message);
  }
}