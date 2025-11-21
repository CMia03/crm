import * as React from "react"
import { Input } from "./input"
import { Search, X } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onClear, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={ref}
          type="search"
          className={cn(
            "pl-10 pr-10 w-full bg-white dark:bg-slate-700 border-2 border-blue-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400",
            className
          )}
          value={value}
          {...props}
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 hover:bg-blue-100 dark:hover:bg-slate-600"
            onClick={onClear}
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}
      </div>
    )
  }
)
SearchInput.displayName = "SearchInput"

export { SearchInput }

