"use client"

import { useState, useEffect } from "react"
import { type Product } from "@/lib/products"
import { ImageUpload } from "@/components/image-upload"
import { ProductEditForm } from "@/components/ProductEditForm"
import { ProductCreateForm } from "@/components/ProductCreateForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, PlusCircle, LogOut } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

type AdminView = {
  mode: "list" | "edit" | "create"
  selectedProduct: Product | null
}

interface AdminClientPageProps {
  initialProducts: Product[]
}

export default function AdminClientPage({ initialProducts }: AdminClientPageProps) {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [view, setView] = useState<AdminView>({ mode: "list", selectedProduct: null })

  // When the server component passes new initialProducts, update the state
  useEffect(() => {
    setProducts(initialProducts)
    setFilteredProducts(initialProducts)
  }, [initialProducts])


  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(products)
    }
  }, [products, searchQuery])

  const handleImageUpdated = (productId: number, newImageUrl: string) => {
    const updater = (p: Product) => (p.id === productId ? { ...p, image: newImageUrl } : p)
    setProducts((prev) => prev.map(updater))
    if (view.selectedProduct?.id === productId) {
      setView(prev => ({ ...prev, selectedProduct: updater(prev.selectedProduct!)}))
    }
  }

  const handleProductCreated = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev])
    setView({ mode: 'edit', selectedProduct: newProduct })
  }

  const handleSelectProduct = (product: Product) => {
    setView({ mode: "edit", selectedProduct: product })
  }

  const handleShowCreateForm = () => {
    setView({ mode: "create", selectedProduct: null })
  }
  
  // When a product is deleted via server action, the page will re-render
  // with the updated list. We check if the currently selected product
  // still exists. If not, we go back to the list view.
  useEffect(() => {
    if (view.mode === 'edit' && view.selectedProduct) {
      const productStillExists = initialProducts.some(p => p.id === view.selectedProduct!.id)
      if (!productStillExists) {
        setView({ mode: 'list', selectedProduct: null})
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialProducts, view.selectedProduct])


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Administración de Productos</h1>
            <div className="flex gap-2">
              <Button onClick={handleShowCreateForm}><PlusCircle className="h-4 w-4 mr-2" />Crear Nuevo Producto</Button>
              <Link href="/">
                <Button variant="outline">Volver a la tienda</Button>
              </Link>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" /> Cerrar sesión
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Productos ({filteredProducts.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        view.selectedProduct?.id === product.id
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleSelectProduct(product)}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panel de subida de imagen y edición */}
          <div>
            {view.mode === 'edit' && view.selectedProduct && (
              <div className="space-y-8">
                <ImageUpload
                  product={view.selectedProduct}
                  onImageUpdated={(newImageUrl) => handleImageUpdated(view.selectedProduct!.id, newImageUrl)}
                />
                <ProductEditForm 
                  product={view.selectedProduct} 
                />
              </div>
            )}
            
            {view.mode === 'create' && (
              <ProductCreateForm onProductCreated={handleProductCreated} />
            )}
            
            {view.mode === 'list' && (
              <Card>
                <CardContent className="p-8 text-center h-full flex items-center justify-center">
                  <p className="text-gray-500">Selecciona un producto para editarlo o crea uno nuevo.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 