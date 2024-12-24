"use client"

import { Button } from "./ui/button"
import Search from "./search"
import { Moon, Sun, LogOut, Settings, MessageCircleMore, Bell } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useTheme } from "next-themes"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"


const Nav = () => {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { setTheme, theme } = useTheme()

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

      <div className="flex items-center ml-auto gap-4">
        {user ? (
          <>
            <Button disabled variant={"ghost"} className="h-8 w-8">
              <MessageCircleMore strokeWidth={1.5} />
            </Button>
            <Button disabled variant={"ghost"} className="h-8 w-8">
              <Bell strokeWidth={1.5} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className='h-8 w-8 cursor-pointer'>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-96">
                <Link href={`/user/${user.username}`} className="flex gap-2 hover:bg-muted-foreground/5 px-2 py-1.5 rounded-md">
                  <Avatar className='h-8 w-8 cursor-pointer'>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">View Profile</p>
                    <p className="text-xs text-muted-foreground">@{user.username}</p>
                  </div>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                  <Sun className="hidden h-4 w-4 mr-2 dark:block" />
                  <Moon className="h-4 mr-2 w-4 dark:hidden" />
                  {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
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
            <Button variant="outline" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        )}
      </div>
    </div >
  )
}

export default Nav