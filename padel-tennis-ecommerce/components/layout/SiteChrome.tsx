"use client"

import { usePathname } from "next/navigation"

import Footer from "./Footer"
import Header from "./Header"

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
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
