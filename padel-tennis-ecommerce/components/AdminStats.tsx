"use client"

import {
  AlertCircle,
  CheckCircle,
  Clock,
  Package,
  Tag,
} from "lucide-react"

import type { Product } from "@/lib/products"

interface AdminStatsProps {
  products: Product[]
}

export function AdminStats({ products }: AdminStatsProps) {
  const total = products.length
  const padel = products.filter((p) => p.category === "padel").length
  const tenisMesa = products.filter((p) => p.category === "tenis-mesa").length
  const inStock = products.filter((p) => p.in_stock).length
  const outOfStock = total - inStock
  const inOffer = products.filter((p) => p.in_offer).length
  const comingSoon = products.filter((p) => p.coming_soon).length
  const offerPct = total > 0 ? Math.round((inOffer / total) * 100) : 0

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
      {/* Total + per-category breakdown */}
      <StatCard
        label="Productos"
        value={total}
        icon={Package}
        accent="blue-dark"
        footer={
          <span className="text-[11px] text-brand-black/60">
            Padel {padel} · TM {tenisMesa}
          </span>
        }
      />

      {/* Stock health */}
      <StatCard
        label="En stock"
        value={inStock}
        icon={CheckCircle}
        accent={outOfStock > 0 ? "warning" : "success"}
        footer={
          outOfStock > 0 ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-status-warning">
              <AlertCircle className="h-3 w-3" />
              {outOfStock} sin stock
            </span>
          ) : (
            <span className="text-[11px] text-brand-black/60">
              Todo el catálogo disponible
            </span>
          )
        }
      />

      {/* Offers */}
      <StatCard
        label="En oferta"
        value={inOffer}
        icon={Tag}
        accent="orange"
        footer={
          <span className="text-[11px] text-brand-black/60">
            {offerPct}% del catálogo
          </span>
        }
      />

      {/* Coming soon */}
      <StatCard
        label="Próximamente"
        value={comingSoon}
        icon={Clock}
        accent="blue-light"
        footer={
          <span className="text-[11px] text-brand-black/60">
            En camino al catálogo
          </span>
        }
      />
    </div>
  )
}

type Accent = "blue-dark" | "blue-light" | "orange" | "success" | "warning"

const ACCENT_CLASSES: Record<Accent, { bg: string; text: string }> = {
  "blue-dark": { bg: "bg-brand-blue-dark/10", text: "text-brand-blue-dark" },
  "blue-light": { bg: "bg-brand-blue-light/15", text: "text-brand-blue-dark" },
  orange: { bg: "bg-brand-orange/15", text: "text-brand-orange" },
  success: { bg: "bg-[hsl(var(--status-success-bg))]", text: "text-[hsl(var(--status-success-fg))]" },
  warning: { bg: "bg-[hsl(var(--status-warning))]/15", text: "text-[hsl(var(--status-warning))]" },
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  footer,
}: {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  accent: Accent
  footer?: React.ReactNode
}) {
  const colors = ACCENT_CLASSES[accent]
  return (
    <div className="rounded-lg border border-brand-black/10 bg-white p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-brand-black/60">{label}</p>
        <span
          className={`inline-flex h-7 w-7 items-center justify-center rounded-md ${colors.bg}`}
        >
          <Icon className={`h-4 w-4 ${colors.text}`} />
        </span>
      </div>
      <p className="mt-1 text-2xl font-bold leading-none text-brand-black">
        {value}
      </p>
      {footer && <div className="mt-1.5">{footer}</div>}
    </div>
  )
}
