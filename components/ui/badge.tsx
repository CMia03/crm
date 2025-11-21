import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg",
        secondary:
          "border-transparent bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-md hover:shadow-lg",
        destructive:
          "border-transparent bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg",
        outline: "border-2 border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100",
        success: "border-transparent bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md hover:shadow-lg",
        warning: "border-transparent bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md hover:shadow-lg",
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

