import { db } from "@/lib/db"
import { compare } from "bcryptjs"
import { NextRequest, NextResponse } from "next/server"
import { cookies } from 'next/headers'
import * as z from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    const user = await db.user.findUnique({
      where: { email }
    })

    if (!user) {
      return new NextResponse("Invalid credentials", { status: 401 })
    }

    const isPasswordValid = await compare(password, user.password)
    if (!isPasswordValid) {
      return new NextResponse("Invalid credentials", { status: 401 })
    }

    (await
      cookies()).set('user', JSON.stringify({
        id: user.id,
        email: user.email,
        username: user.username
      }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
      })

    return NextResponse.json({
      id: user.id,
      email: user.email,
      username: user.username
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid input", { status: 422 })
    }

    console.error('Login error:', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}