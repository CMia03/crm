import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border-2 border-blue-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2 text-sm shadow-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-blue-500 dark:focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-800 focus-visible:shadow-md hover:border-blue-300 dark:hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-slate-800 [&[type='date']]:!bg-white dark:[&[type='date']]:!bg-slate-700 [&[type='date']]:!text-foreground [&[type='date']]:bg-white dark:[&[type='date']]:bg-slate-700",
          className
        )}
        style={type === "date" ? { 
          backgroundColor: "#ffffff", 
          background: "#ffffff",
          color: "var(--foreground)",
          WebkitAppearance: "none",
          MozAppearance: "textfield"
        } : undefined}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

