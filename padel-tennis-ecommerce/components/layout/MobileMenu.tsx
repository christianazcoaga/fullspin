"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { useState } from "react"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { NAV_LINKS } from "./nav-links"
import Logo from "./Logo"

export default function MobileMenu() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg text-brand-black hover:bg-brand-black/5 active:scale-[0.98] transition-all duration-200"
        aria-label="Abrir menú"
      >
        <Menu className="h-6 w-6" />
      </SheetTrigger>
      <SheetContent side="right" className="w-[85%] sm:max-w-sm bg-brand-cream border-l-brand-black/10">
        <SheetHeader className="text-left">
          <SheetTitle className="flex items-center">
            <Logo variant="stacked" color="dark" />
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-8 flex flex-col gap-1">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block rounded-lg px-4 py-3 text-base font-semibold transition-colors duration-200",
                  isActive
                    ? "bg-brand-black text-brand-cream"
                    : "text-brand-black hover:bg-brand-black/5"
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
