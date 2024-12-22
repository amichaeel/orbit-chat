/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const channels = await db.channel.findMany({
      take: 3,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        description: true
      }
    })

    return NextResponse.json(channels)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch channels" }, { status: 500 })
  }
}