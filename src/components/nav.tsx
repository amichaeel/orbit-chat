import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"
import Search from "./search"
import { User } from "lucide-react"
import Link from "next/link"

const Nav = () => {
  return (
    <div className="grid grid-cols-3 border-b items-center w-full px-4 py-1">

      <div className="justify-self-start">
        <Link href="/">
          <span className="text-2xl font-extralight">orbit</span>
        </Link>
      </div>

      <div className="justify-self-center">
        <Search />
      </div>

      <div className="flex items-center justify-self-end">
        <Button
          variant="ghost"
          size="icon"
        >
          <User className="h-5 w-5" />
        </Button>
        <ThemeToggle />
      </div>

    </div>
  )
}

export default Nav