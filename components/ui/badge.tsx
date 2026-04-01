import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm",
  {
    variants: {
      variant: {
        default:
          "bg-[#0a4f7a] text-white shadow-md hover:shadow-lg",
        secondary:
          "bg-green-500 text-white shadow-md hover:shadow-lg",
        destructive:
          "bg-green-500 text-white shadow-md hover:shadow-lg",
        outline: "border-2 border-[#e0f2fe] dark:border-[#084060] text-[#0a4f7a] dark:text-[#60a5fa] bg-[#f0f9ff] dark:bg-[#084060] hover:bg-[#e0f2fe] dark:hover:bg-[#063147]",
        success: "bg-green-500 text-white shadow-md hover:shadow-lg",
        warning: "bg-[#0a4f7a] text-white shadow-md hover:shadow-lg",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

