import { Input } from "./ui/input"
import { Search as SearchIcon } from "lucide-react"

const Search = () => {
  return (
    <div className="hidden md:inline">
      <Input icon={SearchIcon} className="rounded-full" placeholder="Search Orbit" />
    </div>
  )
}

export default Search