/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import ClipLoader from "react-spinners/ClipLoader";
import Loading from "../loading"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const { user, login, loading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await login(email, password)
      router.push('/')
    } catch (err) {
      setError("Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router])

  if (loading) {
    return <Loading />
  }

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="max-w-md w-full p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Log In</h1>
          <p className="text-muted-foreground">By continuing, you agree to our User Agreenment and acknowledge that you understand the Privacy Policy.</p>
        </div>

        {error && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            {isLoading ? (
              <ClipLoader size={20} className="spinner" />
            ) : (
              "Log In"
            )}
          </Button>
        </form>

        <p className="text-center text-sm">
          New to Orbit?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}