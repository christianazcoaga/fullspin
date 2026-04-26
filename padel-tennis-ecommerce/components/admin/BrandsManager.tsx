"use client"

import { useRef, useState, useTransition } from "react"
import { Plus, Save, Trash2, Upload, X } from "lucide-react"

import {
  createBrandAction,
  deleteBrandAction,
  updateBrandAction,
} from "@/app/admin/brands-actions"
import {
  BRAND_SPORT_LABELS,
  BRAND_SPORTS,
  type Brand,
  type BrandSport,
} from "@/lib/brands"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface BrandsManagerProps {
  initial: Brand[]
}

export default function BrandsManager({ initial }: BrandsManagerProps) {
  const [brands, setBrands] = useState<Brand[]>(initial)
  const [creating, setCreating] = useState(false)

  const grouped = BRAND_SPORTS.map((sport) => ({
    sport,
    items: brands.filter((b) => b.sport === sport),
  }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-brand-black">Marcas</h2>
          <p className="text-xs text-brand-black/60">
            Logos que aparecen en el carrusel de marcas del home, agrupados por deporte.
          </p>
        </div>
        <Button onClick={() => setCreating(true)} size="sm" variant="black">
          <Plus className="h-4 w-4" />
          Nueva marca
        </Button>
      </div>

      {creating && (
        <BrandForm
          mode="create"
          onDone={(b) => {
            if (b) setBrands((prev) => [...prev, b])
            setCreating(false)
          }}
          onCancel={() => setCreating(false)}
        />
      )}

      {grouped.map(({ sport, items }) => (
        <section key={sport} className="rounded-lg border border-brand-black/10 bg-white p-4">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-brand-black/70">
            {BRAND_SPORT_LABELS[sport]}{" "}
            <span className="font-normal text-brand-black/50">({items.length})</span>
          </h3>

          {items.length === 0 ? (
            <p className="text-xs text-brand-black/50">Sin marcas en este deporte.</p>
          ) : (
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((brand) => (
                <li key={brand.id}>
                  <BrandRow
                    brand={brand}
                    onUpdated={(updated) =>
                      setBrands((prev) =>
                        prev.map((b) => (b.id === updated.id ? updated : b))
                      )
                    }
                    onDeleted={() =>
                      setBrands((prev) => prev.filter((b) => b.id !== brand.id))
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  )
}

function BrandRow({
  brand,
  onUpdated,
  onDeleted,
}: {
  brand: Brand
  onUpdated: (b: Brand) => void
  onDeleted: () => void
}) {
  const [editing, setEditing] = useState(false)

  if (editing) {
    return (
      <BrandForm
        mode="edit"
        brand={brand}
        onDone={(updated) => {
          if (updated) onUpdated(updated)
          setEditing(false)
        }}
        onCancel={() => setEditing(false)}
      />
    )
  }

  return (
    <div className="flex items-center gap-3 rounded-md border border-brand-black/10 bg-brand-cream p-2">
      <div className="flex h-12 w-16 items-center justify-center overflow-hidden rounded bg-white">
        {brand.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={brand.logo_url}
            alt={brand.name}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <span className="text-[10px] text-brand-black/40">sin logo</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-brand-black">{brand.name}</p>
        <p className="text-[11px] text-brand-black/55">orden #{brand.display_order}</p>
      </div>
      <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
        Editar
      </Button>
      <DeleteBrandButton brand={brand} onDeleted={onDeleted} />
    </div>
  )
}

function DeleteBrandButton({
  brand,
  onDeleted,
}: {
  brand: Brand
  onDeleted: () => void
}) {
  const [pending, startTransition] = useTransition()

  const handleClick = () => {
    if (!confirm(`¿Eliminar la marca "${brand.name}"?`)) return
    startTransition(async () => {
      const r = await deleteBrandAction(brand.id, brand.logo_url)
      if (r.success) onDeleted()
      else alert(r.error)
    })
  }

  return (
    <Button
      size="sm"
      variant="destructive"
      disabled={pending}
      onClick={handleClick}
      aria-label={`Eliminar ${brand.name}`}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  )
}

function BrandForm({
  mode,
  brand,
  onDone,
  onCancel,
}: {
  mode: "create" | "edit"
  brand?: Brand
  onDone: (brand: Brand | null) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(brand?.name ?? "")
  const [sport, setSport] = useState<BrandSport>(brand?.sport ?? "padel")
  const [order, setOrder] = useState<number>(brand?.display_order ?? 0)
  const [filePreview, setFilePreview] = useState<string | null>(brand?.logo_url ?? null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFilePreview(URL.createObjectURL(f))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.set("sport", sport) // shadcn Select doesn't include hidden input by default
    if (mode === "edit" && brand?.logo_url) fd.set("replace_url", brand.logo_url)

    setError(null)
    startTransition(async () => {
      const result =
        mode === "create"
          ? await createBrandAction(fd)
          : await updateBrandAction(brand!.id, fd)
      if (result.success) {
        onDone(result.data)
      } else {
        setError(result.error)
      }
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-lg border-2 border-dashed border-brand-blue-dark/30 bg-brand-blue-dark/5 p-3"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-20 w-24 shrink-0 items-center justify-center overflow-hidden rounded bg-white border border-brand-black/10">
          {filePreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={filePreview}
              alt=""
              className="max-h-full max-w-full object-contain p-2"
            />
          ) : (
            <span className="text-xs text-brand-black/40">sin logo</span>
          )}
        </div>
        <div className="grid flex-1 grid-cols-2 gap-2">
          <div className="col-span-2">
            <Label htmlFor="brand-name" className="text-xs">
              Nombre
            </Label>
            <Input
              id="brand-name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-9"
            />
          </div>
          <div>
            <Label className="text-xs">Deporte</Label>
            <Select value={sport} onValueChange={(v) => setSport(v as BrandSport)}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BRAND_SPORTS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {BRAND_SPORT_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="brand-order" className="text-xs">
              Orden
            </Label>
            <Input
              id="brand-order"
              name="display_order"
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="h-9"
            />
          </div>
        </div>
      </div>

      <div>
        <Label className="text-xs">Logo</Label>
        <div className="mt-1 flex items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            name="logo"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="h-3.5 w-3.5" />
            {filePreview ? "Cambiar logo" : "Subir logo"}
          </Button>
          <p className="text-[11px] text-brand-black/55">
            PNG/SVG/WebP, fondo transparente preferido.
          </p>
        </div>
      </div>

      {error && (
        <p className="text-xs font-medium text-status-error-fg">{error}</p>
      )}

      <div className="flex gap-2">
        <Button type="submit" size="sm" variant="black" disabled={pending}>
          <Save className="h-3.5 w-3.5" />
          {pending ? "Guardando..." : "Guardar"}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={onCancel}>
          <X className="h-3.5 w-3.5" />
          Cancelar
        </Button>
      </div>
    </form>
  )
}
