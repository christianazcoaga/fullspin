"use client"

import { usePathname } from "next/navigation"

import Footer from "./Footer"
import Header from "./Header"
import InlineSearchResults from "./InlineSearchResults"
import { SearchProvider, useSearch } from "./SearchProvider"

const HIDDEN_PREFIXES = ["/admin", "/login"]

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname() ?? "/"
  const hideChrome = HIDDEN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )

  if (hideChrome) return <>{children}</>

  return (
    <SearchProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <SearchAwareMain>{children}</SearchAwareMain>
        <Footer />
      </div>
    </SearchProvider>
  )
}

function SearchAwareMain({ children }: { children: React.ReactNode }) {
  const { isActive } = useSearch()

  return (
    <main className="flex-1">
      {isActive ? <InlineSearchResults /> : children}
    </main>
  )
}
