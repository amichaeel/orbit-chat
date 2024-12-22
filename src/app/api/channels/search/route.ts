/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json([])
    }

    const channels = await db.channel.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            description: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      },
      take: 5,
      select: {
        id: true,
        name: true,
        description: true
      }
    })

    return NextResponse.json(channels)
  } catch (error) {
    return NextResponse.json({ error: "Failed to search channels" }, { status: 500 })
  }
}