import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-black/15 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-black text-white shadow-sm",
        yellow: "bg-[#f7d842] text-black shadow-sm",
        outline:
          "border-black/15 bg-white text-black hover:bg-black/5 aria-expanded:bg-black/5",
        secondary:
          "bg-black/5 text-black hover:bg-black/10 aria-expanded:bg-black/10",
        ghost:
          "bg-transparent text-black hover:bg-black/5 aria-expanded:bg-black/5",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90",
        link: "bg-transparent px-0 text-blue-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 gap-1.5 px-4",
        xs: "h-8 gap-1 px-2.5 text-xs",
        sm: "h-9 gap-1 px-3 text-sm",
        lg: "h-11 gap-1.5 px-5",
        icon: "h-10 w-10 px-0",
        "icon-xs": "h-8 w-8 px-0",
        "icon-sm": "h-9 w-9 px-0",
        "icon-lg": "h-11 w-11 px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
