import * as React from "react"
import { cn } from "../../lib/utils"
import { X } from "lucide-react"

/**
 * Toast component for displaying notifications
 */
const Toast = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all",
        {
          "bg-white/10 backdrop-blur-md border-white/20 text-white": variant === "default",
          "bg-green-900/30 border-green-500/50 text-white": variant === "success",
          "bg-red-900/30 border-red-500/50 text-white": variant === "error",
          "bg-yellow-900/30 border-yellow-500/50 text-white": variant === "warning",
          "bg-blue-900/30 border-blue-500/50 text-white": variant === "info",
        },
        className
      )}
      {...props}
    />
  )
})
Toast.displayName = "Toast"

/**
 * ToastClose component for closing a toast
 */
const ToastClose = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "absolute right-2 top-2 rounded-md p-1 text-white/50 opacity-0 transition-opacity hover:text-white focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100",
        className
      )}
      toast-close=""
      {...props}
    >
      <X className="h-4 w-4" />
    </button>
  )
})
ToastClose.displayName = "ToastClose"

/**
 * ToastTitle component for toast title
 */
const ToastTitle = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("text-sm font-semibold", className)}
      {...props}
    />
  )
})
ToastTitle.displayName = "ToastTitle"

/**
 * ToastDescription component for toast description
 */
const ToastDescription = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("text-sm opacity-90", className)}
      {...props}
    />
  )
})
ToastDescription.displayName = "ToastDescription"

export { Toast, ToastClose, ToastTitle, ToastDescription }
