"use client"

import { useState, useEffect, useRef } from "react"
import { type Product } from "@/lib/products"
import type { Brand } from "@/lib/brands"
import type { CarouselSlide } from "@/lib/home-carousel"
import { ImageUpload } from "@/components/image-upload"
import { ProductEditForm } from "@/components/ProductEditForm"
import { ProductGalleryEditor } from "@/components/ProductGalleryEditor"
import { ProductCreateForm } from "@/components/ProductCreateForm"
import { AdminStats } from "@/components/AdminStats"
import { AdminLoading } from "@/components/AdminLoading"
import { ConversionRateManager } from "@/components/ConversionRateManager"
import BrandsManager from "@/components/admin/BrandsManager"
import CarouselManager from "@/components/admin/CarouselManager"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  PlusCircle,
  LogOut,
  Package,
  Grid3X3,
  List,
  Eye,
  Edit,
  RefreshCw,
  Tag,
  Images,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { handleAuthError } from "@/lib/supabase/handleAuthError"
import Image from "next/image"

type AdminView = {
  mode: "list" | "edit" | "create"
  selectedProduct: Product | null
}

type ViewMode = "grid" | "list"

interface AdminClientPageProps {
  initialProducts: Product[]
  conversionRate: number
  initialBrands: Brand[]
  initialCarouselSlides: CarouselSlide[]
}

export default function AdminClientPage({
  initialProducts,
  conversionRate,
  initialBrands,
  initialCarouselSlides,
}: AdminClientPageProps) {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [view, setView] = useState<AdminView>({ mode: "list", selectedProduct: null })
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Referencias para el scroll automático
  const productListRef = useRef<HTMLDivElement>(null)
  const selectedProductRef = useRef<HTMLDivElement>(null)
  const editPanelRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)

  // When the server component passes new initialProducts, update the state
  useEffect(() => {
    setProducts(initialProducts)
    setFilteredProducts(initialProducts)
  }, [initialProducts])

  // Función para hacer scroll automático al producto seleccionado
  const scrollToSelectedProduct = () => {
    if (selectedProductRef.current && productListRef.current) {
      const productElement = selectedProductRef.current
      
      // Hacer scroll suave hasta el producto seleccionado
      productElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  }

  // Efecto para hacer scroll automático cuando se selecciona un producto
  useEffect(() => {
    // Removido el scroll automático al seleccionar producto
  }, [view.selectedProduct])

  // Efecto para agregar el event listener de scroll al panel de edición
  useEffect(() => {
    const editPanel = editPanelRef.current
    if (editPanel && view.selectedProduct) {
      editPanel.addEventListener('scroll', handleEditPanelScroll, { passive: true })
      
      return () => {
        editPanel.removeEventListener('scroll', handleEditPanelScroll)
      }
    }
  }, [view.selectedProduct])

  // Función para manejar el scroll del panel de edición - tiempo real
  const handleEditPanelScroll = () => {
    if (editPanelRef.current && view.selectedProduct) {
      // Cancelar frame anterior si existe
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      
      // Usar requestAnimationFrame para scroll suave y continuo
      animationFrameRef.current = requestAnimationFrame(() => {
        scrollToSelectedProduct()
      })
    }
  }

  // Cancelar el animation frame pendiente al desmontar.
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    try {
      await supabase.auth.signOut()
    } catch (error) {
      await handleAuthError(error)
    }
    router.push("/login")
  }

  useEffect(() => {
    let filtered = products

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.marca?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter(product => product.category === categoryFilter)
    }

    setFilteredProducts(filtered)
  }, [products, searchQuery, categoryFilter])

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

  const handleRefreshProducts = async () => {
    setIsRefreshing(true)
    try {
      // Simular un refresh - en una implementación real, aquí harías una nueva llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Los productos se actualizarán automáticamente cuando el componente padre se re-renderice
    } catch (error) {
      console.error("Error refreshing products:", error)
    } finally {
      setIsRefreshing(false)
    }
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



  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-AR').replace(/,/g, '.')}`
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="mx-auto max-w-7xl px-3 py-3 sm:px-4 sm:py-4 lg:px-8">
        {/* Header — title + actions in a single row on desktop */}
        <div className="mb-3 space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-brand-black sm:text-2xl">
                Panel de Administración
              </h1>
              <p className="text-xs text-brand-black/60 sm:text-sm">
                Gestioná productos, imágenes y contenido del catálogo.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleRefreshProducts}
                variant="outline"
                disabled={isRefreshing}
                size="sm"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">
                  {isRefreshing ? "Actualizando..." : "Actualizar"}
                </span>
              </Button>
              <Button onClick={handleShowCreateForm} size="sm" variant="black">
                <PlusCircle className="h-3.5 w-3.5" />
                Nuevo
              </Button>
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Eye className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Tienda</span>
                </Button>
              </Link>
              <Button variant="destructive" onClick={handleLogout} size="sm">
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Salir</span>
              </Button>
            </div>
          </div>

          <ConversionRateManager
            initialRate={conversionRate}
            productCount={products.length}
          />

          <AdminStats products={products} />
        </div>

        <Tabs defaultValue="products" className="space-y-3">
          <TabsList className="grid w-full grid-cols-3 sm:w-auto sm:inline-flex">
            <TabsTrigger value="products" className="gap-2 text-xs sm:text-sm">
              <Package className="h-3.5 w-3.5" />
              Productos
            </TabsTrigger>
            <TabsTrigger value="brands" className="gap-2 text-xs sm:text-sm">
              <Tag className="h-3.5 w-3.5" />
              Marcas
            </TabsTrigger>
            <TabsTrigger value="carousel" className="gap-2 text-xs sm:text-sm">
              <Images className="h-3.5 w-3.5" />
              Carrusel
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-3">

          {/* Search + filter on a single row */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-black/40" />
              <Input
                type="text"
                placeholder="Buscar por nombre, marca o categoría..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="flex-1 rounded-md border border-brand-black/10 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-dark"
              >
                <option value="all">Todas las categorías</option>
                <option value="padel">Padel</option>
                <option value="tenis-mesa">Tenis de Mesa</option>
                <option value="tenis">Tenis</option>
              </select>
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
                size="sm"
                aria-label={viewMode === "list" ? "Ver como grid" : "Ver como lista"}
              >
                {viewMode === "list" ? (
                  <Grid3X3 className="h-4 w-4" />
                ) : (
                  <List className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

        {/* Mobile: Stack vertically */}
        <div className="block lg:hidden space-y-3">
          {/* Lista de productos - Mobile */}
          <Card className="bg-white border border-brand-black/10">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold">
                  Productos ({filteredProducts.length})
                </CardTitle>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                  {categoryFilter === "all" ? "Todas" : categoryFilter === "padel" ? "Padel" : categoryFilter === "tenis-mesa" ? "Tenis de Mesa" : "Tenis"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {isRefreshing ? (
                <AdminLoading type="list" count={4} />
              ) : viewMode === "list" ? (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto" ref={productListRef}>
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                        view.selectedProduct?.id === product.id
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300 bg-white/60"
                      }`}
                      onClick={() => handleSelectProduct(product)}
                      ref={view.selectedProduct?.id === product.id ? selectedProductRef : null}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={56}
                            height={56}
                            className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg shadow-sm"
                          />
                          {product.in_offer && (
                            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs">
                              -{product.offer_percent}%
                            </Badge>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                              {product.name}
                            </h3>
                            {!product.in_stock && (
                              <Badge variant="outline" className="text-xs">
                                Sin Stock
                              </Badge>
                            )}
                            {product.coming_soon && (
                              <Badge className="bg-purple-100 text-purple-700 text-xs">
                                Proximamente
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mb-1">{product.marca}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {product.category === "padel" ? "Padel" : product.category === "tenis" ? "Tenis" : "Tenis de Mesa"}
                            </Badge>
                            <span className="text-sm font-medium text-gray-900">
                              {formatPrice(product.price)}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Edit className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            ID: {product.id}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto" ref={productListRef}>
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                        view.selectedProduct?.id === product.id
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300 bg-white/60"
                      }`}
                      onClick={() => handleSelectProduct(product)}
                      ref={view.selectedProduct?.id === product.id ? selectedProductRef : null}
                    >
                      <div className="relative mb-2">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-20 object-cover rounded-lg shadow-sm"
                        />
                        {product.in_offer && (
                          <Badge className="absolute top-1 right-1 bg-red-500 text-white text-xs">
                            -{product.offer_percent}%
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 text-xs mb-1 truncate">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2">{product.marca}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {product.category === "padel" ? "Padel" : product.category === "tenis" ? "Tenis" : "Tenis de Mesa"}
                        </Badge>
                        <span className="text-xs font-medium text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Panel de edición - Mobile */}
          {view.mode === 'edit' && view.selectedProduct && (
            <div className="space-y-3" ref={editPanelRef}>
              <Card className="bg-white border border-brand-black/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Edit className="h-5 w-5" />
                    Editar Producto
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 mb-1">
                        {view.selectedProduct.name}
                      </p>
                      <p className="text-xs text-blue-700">
                        ID: {view.selectedProduct.id} • {view.selectedProduct.marca}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <ImageUpload
                product={view.selectedProduct}
                onImageUpdated={(newImageUrl) => handleImageUpdated(view.selectedProduct!.id, newImageUrl)}
              />

              <ProductGalleryEditor
                key={view.selectedProduct.id}
                product={view.selectedProduct}
              />

              <ProductEditForm
                product={view.selectedProduct}
                conversionRate={conversionRate}
                brands={initialBrands}
              />
            </div>
          )}

          {view.mode === 'create' && (
            <Card className="bg-white border border-brand-black/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <PlusCircle className="h-5 w-5" />
                  Crear Nuevo Producto
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ProductCreateForm
                  onProductCreated={handleProductCreated}
                  conversionRate={conversionRate}
                  brands={initialBrands}
                />
              </CardContent>
            </Card>
          )}

          {view.mode === 'list' && (
            <Card className="bg-white border border-brand-black/10">
              <CardContent className="p-6 text-center">
                <Package className="h-12 w-12 text-gray-300 mb-3" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Selecciona un producto
                </h3>
                <p className="text-gray-500 mb-4 text-sm">
                  Elige un producto de la lista para editarlo o crea uno nuevo.
                </p>
                <Button onClick={handleShowCreateForm} className="bg-green-600 hover:bg-green-700">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Crear Producto
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-6">
          {/* Lista de productos - Desktop */}
          <div className="lg:col-span-3">
            <Card className="bg-white border border-brand-black/10">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold">
                    Productos ({filteredProducts.length})
                  </CardTitle>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {categoryFilter === "all" ? "Todas" : categoryFilter === "padel" ? "Padel" : categoryFilter === "tenis-mesa" ? "Tenis de Mesa" : "Tenis"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {isRefreshing ? (
                  <AdminLoading type="list" count={4} />
                ) : viewMode === "list" ? (
                  <div className="space-y-3 max-h-[calc(100vh-260px)] overflow-y-auto" ref={productListRef}>
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                          view.selectedProduct?.id === product.id
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-200 hover:border-gray-300 bg-white/60"
                        }`}
                        onClick={() => handleSelectProduct(product)}
                        ref={view.selectedProduct?.id === product.id ? selectedProductRef : null}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              width={64}
                              height={64}
                              className="w-14 h-14 object-cover rounded-lg shadow-sm"
                            />
                            {product.in_offer && (
                              <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs">
                                -{product.offer_percent}%
                              </Badge>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-semibold text-gray-900 truncate">
                                {product.name}
                              </h3>
                              {!product.in_stock && (
                                <Badge variant="outline" className="text-xs">
                                  Sin Stock
                                </Badge>
                              )}
                              {product.coming_soon && (
                                <Badge className="bg-purple-100 text-purple-700 text-xs">
                                  Proximamente
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mb-1">{product.marca}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {product.category === "padel" ? "Padel" : product.category === "tenis" ? "Tenis" : "Tenis de Mesa"}
                              </Badge>
                              <span className="text-sm font-medium text-gray-900">
                                {formatPrice(product.price)}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Edit className="h-4 w-4 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              ID: {product.id}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[calc(100vh-260px)] overflow-y-auto" ref={productListRef}>
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                          view.selectedProduct?.id === product.id
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-200 hover:border-gray-300 bg-white/60"
                        }`}
                        onClick={() => handleSelectProduct(product)}
                        ref={view.selectedProduct?.id === product.id ? selectedProductRef : null}
                      >
                        <div className="relative mb-2">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={200}
                            height={80}
                            className="w-full h-20 object-cover rounded-lg shadow-sm"
                          />
                          {product.in_offer && (
                            <Badge className="absolute top-1 right-1 bg-red-500 text-white text-xs">
                              -{product.offer_percent}%
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-600 mb-2">{product.marca}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {product.category === "padel" ? "Padel" : product.category === "tenis" ? "Tenis" : "Tenis de Mesa"}
                          </Badge>
                          <span className="text-sm font-medium text-gray-900">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Panel de subida de imagen y edición - Desktop */}
          <div className="lg:col-span-2">
            {view.mode === 'edit' && view.selectedProduct && (
              <div className="space-y-3 max-h-[70vh] overflow-y-auto" ref={editPanelRef}>
                <Card className="bg-white border border-brand-black/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Edit className="h-5 w-5" />
                      Editar Producto
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-900 mb-1">
                          {view.selectedProduct.name}
                        </p>
                        <p className="text-xs text-blue-700">
                          ID: {view.selectedProduct.id} • {view.selectedProduct.marca}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <ImageUpload
                  product={view.selectedProduct}
                  onImageUpdated={(newImageUrl) => handleImageUpdated(view.selectedProduct!.id, newImageUrl)}
                />

                <ProductGalleryEditor
                  key={view.selectedProduct.id}
                  product={view.selectedProduct}
                />

                <ProductEditForm
                  product={view.selectedProduct}
                  conversionRate={conversionRate}
                  brands={initialBrands}
                />
              </div>
            )}
            
            {view.mode === 'create' && (
              <Card className="bg-white border border-brand-black/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <PlusCircle className="h-5 w-5" />
                    Crear Nuevo Producto
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ProductCreateForm
                    onProductCreated={handleProductCreated}
                    conversionRate={conversionRate}
                    brands={initialBrands}
                  />
                </CardContent>
              </Card>
            )}
            
            {view.mode === 'list' && (
              <Card className="bg-white border border-brand-black/10 h-full">
                <CardContent className="p-6 text-center h-full flex flex-col items-center justify-center">
                  <Package className="h-12 w-12 text-gray-300 mb-3" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Selecciona un producto
                  </h3>
                  <p className="text-gray-500 mb-4 text-sm">
                    Elige un producto de la lista para editarlo o crea uno nuevo.
                  </p>
                  <Button onClick={handleShowCreateForm} className="bg-green-600 hover:bg-green-700">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Crear Producto
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
          </TabsContent>

          <TabsContent value="brands">
            <BrandsManager initial={initialBrands} />
          </TabsContent>

          <TabsContent value="carousel">
            <CarouselManager initial={initialCarouselSlides} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}