// app/api/pusher/auth/route.ts
import { pusherServer } from "@/lib/pusher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const socketId = data.get('socket_id');
    const channelName = data.get('channel_name');

    console.log("Auth request for:", { socketId, channelName });

    if (!socketId || !channelName) {
      throw new Error("Missing required fields");
    }

    const authResponse = pusherServer.authorizeChannel(
      socketId.toString(),
      channelName.toString(),
      {
        user_id: Math.random().toString(36).slice(2),
        user_info: {
          name: "Anonymous User"
        }
      }
    );

    console.log("Auth response:", authResponse);
    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("Auth error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Authentication failed" }),
      { status: 401 }
    );
  }
}