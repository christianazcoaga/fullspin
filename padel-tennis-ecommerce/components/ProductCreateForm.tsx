"use client"

import { useMemo, useState } from "react"
import { useFormStatus } from "react-dom"
import type { Brand } from "@/lib/brands"
import type { Product } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImageUpload } from "@/components/image-upload"
import { createProductAction } from "@/app/admin/actions"

interface ProductCreateFormProps {
  onProductCreated: (newProduct: Product) => void
  conversionRate: number
  /** Catalog of registered brands; the marca field is a select over these. */
  brands: Brand[]
}

/** Sorted, deduplicated brand names for the marca <Select>. */
function uniqueBrandNames(brands: Brand[]): string[] {
  return Array.from(new Set(brands.map((b) => b.name)))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "es"))
}

const categories = ["padel", "tenis-mesa", "tenis"]
const categoryNames: { [key: string]: string } = {
  padel: "Padel",
  "tenis-mesa": "Tenis de Mesa", 
  tenis: "Tenis",
}
const subcategories: { [key: string]: string[] } = {
  padel: ["palas", "zapatillas", "pelotas", "bolsos", "ropa", "accesorios"],
  "tenis-mesa": ["paletas", "gomas", "pelotas", "mesas", "ropa", "accesorios"],
  tenis: ["raquetas", "zapatillas", "pelotas", "bolsos", "ropa", "accesorios"],
}

const initialFormData = {
  name: "",
  price: 0,
  description: "",
  category: "padel",
  subcategory: "palas",
  in_stock: true,
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Creando..." : "Crear Producto"}
    </Button>
  )
}

export function ProductCreateForm({
  onProductCreated,
  conversionRate,
  brands,
}: ProductCreateFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [currentCategory, setCurrentCategory] = useState(initialFormData.category)
  const [inStock, setInStock] = useState(initialFormData.in_stock)
  const [isNovelty, setIsNovelty] = useState(false)
  const brandOptions = useMemo(() => uniqueBrandNames(brands), [brands])
  const [marca, setMarca] = useState<string>("")
  const [inOffer, setInOffer] = useState(false)
  const [offerPercent, setOfferPercent] = useState(0)
  const [comingSoon, setComingSoon] = useState(false)
  const [priceArs, setPriceArs] = useState<string>("")
  const [calculatedUsdPrice, setCalculatedUsdPrice] = useState<number>(0)

  const handlePriceArsChange = (value: string) => {
    setPriceArs(value)
    const parsedArs = parseFloat(value)
    if (!isNaN(parsedArs) && parsedArs > 0) {
      const usdPrice = parsedArs / conversionRate
      setCalculatedUsdPrice(usdPrice)
    } else {
      setCalculatedUsdPrice(0)
    }
  }

  const handleCreateAction = async (formData: FormData) => {
    setError(null)
    formData.set("in_stock", inStock ? "true" : "false")
    formData.set("in_offer", inOffer ? "true" : "false")
    formData.set("offer_percent", offerPercent.toString())
    formData.set("coming_soon", comingSoon ? "true" : "false")
    formData.set("marca", marca)
    const productData = {
      name: formData.get("name") as string,
      marca,
      price: parseFloat(priceArs),
      price_usd: calculatedUsdPrice,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      subcategory: formData.get("subcategory") as string,
      in_stock: formData.get("in_stock") === "true",
      is_novelty: isNovelty,
      // Local-store availability + unit count are managed from the
      // dedicated "Stock local" admin tab, never from the create/edit
      // forms. Defaults below mean "not in the local listing yet".
      in_local_stock: false,
      local_stock_count: 0,
      in_offer: inOffer,
      offer_percent: offerPercent,
      coming_soon: comingSoon,
      image: uploadedImageUrl || "",
      additional_images: [] as string[],
      created_at: new Date().toISOString(),
    }
    const result = await createProductAction(productData)
    if (result.success && result.data) {
      onProductCreated(result.data)
    } else {
      setError(result.error || "Ocurrió un error al crear el producto.")
    }
  }

  // A temporary product object to pass to ImageUpload
  // The ID is 0, which signals to our upload action that this is a new product
  const tempProductForUpload: Product = {
    id: 0,
    name: "Nuevo Producto",
    image: uploadedImageUrl || "",
    additional_images: [],
    marca: "",
    category: currentCategory,
    subcategory: "",
    price: 0,
    price_usd: 0,
    description: "",
    in_stock: true,
    in_local_stock: false,
    local_stock_count: 0,
    in_offer: false,
    offer_percent: 0,
    coming_soon: false,
    is_novelty: false,
    created_at: new Date().toISOString(),
  }

  return (
    <div className="space-y-4">
      <form action={handleCreateAction} className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Nombre del Producto</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="marca">Marca</Label>
            <Select value={marca} onValueChange={setMarca} name="marca">
              <SelectTrigger id="marca">
                <SelectValue placeholder="Elegí una marca" />
              </SelectTrigger>
              <SelectContent>
                {brandOptions.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-brand-black/55">
                    No hay marcas cargadas. Agregalas desde la pestaña{" "}
                    <strong>Marcas</strong>.
                  </div>
                ) : (
                  brandOptions.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="price_ars">Precio Base (ARS)</Label>
          <Input
            id="price_ars"
            name="price_ars"
            type="number"
            step="0.01"
            value={priceArs}
            onChange={(e) => handlePriceArsChange(e.target.value)}
            placeholder="Ej: 150000.00"
            required
          />
          {calculatedUsdPrice > 0 && (
            <p className="mt-1.5 text-xs text-brand-black/60">
              ≈ USD {calculatedUsdPrice.toFixed(2)} · Tasa 1 USD ={" "}
              {conversionRate.toLocaleString("es-AR")} ARS
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Descripción</Label>
          <Textarea id="description" name="description" rows={3} />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="category">Categoría</Label>
            <Select
              name="category"
              defaultValue={initialFormData.category}
              onValueChange={setCurrentCategory}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {categoryNames[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="subcategory">Subcategoría</Label>
            <Select name="subcategory" defaultValue={initialFormData.subcategory} key={currentCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una subcategoría" />
              </SelectTrigger>
              <SelectContent>
                {subcategories[currentCategory]?.map((sub) => (
                  <SelectItem key={sub} value={sub}>
                    {sub.charAt(0).toUpperCase() + sub.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1">
          <div className="flex items-center gap-2">
            <Switch id="in_stock" name="in_stock" checked={inStock} onCheckedChange={setInStock} />
            <Label htmlFor="in_stock" className="cursor-pointer text-sm">
              En stock
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="is_novelty"
              name="is_novelty"
              checked={isNovelty}
              onCheckedChange={setIsNovelty}
            />
            <Label
              htmlFor="is_novelty"
              className="cursor-pointer text-sm font-semibold text-brand-blue-dark"
            >
              Novedad
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="in_offer" name="in_offer" checked={inOffer} onCheckedChange={setInOffer} />
            <Label htmlFor="in_offer" className="cursor-pointer text-sm font-semibold text-brand-orange">
              Oferta
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="coming_soon" name="coming_soon" checked={comingSoon} onCheckedChange={setComingSoon} />
            <Label htmlFor="coming_soon" className="cursor-pointer text-sm font-semibold text-brand-blue-dark">
              Próximamente
            </Label>
          </div>
        </div>

        {inOffer && (
          <div className="flex items-center gap-2">
            <Label htmlFor="offer_percent" className="text-sm font-semibold">
              % Descuento
            </Label>
            <Input
              id="offer_percent"
              name="offer_percent"
              type="number"
              min={0}
              max={100}
              step={1}
              value={offerPercent}
              onChange={(e) => setOfferPercent(Math.max(0, Math.min(100, Number(e.target.value))))}
              className="w-24"
            />
            <span className="text-sm text-brand-black/55">%</span>
          </div>
        )}

        <SubmitButton />

        {error && <p className="text-sm font-medium text-status-error-fg">{error}</p>}
      </form>

      {/* Imagen — sección separada por una línea, no por una nueva Card */}
      <div className="border-t border-brand-black/10 pt-4">
        <h3 className="mb-2 text-sm font-semibold text-brand-black">
          Imagen del producto
        </h3>
        <ImageUpload
          product={tempProductForUpload}
          onImageUpdated={setUploadedImageUrl}
        />
      </div>
    </div>
  )
}