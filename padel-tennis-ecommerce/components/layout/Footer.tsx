import Link from "next/link"
import { Mail } from "lucide-react"

import Logo from "./Logo"

const WHATSAPP_HREF = "https://wa.me/543705103672"
const INSTAGRAM_HREF = "https://www.instagram.com/fullspinargentina/"
const EMAIL = "info@fullspin.com.ar"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-brand-black text-brand-cream">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo variant="full" color="light" />
            <p className="mt-5 max-w-md text-base leading-relaxed text-brand-cream/70">
              Tu tienda especializada en equipamiento deportivo de primera calidad
              para padel, tenis y tenis de mesa.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-cream">
              Categorías
            </h3>
            <ul className="space-y-2 text-sm text-brand-cream/70">
              <li>
                <Link
                  href="/padel"
                  className="transition-colors hover:text-brand-blue-light"
                >
                  Padel
                </Link>
              </li>
              <li>
                <Link
                  href="/tenis"
                  className="transition-colors hover:text-brand-blue-light"
                >
                  Tenis
                </Link>
              </li>
              <li>
                <Link
                  href="/tenis-mesa"
                  className="transition-colors hover:text-brand-blue-light"
                >
                  Tenis de Mesa
                </Link>
              </li>
              <li>
                <Link
                  href="/ofertas"
                  className="transition-colors hover:text-brand-blue-light"
                >
                  Ofertas
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-cream">
              Contacto
            </h3>
            <ul className="space-y-3 text-sm text-brand-cream/70">
              <li>
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-brand-blue-light"
                >
                  <svg
                    className="h-4 w-4 text-brand-neon"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                  +54 370 510-3672
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-brand-blue-light"
                >
                  <Mail className="h-4 w-4 text-brand-blue-light" />
                  {EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={INSTAGRAM_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-brand-blue-light"
                >
                  <svg
                    className="h-4 w-4 text-brand-blue-light"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 2.75a5.75 5.75 0 1 1-5.75 5.75 5.75 5.75 0 0 1 5.75-5.75zm0 1.5a4.25 4.25 0 1 0 4.25 4.25A4.25 4.25 0 0 0 12 5.75zm5.25 1.25a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" />
                  </svg>
                  @fullspinargentina
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-brand-cream/10 pt-6 text-center text-xs text-brand-cream/60">
          <p>&copy; {year} FullSpin. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
