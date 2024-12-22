import { NextResponse } from "next/server"
import { cookies } from 'next/headers'

export async function GET() {
  const userCookie = (await cookies()).get('user')

  if (!userCookie) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  return NextResponse.json(JSON.parse(userCookie.value))
}