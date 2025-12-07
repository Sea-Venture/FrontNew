import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shadow-lg transform hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
      color: {
        default: "",
        emerald: "bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-white hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 shadow-emerald-200/50 hover:shadow-emerald-300/70",
        amber: "bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-white hover:from-amber-500 hover:via-orange-500 hover:to-rose-500 shadow-amber-200/50 hover:shadow-amber-300/70",
        forest: "bg-gradient-to-r from-emerald-400 via-green-400 to-lime-400 text-white hover:from-emerald-500 hover:via-green-500 hover:to-lime-500 shadow-emerald-200/50 hover:shadow-emerald-300/70",
        sunset: "bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-white hover:from-amber-500 hover:via-orange-500 hover:to-rose-500 shadow-amber-200/50 hover:shadow-amber-300/70",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      color: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  color,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, color, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
