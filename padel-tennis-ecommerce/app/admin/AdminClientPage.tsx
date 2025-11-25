"use client"

import { useState, useEffect, useRef } from "react"
import { type Product } from "@/lib/products"
import { ImageUpload } from "@/components/image-upload"
import { ProductEditForm } from "@/components/ProductEditForm"
import { ProductCreateForm } from "@/components/ProductCreateForm"
import { AdminStats } from "@/components/AdminStats"
import { AdminLoading } from "@/components/AdminLoading"
import { ConversionRateManager } from "@/components/ConversionRateManager"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  PlusCircle, 
  LogOut, 
  Settings, 
  BarChart3, 
  Package, 
  TrendingUp, 
  Filter,
  Grid3X3,
  List,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock
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
}

export default function AdminClientPage({ initialProducts, conversionRate }: AdminClientPageProps) {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [view, setView] = useState<AdminView>({ mode: "list", selectedProduct: null })
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Referencias para el scroll automático
  const productListRef = useRef<HTMLDivElement>(null)
  const selectedProductRef = useRef<HTMLDivElement>(null)
  const editPanelRef = useRef<HTMLDivElement>(null)
  const lastScrollTop = useRef(0)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
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

  // Limpiar timeout y animation frame al desmontar
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col gap-4 mb-4">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
              <p className="text-sm sm:text-base text-gray-600">Gestiona productos, imágenes y contenido de la tienda</p>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-end gap-2">
              <Button 
                onClick={handleRefreshProducts} 
                variant="outline" 
                disabled={isRefreshing}
                size="sm"
                className="bg-white/80 backdrop-blur-sm border-0 shadow-sm text-xs sm:text-sm"
              >
                <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Actualizando...' : 'Actualizar'}
              </Button>
              <Button onClick={handleShowCreateForm} size="sm" className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm">
                <PlusCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Nuevo Producto
              </Button>
              <Link href="/">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Ver Tienda
                </Button>
              </Link>
              <Button variant="destructive" onClick={handleLogout} size="sm" className="text-xs sm:text-sm">
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>

          {/* Conversion Rate Manager */}
          <div className="mb-4">
            <ConversionRateManager 
              initialRate={conversionRate} 
              productCount={products.length}
            />
          </div>

          {/* Statistics Dashboard */}
          <AdminStats products={products} />

          {/* Search and Filters */}
          <div className="flex flex-col gap-3 mb-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar productos por nombre, marca o categoría..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/80 backdrop-blur-sm border-0 shadow-sm text-sm"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white/80 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">Todas las categorías</option>
                <option value="padel">Padel</option>
                <option value="tenis-mesa">Tenis de Mesa</option>
                <option value="tenis">Tenis</option>
              </select>
              
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
                className="bg-white/80 backdrop-blur-sm border-0 shadow-sm"
                size="sm"
              >
                {viewMode === "list" ? (
                  <Grid3X3 className="h-4 w-4" />
                ) : (
                  <List className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile: Stack vertically */}
        <div className="block lg:hidden space-y-4">
          {/* Lista de productos - Mobile */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
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
                <div className="space-y-3 max-h-[40vh] overflow-y-auto" ref={productListRef}>
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
                <div className="grid grid-cols-2 gap-3 max-h-[40vh] overflow-y-auto" ref={productListRef}>
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
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
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
              
              <ProductEditForm 
                product={view.selectedProduct}
                conversionRate={conversionRate}
              />
            </div>
          )}
          
          {view.mode === 'create' && (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
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
                />
              </CardContent>
            </Card>
          )}
          
          {view.mode === 'list' && (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
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
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm h-full">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto" ref={productListRef}>
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
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
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
                
                <ProductEditForm 
                  product={view.selectedProduct}
                  conversionRate={conversionRate}
                />
              </div>
            )}
            
            {view.mode === 'create' && (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
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
                  />
                </CardContent>
              </Card>
            )}
            
            {view.mode === 'list' && (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm h-full">
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
      </div>
    </div>
  )
}