"use client"

import Link from "next/link"
import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="bg-brand-cream py-24">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-status-error-bg text-status-error-fg">
          <AlertTriangle className="h-8 w-8" aria-hidden="true" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-black/60">
          Algo salió mal
        </p>
        <h1 className="mt-3 text-balance text-[clamp(2rem,5vw,3rem)] font-bold leading-tight tracking-tight text-brand-black">
          Ocurrió un error inesperado
        </h1>
        <p className="mt-4 text-base text-brand-black/70">
          Probá recargar la página. Si el problema persiste, escribinos por
          WhatsApp y lo resolvemos.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" variant="black" onClick={() => reset()}>
            Intentar de nuevo
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>

        {error.digest && (
          <p className="mt-8 text-xs text-brand-black/50">
            Código de referencia: <span className="font-mono">{error.digest}</span>
          </p>
        )}
      </div>
    </div>
  )
}
