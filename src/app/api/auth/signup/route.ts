// app/api/auth/signup/route.ts
import { db } from "@/lib/db"
import { hash } from "bcryptjs"
import { NextRequest, NextResponse } from "next/server"
import * as z from "zod"

const signupSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(6)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, email, password } = signupSchema.parse(body)

    // Check if username or email already exists
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    })

    if (existingUser) {
      if (existingUser.username === username) {
        return new NextResponse("Username already taken", { status: 400 })
      }
      return new NextResponse("Email already registered", { status: 400 })
    }

    const hashedPassword = await hash(password, 12)
    await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword
      }
    })

    return NextResponse.json({ message: "User created successfully" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid input", { status: 422 })
    }
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}