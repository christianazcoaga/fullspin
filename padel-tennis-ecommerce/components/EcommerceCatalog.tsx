"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Search, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  getProducts,
  getProductsByCategory,
  getProductsBySubcategory,
  searchProducts,
  type Product,
} from "@/lib/products"

const formatPrice = (price: number): string => {
  return `$${price.toLocaleString("es-AR", { minimumFractionDigits: 0 })}`
}

const categories = [
  { id: "padel", name: "Padel", subcategories: ["palas", "zapatillas", "pelotas", "bolsos", "ropa", "accesorios"] },
  {
    id: "tenis-mesa",
    name: "Tenis de Mesa",
    subcategories: ["paletas", "gomas", "pelotas", "mesas", "ropa", "accesorios"],
  },
]

const subcategoryNames: { [key: string]: string } = {
  // Padel
  palas: "Palas",
  zapatillas: "Zapatillas",
  pelotas: "Pelotas",
  bolsos: "Bolsos",
  ropa: "Ropa",
  accesorios: "Accesorios",
  // Tenis de Mesa
  paletas: "Paletas",
  gomas: "Gomas",
  mesas: "Mesas",
}

export default function EcommerceCatalog({ initialCategory }: { initialCategory: string }) {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubcategory, setSelectedSubcategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [priceFilter, setPriceFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  // Cargar productos al iniciar
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const data = await getProducts()
      setProducts(data)
      setFilteredProducts(data)
    } catch (error) {
      console.error("Error loading products:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar productos cuando cambian los filtros
  useEffect(() => {
    filterProducts()
  }, [products, selectedSubcategory, searchQuery, priceFilter, sortBy, initialCategory])

  const filterProducts = async () => {
    let filtered = [...products]

    // Filtro por categoría principal
    filtered = filtered.filter((product) => product.category === initialCategory)

    // Filtro por búsqueda
    if (searchQuery.trim()) {
      const searchResults = await searchProducts(searchQuery.trim())
      filtered = searchResults.filter((product) => product.category === initialCategory)
    } else {
      // Filtro por subcategoría
      if (selectedSubcategory !== "all") {
        const subcategoryResults = await getProductsBySubcategory(initialCategory, selectedSubcategory)
        filtered = subcategoryResults
      } else {
        const categoryResults = await getProductsByCategory(initialCategory)
        filtered = categoryResults
      }
    }

    // Filtro por precio
    if (priceFilter !== "all") {
      const [min, max] = priceFilter.split("-").map(Number)
      filtered = filtered.filter((product) => {
        if (max) {
          return product.price >= min && product.price <= max
        } else {
          return product.price >= min
        }
      })
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })

    setFilteredProducts(filtered)
  }

  const handleWhatsAppClick = (product: Product) => {
    const message = `Hola! Me interesa el producto: ${product.name} - ${formatPrice(product.price)}. ¿Está disponible?`
    const whatsappUrl = `https://wa.me/543705103672?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    )
  }

  // Encontrar el objeto categoría para las subcategorías correctas
  const categoryObj = categories.find((c) => c.id === initialCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar productos, códigos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Subcategory Filter */}
              <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Subcategoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las subcategorías</SelectItem>
                  {categoryObj?.subcategories.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {subcategoryNames[sub]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Price Filter */}
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Precio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los precios</SelectItem>
                  <SelectItem value="0-50000">Hasta $50.000</SelectItem>
                  <SelectItem value="50000-100000">$50.000 - $100.000</SelectItem>
                  <SelectItem value="100000-200000">$100.000 - $200.000</SelectItem>
                  <SelectItem value="200000-999999">Más de $200.000</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nombre A-Z</SelectItem>
                  <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
                  <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {searchQuery
              ? `Resultados para "${searchQuery}"`
              : selectedSubcategory !== "all"
                ? subcategoryNames[selectedSubcategory]
                : categoryObj?.name}
          </h2>
          <p className="text-gray-600">
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""} encontrado
            {filteredProducts.length !== 1 ? "s" : ""}
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No se encontraron productos</p>
            <p className="text-gray-400 mt-2">Intenta ajustar los filtros de búsqueda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-xs">
                      {subcategoryNames[product.subcategory]}
                    </Badge>
                    <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
                    <p className="text-xs text-gray-600 line-clamp-2">{product.description}</p>
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-orange-600">{formatPrice(product.price)}</div>
                    </div>
                    <Button
                      onClick={() => handleWhatsAppClick(product)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Consultar por WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
