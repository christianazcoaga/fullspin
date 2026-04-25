import { cn } from "@/lib/utils"

/*
 * Placeholder SVG logos until the designer delivers the final files.
 * TODO: replace these three SVGs with the official Full Spin assets
 * (full / stacked / isotype) once available. They use `currentColor`
 * so colour can be inherited from a parent text-* class.
 */

type LogoColor = "dark" | "light"
type LogoVariant = "full" | "stacked" | "isotype" | "responsive"

interface LogoProps {
  variant?: LogoVariant
  color?: LogoColor
  className?: string
  /** A11y label for the wrapping element. */
  label?: string
}

function colorClass(color: LogoColor) {
  return color === "light" ? "text-brand-cream" : "text-brand-black"
}

function LogoFull({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 56"
      role="img"
      aria-hidden="true"
      className={cn("h-8 w-auto", className)}
      fill="none"
    >
      <circle cx="28" cy="28" r="22" stroke="currentColor" strokeWidth="3" />
      <path
        d="M10 28c8 12 28 12 36 0M10 28c8-12 28-12 36 0"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <text
        x="62"
        y="36"
        fontFamily="var(--font-hanken), system-ui, sans-serif"
        fontSize="26"
        fontWeight="800"
        letterSpacing="-0.5"
        fill="currentColor"
      >
        FULL SPIN
      </text>
    </svg>
  )
}

function LogoStacked({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 80"
      role="img"
      aria-hidden="true"
      className={cn("h-12 w-auto", className)}
      fill="none"
    >
      <circle cx="20" cy="40" r="16" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M6 40c5 9 23 9 28 0M6 40c5-9 23-9 28 0"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <text
        x="44"
        y="36"
        fontFamily="var(--font-hanken), system-ui, sans-serif"
        fontSize="20"
        fontWeight="800"
        letterSpacing="-0.5"
        fill="currentColor"
      >
        FULL
      </text>
      <text
        x="44"
        y="60"
        fontFamily="var(--font-hanken), system-ui, sans-serif"
        fontSize="20"
        fontWeight="800"
        letterSpacing="-0.5"
        fill="currentColor"
      >
        SPIN
      </text>
    </svg>
  )
}

function LogoIsotype({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 56 56"
      role="img"
      aria-hidden="true"
      className={cn("h-9 w-9", className)}
      fill="none"
    >
      <circle cx="28" cy="28" r="22" stroke="currentColor" strokeWidth="3" />
      <path
        d="M10 28c8 12 28 12 36 0M10 28c8-12 28-12 36 0"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function Logo({
  variant = "responsive",
  color = "dark",
  className,
  label = "Full Spin",
}: LogoProps) {
  if (variant === "full") {
    return (
      <span className={cn("inline-flex items-center", colorClass(color), className)} aria-label={label}>
        <LogoFull />
      </span>
    )
  }
  if (variant === "stacked") {
    return (
      <span className={cn("inline-flex items-center", colorClass(color), className)} aria-label={label}>
        <LogoStacked />
      </span>
    )
  }
  if (variant === "isotype") {
    return (
      <span className={cn("inline-flex items-center", colorClass(color), className)} aria-label={label}>
        <LogoIsotype />
      </span>
    )
  }

  // Responsive: isotype on mobile, stacked on md, full on lg+
  return (
    <span className={cn("inline-flex items-center", colorClass(color), className)} aria-label={label}>
      <span className="md:hidden">
        <LogoIsotype />
      </span>
      <span className="hidden md:inline-flex lg:hidden">
        <LogoStacked />
      </span>
      <span className="hidden lg:inline-flex">
        <LogoFull />
      </span>
    </span>
  )
}

export { LogoFull, LogoStacked, LogoIsotype }
