import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#0a4f7a] text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 focus-visible:ring-[#0a4f7a]",
        destructive:
          "bg-green-500 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 focus-visible:ring-green-500",
        outline:
          "border-2 border-[#e0f2fe] dark:border-[#084060] bg-[#f0f9ff] dark:bg-[#084060] text-[#0a4f7a] dark:text-[#60a5fa] shadow-sm hover:bg-[#e0f2fe] dark:hover:bg-[#063147] hover:border-[#bae6fd] dark:hover:border-[#0284c7] hover:scale-105 active:scale-95 focus-visible:ring-[#0a4f7a] dark:focus-visible:ring-[#60a5fa]",
        secondary:
          "bg-green-500 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 focus-visible:ring-green-500",
        ghost: "hover:bg-[#f0f9ff] dark:hover:bg-[#084060] hover:text-[#0a4f7a] dark:hover:text-[#60a5fa] active:bg-[#e0f2fe] dark:active:bg-[#063147]",
        link: "text-[#0a4f7a] dark:text-[#60a5fa] underline-offset-4 hover:underline hover:text-[#084060] dark:hover:text-[#93c5fd]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

