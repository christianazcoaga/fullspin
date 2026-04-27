export type NavLink = {
  href: string
  label: string
}

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Inicio" },
  { href: "/padel", label: "Padel" },
  { href: "/tenis-mesa", label: "Tenis de Mesa" },
  { href: "/ofertas", label: "Ofertas" },
  { href: "/sobre-nosotros", label: "Sobre nosotros" },
  // /local route exists (productos en stock físico) but is intentionally
  // hidden from the public nav for now. Direct URL access still works.
]
