import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-lg font-semibold tracking-[0.01em]",
    "ring-offset-background transition-all duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    "motion-reduce:transition-none motion-reduce:active:scale-100",
  ].join(" "),
  {
    variants: {
      variant: {
        // Brand variants (CLAUDE.md §4.8)
        black:
          "bg-brand-black text-brand-cream hover:brightness-125 active:brightness-95",
        orange:
          "bg-brand-orange text-brand-black hover:brightness-110 active:brightness-95",
        outline:
          "border border-brand-black/20 bg-transparent text-brand-black hover:bg-brand-black/5 hover:border-brand-black/40 active:bg-brand-black/10",
        neon:
          "bg-brand-neon text-brand-black hover:brightness-105 active:brightness-95",
        blueDark:
          "bg-brand-blue-dark text-white hover:brightness-115 active:brightness-95",
        blueLight:
          "bg-brand-blue-light text-brand-black hover:brightness-110 active:brightness-95",
        ghost:
          "bg-transparent text-brand-black hover:bg-brand-black/5 active:bg-brand-black/10",
        link:
          "text-brand-blue-dark underline-offset-4 hover:underline active:opacity-80 h-auto p-0",
        // Aliases / backwards compatibility for shadcn legacy usage in admin
        default:
          "bg-brand-black text-brand-cream hover:brightness-125 active:brightness-95",
        secondary:
          "bg-brand-blue-dark text-white hover:brightness-115 active:brightness-95",
        destructive:
          "bg-status-error-fg text-white hover:brightness-115 active:brightness-95",
      },
      size: {
        default: "h-11 px-6 text-sm",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "black",
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
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
