"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import HeaderSearch from "./HeaderSearch"
import Logo from "./Logo"
import MobileMenu from "./MobileMenu"
import { NAV_LINKS } from "./nav-links"

export default function Header() {
  const pathname = usePathname() ?? "/"

  return (
    <header className="sticky top-0 z-40 w-full border-b border-brand-black/10 bg-brand-cream">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:gap-8 lg:px-8">
        <Link
          href="/"
          aria-label="Ir al inicio"
          className="focus-ring flex items-center transition-opacity duration-200 hover:opacity-80"
        >
          <Logo variant="responsive" color="dark" />
        </Link>

        <div className="hidden flex-1 md:block">
          <HeaderSearch layout="inline" className="mx-auto" />
        </div>

        <nav aria-label="Navegación principal" className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "focus-ring relative rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-200",
                  isActive
                    ? "text-brand-blue-dark"
                    : "text-brand-black/80 hover:text-brand-black"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "pointer-events-none absolute inset-x-3 -bottom-px h-0.5 origin-left bg-brand-blue-dark transition-transform duration-200",
                    isActive ? "scale-x-100" : "scale-x-0"
                  )}
                />
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <MobileMenu />
        </div>
      </div>

      {/* Mobile-only search row, sits below the bar so it does not crowd the logo */}
      <div className="border-t border-brand-black/5 bg-brand-cream px-4 pb-3 pt-2 md:hidden">
        <HeaderSearch layout="full" />
      </div>
    </header>
  )
}
