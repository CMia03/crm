import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { Button } from "./button"

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

const DialogContext = React.createContext<{
  open: boolean
  onOpenChange: (open: boolean) => void
}>({
  open: false,
  onOpenChange: () => {},
})

const Dialog = ({ open = false, onOpenChange, children }: DialogProps) => {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  if (!open) return null

  return (
    <DialogContext.Provider value={{ open, onOpenChange: onOpenChange || (() => {}) }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in-0 duration-200">
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in-0"
          onClick={() => onOpenChange?.(false)}
        />
        <div className="relative z-50 animate-in zoom-in-95 duration-200">{children}</div>
      </div>
    </DialogContext.Provider>
  )
}

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { onOpenChange } = React.useContext(DialogContext)
  return (
    <div
      ref={ref}
      className={cn(
        "relative z-50 grid w-full max-w-lg gap-0 border-2 border-blue-200 bg-white shadow-2xl duration-200 rounded-2xl overflow-hidden",
        className
      )}
      {...props}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 shadow-sm hover:shadow-md transition-all"
        onClick={() => onOpenChange(false)}
      >
        <X className="h-4 w-4" />
      </Button>
      {children}
    </div>
  )
})
DialogContent.displayName = "DialogContent"

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 px-8 pt-6 pb-4  from-blue-50 via-green-50 to-yellow-50 border-b-2 border-blue-200",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-xl font-bold leading-none tracking-tight bg-blue-950 from-blue-600 via-green-600 to-yellow-600 bg-clip-text text-transparent",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground font-medium", className)}
    {...props}
  />
))
DialogDescription.displayName = "DialogDescription"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 px-8 py-4 bg-gradient-to-r from-blue-50/50 via-green-50/50 to-yellow-50/50 border-t-2 border-blue-100",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
}

