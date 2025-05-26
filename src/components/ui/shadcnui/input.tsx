"use client"

import * as React from "react"
import { cn } from "@flowtec/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  error?: string | undefined
  icon?: React.ElementType
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, icon: Icon, placeholder, ...props }, ref) => {
    const [showError, setShowError] = React.useState(false)

    React.useEffect(() => {
      if (error) {
        setShowError(true)
        const timer = setTimeout(() => setShowError(false), 500)
        return () => clearTimeout(timer)
      }
    }, [error])

    return (
      <div className="w-full">
        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {error ? (
                <Icon className="h-4 w-4 text-destructive" />
              ) : (
                <Icon className="h-4 w-4" />
              )}
            </div>
          )}
          <input
            type={type}
            data-slot="input"
            className={cn(
              "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
              "bg-transparent dark:bg-input/30",
              "border",
              "border-input",
              "flex h-9 w-full min-w-0 rounded-md py-1 text-base shadow-xs transition-[color,box-shadow,border-color] outline-none",
              "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
              "md:text-sm",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
              // Icon spacing
              Icon ? "pl-10 pr-3" : "px-3",
              // Error states
              error && [
                "border-destructive",
                "focus-visible:border-destructive focus-visible:ring-destructive/20",
                "text-destructive",
                showError && "animate-shake",
              ],
              className
            )}
            ref={ref}
            aria-invalid={error ? "true" : "false"}
            placeholder={placeholder}
            {...props}
          />
        </div>
        {error && (
          <div className="mt-1 animate-slide-down">
            <p className="text-sm text-destructive font-medium">{error}</p>
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }
