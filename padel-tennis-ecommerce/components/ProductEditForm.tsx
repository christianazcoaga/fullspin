"use client"

import { useState } from "react"
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

interface ProductEditFormProps {
  product: Product
}

const categories = ["padel", "tenis-mesa"]
const subcategories: { [key: string]: string[] } = {
  padel: ["palas", "zapatillas", "pelotas", "bolsos", "ropa", "accesorios"],
  "tenis-mesa": ["paletas", "gomas", "pelotas", "mesas", "ropa", "accesorios"],
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="flex-grow">
      {pending ? "Guardando..." : "Guardar Cambios"}
    </Button>
  )
}

export function ProductEditForm({ product }: ProductEditFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [inStock, setInStock] = useState(product.in_stock)

  const handleUpdateAction = async (formData: FormData) => {
    setError(null)
    setSuccess(false)
    formData.set("in_stock", inStock ? "true" : "false")
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
    <Card>
      <CardHeader>
        <CardTitle>Editar Detalles del Producto</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleUpdateAction} className="space-y-4">
          <input type="hidden" name="id" value={product.id} />
          <div>
            <Label htmlFor="name">Nombre del Producto</Label>
            <Input id="name" name="name" defaultValue={product.name} required />
          </div>

          <div>
            <Label htmlFor="marca">Marca</Label>
            <Input id="marca" name="marca" defaultValue={product.marca} />
          </div>

          <div>
            <Label htmlFor="price">Precio (ARS)</Label>
            <Input id="price" name="price" type="number" step="0.01" defaultValue={product.price} required />
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={product.description}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="category">Categoría</Label>
            <Select name="category" defaultValue={product.category} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="subcategory">Subcategoría</Label>
            <Select name="subcategory" defaultValue={product.subcategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una subcategoría" />
              </SelectTrigger>
              <SelectContent>
                {product.category &&
                  subcategories[product.category]?.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub.charAt(0).toUpperCase() + sub.slice(1)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch id="in_stock" name="in_stock" checked={inStock} onCheckedChange={setInStock} />
            <Label htmlFor="in_stock" className="cursor-pointer">
              Disponible en Stock
            </Label>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <SubmitButton />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" disabled={isDeleting}>
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