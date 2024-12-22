"use client"

import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"
import Search from "./search"
import { LogOut, User } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { CreateChannelDialog } from "./create-channel-dialog"


const Nav = () => {
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="grid grid-cols-[1fr,auto,auto] md:grid-cols-[1fr,2fr,1fr] border-b items-center w-full px-4 py-2">
      <div>
        <Link href="/">
          <span className="text-2xl font-extralight">orbit</span>
        </Link>
      </div>

      <div className="hidden md:flex justify-center w-full">
        <div className="w-full max-w-xl">
          <Search />
        </div>
      </div>

      <div className="flex items-center ml-auto gap-2">
        {user ? (
          <>
            <div className="hidden lg:block">
              <CreateChannelDialog />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.username || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <div className="lg:hidden">
                  <CreateChannelDialog />
                </div>
                <DropdownMenuItem
                  className="text-red-600 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        )}
        <ThemeToggle />
      </div>
    </div>
  )
}

export default Nav