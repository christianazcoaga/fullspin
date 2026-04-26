"use client"

import { useRef, useState, useTransition } from "react"
import { Plus, Save, Trash2, Upload, X } from "lucide-react"

import {
  createCarouselSlideAction,
  deleteCarouselSlideAction,
  updateCarouselSlideAction,
} from "@/app/admin/carousel-actions"
import type { CarouselSlide } from "@/lib/home-carousel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CarouselManagerProps {
  initial: CarouselSlide[]
}

export default function CarouselManager({ initial }: CarouselManagerProps) {
  const [slides, setSlides] = useState<CarouselSlide[]>(initial)
  const [creating, setCreating] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-brand-black">Carrusel del home</h2>
          <p className="text-xs text-brand-black/60">
            Banners promocionales que aparecen al principio de la home, en orden.
          </p>
        </div>
        <Button onClick={() => setCreating(true)} size="sm" variant="black">
          <Plus className="h-4 w-4" />
          Nuevo banner
        </Button>
      </div>

      {creating && (
        <SlideForm
          mode="create"
          onDone={(s) => {
            if (s) {
              setSlides((prev) =>
                [...prev, s].sort(
                  (a, b) =>
                    a.display_order - b.display_order || a.id - b.id
                )
              )
            }
            setCreating(false)
          }}
          onCancel={() => setCreating(false)}
        />
      )}

      {slides.length === 0 && !creating ? (
        <div className="rounded-lg border border-dashed border-brand-black/20 bg-white p-6 text-center text-sm text-brand-black/60">
          No hay banners todavía. Tocá <strong>"Nuevo banner"</strong> para
          empezar.
        </div>
      ) : (
        <ul className="space-y-2">
          {slides.map((slide) => (
            <li key={slide.id}>
              <SlideRow
                slide={slide}
                onUpdated={(updated) =>
                  setSlides((prev) =>
                    prev
                      .map((s) => (s.id === updated.id ? updated : s))
                      .sort(
                        (a, b) =>
                          a.display_order - b.display_order || a.id - b.id
                      )
                  )
                }
                onDeleted={() =>
                  setSlides((prev) => prev.filter((s) => s.id !== slide.id))
                }
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function SlideRow({
  slide,
  onUpdated,
  onDeleted,
}: {
  slide: CarouselSlide
  onUpdated: (s: CarouselSlide) => void
  onDeleted: () => void
}) {
  const [editing, setEditing] = useState(false)

  if (editing) {
    return (
      <SlideForm
        mode="edit"
        slide={slide}
        onDone={(updated) => {
          if (updated) onUpdated(updated)
          setEditing(false)
        }}
        onCancel={() => setEditing(false)}
      />
    )
  }

  return (
    <div className="flex items-center gap-3 rounded-md border border-brand-black/10 bg-white p-2">
      <div className="aspect-[16/9] h-16 shrink-0 overflow-hidden rounded bg-brand-cream">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={slide.image_url}
          alt={slide.alt}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-brand-black">
          {slide.alt || <em className="text-brand-black/50">sin descripción</em>}
        </p>
        <p className="text-[11px] text-brand-black/55">orden #{slide.display_order}</p>
      </div>
      <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
        Editar
      </Button>
      <DeleteSlideButton slide={slide} onDeleted={onDeleted} />
    </div>
  )
}

function DeleteSlideButton({
  slide,
  onDeleted,
}: {
  slide: CarouselSlide
  onDeleted: () => void
}) {
  const [pending, startTransition] = useTransition()

  const handleClick = () => {
    if (!confirm("¿Eliminar este banner?")) return
    startTransition(async () => {
      const r = await deleteCarouselSlideAction(slide.id, slide.image_url)
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
      aria-label="Eliminar banner"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  )
}

function SlideForm({
  mode,
  slide,
  onDone,
  onCancel,
}: {
  mode: "create" | "edit"
  slide?: CarouselSlide
  onDone: (slide: CarouselSlide | null) => void
  onCancel: () => void
}) {
  const [alt, setAlt] = useState(slide?.alt ?? "")
  const [order, setOrder] = useState<number>(slide?.display_order ?? 0)
  const [filePreview, setFilePreview] = useState<string | null>(slide?.image_url ?? null)
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
    if (mode === "edit" && slide?.image_url) fd.set("replace_url", slide.image_url)

    setError(null)
    startTransition(async () => {
      const result =
        mode === "create"
          ? await createCarouselSlideAction(fd)
          : await updateCarouselSlideAction(slide!.id, fd)
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
      <div className="aspect-[16/9] overflow-hidden rounded-md border border-brand-black/10 bg-white">
        {filePreview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={filePreview}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-brand-black/50">
            Subí una imagen para previsualizar
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <Label htmlFor="slide-alt" className="text-xs">
            Descripción (alt)
          </Label>
          <Input
            id="slide-alt"
            name="alt"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Adidas Metalbone 2026"
            className="h-9"
          />
        </div>
        <div>
          <Label htmlFor="slide-order" className="text-xs">
            Orden
          </Label>
          <Input
            id="slide-order"
            name="display_order"
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="h-9"
          />
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        name="image"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        required={mode === "create"}
      />
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="h-3.5 w-3.5" />
          {filePreview ? "Cambiar imagen" : "Subir imagen"}
        </Button>
        <p className="text-[11px] text-brand-black/55">
          Banner full-width. Aspect ~16:9 recomendado.
        </p>
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
