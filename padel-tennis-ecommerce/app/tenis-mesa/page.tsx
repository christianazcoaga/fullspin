"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Menu, X, MessageCircle, Filter, Grid, List, Star, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getProductsByCategory,
  getProductsBySubcategory,
  searchProducts,
  type Product,
} from "@/lib/products";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Función para formatear precios con separadores de miles
const formatPrice = (price: number): string => {
  return `$${price.toLocaleString("es-AR", { minimumFractionDigits: 0 })}`;
};

const subcategories = [
  "paletas",
  "gomas",
  "pelotas",
  "mesas",
  "ropa",
  "accesorios",
];

const subcategoryNames: { [key: string]: string } = {
  paletas: "Paletas",
  gomas: "Gomas",
  pelotas: "Pelotas",
  mesas: "Mesas",
  ropa: "Ropa",
  accesorios: "Accesorios",
};

export default function TenisMesaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(15);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cargar productos al iniciar
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getProductsByCategory("tenis-mesa");
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos cuando cambian los filtros
  useEffect(() => {
    filterProducts();
  }, [products, selectedSubcategory, searchQuery, priceFilter, sortBy]);

  const filterProducts = async () => {
    let filtered = [...products];

    // Filtro por búsqueda
    if (searchQuery.trim()) {
      const searchResults = await searchProducts(searchQuery.trim());
      filtered = searchResults.filter(
        (product) => product.category === "tenis-mesa"
      );
    } else {
      // Filtro por subcategoría
      if (selectedSubcategory !== "all") {
        const subcategoryResults = await getProductsBySubcategory(
          "tenis-mesa",
          selectedSubcategory
        );
        filtered = subcategoryResults;
      } else {
        const categoryResults = await getProductsByCategory("tenis-mesa");
        filtered = categoryResults;
      }
    }

    // Filtro por precio
    if (priceFilter !== "all") {
      const [min, max] = priceFilter.split("-").map(Number);
      filtered = filtered.filter((product) => {
        if (max) {
          return product.price >= min && product.price <= max;
        } else {
          return product.price >= min;
        }
      });
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  };

  const handleWhatsAppClick = (product: Product) => {
    const message = `Hola! Me interesa el producto: ${
      product.name
    }. ¿Está disponible?`;
    const whatsappUrl = `https://wa.me/543705103672?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const toggleFavorite = (productId: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 50 ? 'glass-effect shadow-lg' : 'bg-white/80 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-4 group">
              <Image
                src="/fullspin-logo.png"
                alt="FullSpin Logo"
                width={50}
                height={50}
                className="rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300"
              />
              <h1 className="text-2xl font-bold gradient-text group-hover:scale-105 transition-transform duration-300">
                FullSpin
              </h1>
            </Link>

            <nav className="hidden md:flex space-x-8">
              <Link
                href="/"
                className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors relative group"
              >
                <span className="relative z-10">Inicio</span>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </Link>
              <Link
                href="/padel"
                className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors relative group"
              >
                <span className="relative z-10">Padel</span>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </Link>
              <Link
                href="/tenis-mesa"
                className="text-sm font-medium text-purple-600 relative"
              >
                <span className="relative z-10">Tenis de Mesa</span>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600"></div>
              </Link>
              <Link
                href="/sobre-nosotros"
                className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors relative group"
              >
                <span className="relative z-10">Sobre nosotros</span>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </Link>
            </nav>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/20 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-effect border-t animate-fade-in-up">
            <div className="px-4 py-2 space-y-2">
              <Link
                href="/"
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                href="/padel"
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Padel
              </Link>
              <Link
                href="/tenis-mesa"
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tenis de Mesa
              </Link>
              <Link
                href="/sobre-nosotros"
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sobre nosotros
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Page Header */}
      <div className="pt-20 pb-12 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-5 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Catálogo de Tenis de Mesa
          </h1>
          <p className="text-purple-100 text-xl">
            Equipamiento profesional para tu juego
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-16 z-40">
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
                  className="pl-10 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Desktop Filters */}
            <div className="hidden lg:flex flex-col sm:flex-row gap-4">
              {/* Subcategory Filter */}
              <Select
                value={selectedSubcategory}
                onValueChange={setSelectedSubcategory}
              >
                <SelectTrigger className="w-full sm:w-48 rounded-xl border-gray-200">
                  <SelectValue placeholder="Subcategoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las subcategorías</SelectItem>
                  {subcategories.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {subcategoryNames[sub]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Price Filter */}
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-full sm:w-48 rounded-xl border-gray-200">
                  <SelectValue placeholder="Precio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los precios</SelectItem>
                  <SelectItem value="0-50000">Hasta $50.000</SelectItem>
                  <SelectItem value="50000-100000">
                    $50.000 - $100.000
                  </SelectItem>
                  <SelectItem value="100000-200000">
                    $100.000 - $200.000
                  </SelectItem>
                  <SelectItem value="200000-999999">Más de $200.000</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48 rounded-xl border-gray-200">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nombre A-Z</SelectItem>
                  <SelectItem value="price-asc">
                    Precio: Menor a Mayor
                  </SelectItem>
                  <SelectItem value="price-desc">
                    Precio: Mayor a Menor
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Mobile Filters */}
            <div className="lg:hidden flex gap-2">
               <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros y Orden
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filtros y Orden</SheetTitle>
                  </SheetHeader>
                  <div className="py-4 space-y-4">
                     {/* Subcategory Filter */}
                    <Select
                      value={selectedSubcategory}
                      onValueChange={setSelectedSubcategory}
                    >
                      <SelectTrigger className="w-full rounded-xl border-gray-200">
                        <SelectValue placeholder="Subcategoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las subcategorías</SelectItem>
                        {subcategories.map((sub) => (
                          <SelectItem key={sub} value={sub}>
                            {subcategoryNames[sub]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Price Filter */}
                    <Select value={priceFilter} onValueChange={setPriceFilter}>
                      <SelectTrigger className="w-full rounded-xl border-gray-200">
                        <SelectValue placeholder="Precio" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los precios</SelectItem>
                        <SelectItem value="0-50000">Hasta $50.000</SelectItem>
                        <SelectItem value="50000-100000">
                          $50.000 - $100.000
                        </SelectItem>
                        <SelectItem value="100000-200000">
                          $100.000 - $200.000
                        </SelectItem>
                        <SelectItem value="200000-999999">Más de $200.000</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Sort */}
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full rounded-xl border-gray-200">
                        <SelectValue placeholder="Ordenar por" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Nombre A-Z</SelectItem>
                        <SelectItem value="price-asc">
                          Precio: Menor a Mayor
                        </SelectItem>
                        <SelectItem value="price-desc">
                          Precio: Mayor a Menor
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {searchQuery
              ? `Resultados para "${searchQuery}"`
              : selectedSubcategory !== "all"
              ? subcategoryNames[selectedSubcategory]
              : "Todos los productos de Tenis de Mesa"}
          </h2>
          <p className="text-gray-600 text-lg">
            {filteredProducts.length} producto
            {filteredProducts.length !== 1 ? "s" : ""} encontrado
            {filteredProducts.length !== 1 ? "s" : ""}
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-500 text-xl mb-2">No se encontraron productos</p>
            <p className="text-gray-400">
              Intenta ajustar los filtros de búsqueda
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.slice(0, visibleCount).map((product, index) => (
              <Card
                key={product.id}
                className="group hover-lift card-modern border-0 overflow-hidden animate-scale-in"
                style={{animationDelay: `${index * 0.05}s`}}
              >
                <CardContent className="p-0">
                  <div className="relative bg-gray-100 overflow-hidden aspect-square mb-4">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button
                        onClick={() => toggleFavorite(product.id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                          favorites.has(product.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white/80 text-gray-600 hover:bg-white'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${favorites.has(product.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button className="w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-600 transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="secondary" className="bg-white/90 text-gray-800 font-medium">
                        {subcategoryNames[product.subcategory]}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3 p-4">
                    <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors text-sm">
                      {product.name}
                    </h3>

                    <p className="text-gray-600 line-clamp-2 text-xs">
                      {product.description}
                    </p>

                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">(4.8)</span>
                    </div>

                    <div className="space-y-3">
                      <div className="font-bold text-purple-600 text-lg">
                        {formatPrice(product.price)}
                      </div>

                      <Button
                        onClick={() => handleWhatsAppClick(product)}
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                        size="sm"
                      >
                        <MessageCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                        Consultar por WhatsApp
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {visibleCount < filteredProducts.length && (
          <div className="flex justify-center mt-12">
            <Button
              onClick={() => setVisibleCount((prev) => prev + 8)}
              variant="outline"
              className="px-8 py-3 text-purple-600 border-purple-600 hover:bg-purple-600 hover:text-white rounded-xl transition-all duration-300 hover:scale-105"
            >
              Cargar más productos
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <Image src="/fullspin-logo.png" alt="FullSpin Logo" width={40} height={40} className="rounded-lg" />
                <h3 className="text-xl font-bold gradient-text">FullSpin</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Tu tienda especializada en equipamiento deportivo.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <div className="space-y-2 text-gray-400">
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  +54 370 510-3672
                </p>
                <p>Email: info@fullspin.com.ar</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Horarios</h3>
              <div className="text-gray-400 space-y-1">
                <p>Lunes a Viernes: 9:00 - 18:00</p>
                <p>Sábados: 9:00 - 13:00</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 FullSpin. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}