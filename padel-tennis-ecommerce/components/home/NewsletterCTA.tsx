"use client"

import { Loader2, Mail, MessageCircle } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  subscribePhoneToNewsletter,
  subscribeToNewsletter,
} from "@/lib/newsletter"

const BENEFITS = [
  "Ofertas especiales antes que nadie",
  "Consejos de equipamiento personalizado",
  "Novedades de productos",
  "Descuentos exclusivos",
]

type ChannelType = "email" | "phone"
type Status = "idle" | "success" | "error"

export default function NewsletterCTA() {
  const [channel, setChannel] = useState<ChannelType>("email")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<Status>("idle")
  const [message, setMessage] = useState("")

  // Auto-clear status after 5s
  useEffect(() => {
    if (status === "idle") return
    const t = setTimeout(() => {
      setStatus("idle")
      setMessage("")
    }, 5000)
    return () => clearTimeout(t)
  }, [status])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (channel === "email" && !email.trim()) {
      setStatus("error")
      setMessage("Por favor ingresá tu email.")
      return
    }
    if (channel === "phone" && !phone.trim()) {
      setStatus("error")
      setMessage("Por favor ingresá tu número de teléfono.")
      return
    }

    setSubmitting(true)
    setStatus("idle")
    try {
      const result =
        channel === "email"
          ? await subscribeToNewsletter(email.trim())
          : await subscribePhoneToNewsletter(phone.trim())

      if (result.success) {
        setStatus("success")
        setMessage(result.message)
        if (channel === "email") setEmail("")
        else setPhone("")
      } else {
        setStatus("error")
        setMessage(result.message)
      }
    } catch (err) {
      console.error("Newsletter subscribe failed:", err)
      setStatus("error")
      setMessage("Error al suscribirse. Por favor intentá nuevamente.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section
      className="bg-brand-blue-dark py-20"
      aria-labelledby="newsletter-heading"
    >
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2
          id="newsletter-heading"
          className="text-balance text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.1] tracking-tight text-white"
        >
          Mantenete informado
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-white/85 sm:text-lg">
          Recibí las últimas ofertas, novedades y consejos de equipamiento.
        </p>

        <div className="mx-auto mt-12 max-w-2xl rounded-2xl bg-white p-8 shadow-md">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="text-left">
              <h3 className="text-lg font-bold text-brand-black">
                Beneficios exclusivos
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-brand-black/70">
                {BENEFITS.map((b) => (
                  <li key={b} className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-blue-dark"
                    />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col">
              <p className="mb-4 text-sm text-brand-black/70">
                Es gratis y sin spam.
              </p>

              <div className="mb-4 flex gap-2 rounded-lg bg-brand-cream p-1">
                <button
                  type="button"
                  onClick={() => setChannel("email")}
                  aria-pressed={channel === "email"}
                  className={`flex-1 rounded-md px-3 py-2 text-xs font-semibold transition-colors duration-200 ${
                    channel === "email"
                      ? "bg-brand-black text-brand-cream"
                      : "text-brand-black/70 hover:text-brand-black"
                  }`}
                >
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setChannel("phone")}
                  aria-pressed={channel === "phone"}
                  className={`flex-1 rounded-md px-3 py-2 text-xs font-semibold transition-colors duration-200 ${
                    channel === "phone"
                      ? "bg-brand-black text-brand-cream"
                      : "text-brand-black/70 hover:text-brand-black"
                  }`}
                >
                  WhatsApp
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {channel === "email" ? (
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={submitting}
                    aria-label="Email"
                    className="w-full rounded-lg border border-brand-black/15 bg-white px-4 py-3 text-sm text-brand-black placeholder:text-brand-black/50 focus:border-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-brand-blue-dark/30 disabled:opacity-50"
                  />
                ) : (
                  <input
                    type="tel"
                    placeholder="+54 370 510-3672"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={submitting}
                    aria-label="Teléfono"
                    className="w-full rounded-lg border border-brand-black/15 bg-white px-4 py-3 text-sm text-brand-black placeholder:text-brand-black/50 focus:border-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-brand-blue-dark/30 disabled:opacity-50"
                  />
                )}

                <Button
                  type="submit"
                  variant="neon"
                  size="lg"
                  disabled={submitting}
                  className="w-full"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Suscribiendo...
                    </>
                  ) : channel === "email" ? (
                    <>
                      <Mail className="h-5 w-5" />
                      Suscribirme
                    </>
                  ) : (
                    <>
                      <MessageCircle className="h-5 w-5" />
                      Suscribirme
                    </>
                  )}
                </Button>
              </form>

              {message && (
                <p
                  role="status"
                  aria-live="polite"
                  className={`mt-3 rounded-lg px-3 py-2 text-xs ${
                    status === "success"
                      ? "bg-status-success-bg text-status-success-fg"
                      : "bg-status-error-bg text-status-error-fg"
                  }`}
                >
                  {message}
                </p>
              )}

              <p className="mt-4 text-xs text-brand-black/50">
                Al suscribirte, aceptás recibir comunicaciones promocionales.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
