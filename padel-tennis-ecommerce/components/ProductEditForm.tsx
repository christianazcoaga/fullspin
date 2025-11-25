"use client"

import { useState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import type { Product } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { updateProductAction, deleteProductAction } from "@/app/admin/actions"
import { useRouter } from "next/navigation"
import { convertUsdToArs } from "@/lib/price-utils"

interface ProductEditFormProps {
  product: Product
  conversionRate: number
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

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="flex-grow">
      {pending ? "Guardando..." : "Guardar Cambios"}
    </Button>
  )
}

export function ProductEditForm({ product, conversionRate }: ProductEditFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [inStock, setInStock] = useState(product.in_stock)
  const [inOffer, setInOffer] = useState(product.in_offer ?? false)
  const [offerPercent, setOfferPercent] = useState(product.offer_percent ?? 0)
  const [category, setCategory] = useState(product.category)
  const [subcategory, setSubcategory] = useState(product.subcategory)
  const [name, setName] = useState(product.name)
  const [marca, setMarca] = useState(product.marca)
  const [priceArs, setPriceArs] = useState(product.price)
  const [calculatedUsdPrice, setCalculatedUsdPrice] = useState(product.price_usd || 0)
  const [description, setDescription] = useState(product.description)

  const handlePriceArsChange = (value: number) => {
    setPriceArs(value)
    if (value > 0) {
      const usdPrice = value / conversionRate
      setCalculatedUsdPrice(usdPrice)
    }
  }

  // Sincroniza los estados locales con el producto seleccionado
  useEffect(() => {
    setInStock(product.in_stock)
    setInOffer(product.in_offer ?? false)
    setOfferPercent(product.offer_percent ?? 0)
    setCategory(product.category)
    // Si la subcategoría del producto no es válida para la categoría, selecciona la primera subcategoría
    if (product.category && subcategories[product.category] && subcategories[product.category].length > 0) {
      if (subcategories[product.category].includes(product.subcategory)) {
        setSubcategory(product.subcategory)
      } else {
        setSubcategory(subcategories[product.category][0])
      }
    } else {
      setSubcategory("")
    }
    setName(product.name)
    setMarca(product.marca)
    setPriceArs(product.price)
    setCalculatedUsdPrice(product.price_usd || 0)
    setDescription(product.description)
  }, [product])

  const handleUpdateAction = async (formData: FormData) => {
    setError(null)
    setSuccess(false)
    formData.set("in_stock", inStock ? "true" : "false")
    formData.set("in_offer", inOffer ? "true" : "false")
    formData.set("offer_percent", offerPercent.toString())
    formData.set("price", priceArs.toString())
    formData.set("price_usd", calculatedUsdPrice.toString())
    const result = await updateProductAction(product.id, formData)
    if (result.success) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } else {
      setError(result.error || "Ocurrió un error inesperado.")
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)
    const result = await deleteProductAction(product.id, product.image)
    if (!result.success) {
      setError(result.error || "Ocurrió un error al eliminar.")
      setIsDeleting(false)
    }
    // The page will be revalidated by the action, so no need to router.push or refresh
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle>Editar Detalles del Producto</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <form action={handleUpdateAction} className="space-y-3">
          <input type="hidden" name="id" value={product.id} />
          <div>
            <Label htmlFor="name" className="text-sm">Nombre del Producto</Label>
            <Input id="name" name="name" value={name} onChange={e => setName(e.target.value)} required className="h-9" />
          </div>

          <div>
            <Label htmlFor="marca" className="text-sm">Marca</Label>
            <Input id="marca" name="marca" value={marca} onChange={e => setMarca(e.target.value)} className="h-9" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price_ars" className="text-sm">Precio Base (ARS)</Label>
            <Input 
              id="price_ars" 
              name="price_ars" 
              type="number" 
              step="0.01" 
              value={priceArs}
              onChange={(e) => handlePriceArsChange(Number(e.target.value))}
              required 
              className="h-9" 
            />
            {calculatedUsdPrice > 0 && (
              <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                <p className="text-xs text-blue-900">
                  <span className="font-semibold">Precio calculado en USD:</span>{" "}
                  ${calculatedUsdPrice.toFixed(2)}
                </p>
                <p className="text-xs text-blue-700">
                  Tasa: 1 USD = {conversionRate.toLocaleString('es-AR')} ARS
                </p>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="description" className="text-sm">Descripción</Label>
            <Textarea id="description" name="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="min-h-[60px]" />
          </div>

          <div>
            <Label htmlFor="category" className="text-sm">Categoría</Label>
            <Select name="category" value={category} onValueChange={(newCategory) => {
              setCategory(newCategory);
              if (subcategories[newCategory] && subcategories[newCategory].length > 0) {
                setSubcategory(subcategories[newCategory][0]);
              } else {
                setSubcategory("");
              }
            }} required>
              <SelectTrigger className="h-9">
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
            <Label htmlFor="subcategory" className="text-sm">Subcategoría</Label>
            <Select name="subcategory" value={subcategory} onValueChange={setSubcategory} required>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Selecciona una subcategoría" />
              </SelectTrigger>
              <SelectContent>
                {category &&
                  subcategories[category]?.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub.charAt(0).toUpperCase() + sub.slice(1)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <Switch id="in_stock" name="in_stock" checked={inStock} onCheckedChange={setInStock} />
            <Label htmlFor="in_stock" className="cursor-pointer text-sm">
              Disponible en Stock
            </Label>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <Switch id="in_offer" name="in_offer" checked={inOffer} onCheckedChange={setInOffer} />
            <Label htmlFor="in_offer" className="cursor-pointer text-red-600 font-semibold text-sm">
              Oferta del Mes
            </Label>
          </div>
          
          {inOffer && (
            <div className="flex items-center space-x-2 pt-1">
              <Label htmlFor="offer_percent" className="font-semibold text-sm">% Descuento</Label>
              <Input
                id="offer_percent"
                name="offer_percent"
                type="number"
                min={0}
                max={100}
                step={1}
                value={offerPercent}
                onChange={e => setOfferPercent(Math.max(0, Math.min(100, Number(e.target.value))))}
                className="w-20 h-9"
              />
              <span className="text-gray-500 text-sm">%</span>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <SubmitButton />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" disabled={isDeleting} className="h-9">
                  {isDeleting ? "Eliminando..." : "Eliminar Producto"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente el producto
                    y su imagen asociada del servidor.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                    Sí, eliminar producto
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {success && <p className="text-sm text-green-600 text-center">¡Producto actualizado con éxito!</p>}
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        </form>
      </CardContent>
    </Card>
  )
} 