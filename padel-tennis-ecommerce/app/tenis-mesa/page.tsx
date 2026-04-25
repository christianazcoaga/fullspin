"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, X, MessageCircle, Filter, Grid, List, Star, Heart, Share2, ArrowRight } from "lucide-react";
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

const brandLogos: { [key: string]: { src: string, alt: string, width: number, height: number } } = {
  "Butterfly": { src: "/optimized/butterfly-logo.webp", alt: "Butterfly Logo", width: 80, height: 40 },
  "DHS": { src: "/optimized/dhs-logo.webp", alt: "DHS Logo", width: 80, height: 40 },
  "Sanwei": { src: "/optimized/sanwei-logo.webp", alt: "Sanwei Logo", width: 80, height: 40 },
  "Stiga": { src: "/placeholder-logo.png", alt: "Stiga Logo", width: 80, height: 40 },
  "Xiom": { src: "/placeholder-logo.png", alt: "Xiom Logo", width: 80, height: 40 },
};

// Función para formatear precios con separadores de miles
const formatPrice = (price: number): string => {
  return `$${price.toLocaleString("es-AR", { minimumFractionDigits: 0 }).replace(/,/g, ".")}`;
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
  const [sortBy, setSortBy] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(12);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);

  const brands = Array.from(new Set(products.map(p => p.marca).filter(Boolean)));

  // Cargar productos al iniciar
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getProductsByCategory("tenis-mesa");
      setProducts(data);
      // Aplicar filtros iniciales inmediatamente
      applyFilters(data);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos cuando cambian los filtros
  useEffect(() => {
    if (products.length > 0) {
      applyFilters(products);
    }
  }, [selectedSubcategory, searchQuery, priceFilter, sortBy, selectedBrand]);

  const applyFilters = async (productList: Product[]) => {
    let filtered = [...productList];

    // Filtro por búsqueda
    if (searchQuery.trim()) {
      try {
        const searchResults = await searchProducts(searchQuery.trim());
        filtered = searchResults.filter(
          (product) => product.category === "tenis-mesa"
        );
      } catch (error) {
        console.error("Error searching products:", error);
        filtered = [];
      }
    } else {
      // Filtro por subcategoría
      if (selectedSubcategory !== "all") {
        try {
          const subcategoryResults = await getProductsBySubcategory(
            "tenis-mesa",
            selectedSubcategory
          );
          filtered = subcategoryResults;
        } catch (error) {
          console.error("Error filtering by subcategory:", error);
          filtered = [];
        }
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

    // Filtro por marca
    if (selectedBrand !== "all") {
      filtered = filtered.filter(product => product.marca === selectedBrand);
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      // Primero ordenar por ofertas (los que están en oferta van primero)
      if (a.in_offer && !b.in_offer) return -1;
      if (!a.in_offer && b.in_offer) return 1;
      
      // Si ambos están en oferta o ambos no están en oferta, aplicar el ordenamiento seleccionado
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        case "newest":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
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

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
    document.body.style.overflow = 'unset';
  };

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showProductModal) {
        closeProductModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showProductModal]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-cream">
      {/* Page Header */}
      <div className="pb-16 bg-brand-blue-dark relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-500/30 blur-3xl" />
          <div className="absolute bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-700/40 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold tracking-wide uppercase">
            Catalogo Tenis de Mesa
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
            TENIS DE MESA
          </h1>
          <p className="text-blue-100 text-lg md:text-xl font-medium max-w-2xl">
            Somos especialistas en tenis de mesa en Argentina. Las mejores marcas, envios a todo el pais.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-gray-100 sticky top-16 z-40 shadow-sm">
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
                  className="pl-10 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-base"
                  style={{ fontSize: '16px' }}
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

              {/* Brand Filter */}
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="w-full sm:w-48 rounded-xl border-gray-200">
                  <SelectValue placeholder="Marca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las marcas</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48 rounded-xl border-gray-200">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Más recientes</SelectItem>
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

                    {/* Brand Filter */}
                    <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                      <SelectTrigger className="w-full rounded-xl border-gray-200">
                        <SelectValue placeholder="Marca" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las marcas</SelectItem>
                        {brands.map((brand) => (
                          <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Sort */}
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full rounded-xl border-gray-200">
                        <SelectValue placeholder="Ordenar por" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Más recientes</SelectItem>
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
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
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
                className="group hover-lift card-modern border-0 overflow-hidden animate-scale-in cursor-pointer"
                style={{animationDelay: `${index * 0.05}s`}}
                onClick={() => openProductModal(product)}
              >
                <CardContent className="p-0">
                  <div className="relative bg-gradient-to-br from-slate-50 to-blue-50/30 overflow-hidden aspect-square mb-4 flex items-center justify-center">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                          favorites.has(product.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white/80 text-gray-600 hover:bg-white'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${favorites.has(product.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-600 transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="secondary" className="bg-white/90 text-gray-800 font-medium">
                        {subcategoryNames[product.subcategory]}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3 p-4 flex flex-col h-full">
                    <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors text-sm min-h-[2.5rem]">
                      {product.name}
                    </h3>

                    <div className="h-8 flex items-center justify-start mb-2">
                      {product.marca && (
                        <img
                          src={`/${product.marca.toLowerCase()}-logo.png`}
                          alt={product.marca + ' Logo'}
                          width={60}
                          height={24}
                          className="object-contain max-h-6"
                        />
                      )}
                    </div>

                    <div className="mt-auto space-y-3">
                      {product.in_offer && product.offer_percent > 0 ? (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 line-through text-base">{formatPrice(product.price)}</span>
                            <span className="bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded text-xs">-{product.offer_percent}%</span>
                          </div>
                          <div className="font-bold text-red-600 text-lg">
                            {formatPrice(Math.round(product.price * (1 - product.offer_percent / 100)))}
                          </div>
                        </>
                      ) : (
                        <div className="font-bold text-blue-600 text-lg">
                          {formatPrice(product.price)}
                        </div>
                      )}

                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWhatsAppClick(product);
                        }}
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
              className="px-8 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-full font-bold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Cargar más productos
            </Button>
          </div>
        )}
      </main>

      {/* Product Modal */}
      {showProductModal && selectedProduct && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in"
          onClick={closeProductModal}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="text-xl font-bold text-gray-900">Detalles del Producto</h2>
              <button
                onClick={closeProductModal}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="space-y-4">
                  <div className="relative bg-gray-50 rounded-xl overflow-hidden aspect-square flex items-center justify-center group">
                    <img
                      src={selectedProduct.image || "/placeholder.svg"}
                      alt={selectedProduct.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    {selectedProduct.in_offer && selectedProduct.offer_percent > 0 && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-red-500 text-white font-bold px-3 py-1 rounded-full text-sm">
                          -{selectedProduct.offer_percent}% OFF
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Category Badge */}
                  <div className="text-center">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-medium text-sm px-4 py-2">
                      {subcategoryNames[selectedProduct.subcategory]} • Tenis de Mesa
                    </Badge>
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                  {/* Product Name */}
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                      {selectedProduct.name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      ID: {selectedProduct.id}
                    </p>
                  </div>

                  {/* Brand Logo */}
                  <div className="flex items-center">
                    {selectedProduct.marca && (() => {
                      const normalizedMarca = selectedProduct.marca.trim();
                      const brandKey = Object.keys(brandLogos).find(
                        key => key.toLowerCase() === normalizedMarca.toLowerCase()
                      );
                      
                      if (brandKey && brandLogos[brandKey]) {
                        return (
                          <div className="flex items-center space-x-3">
                            <span className="text-gray-600 font-medium">Marca:</span>
                            <Image
                              src={brandLogos[brandKey].src}
                              alt={brandLogos[brandKey].alt}
                              width={80}
                              height={32}
                              className="object-contain max-h-8"
                            />
                          </div>
                        );
                      }
                      
                      return (
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-600 font-medium">Marca:</span>
                          <span className="text-lg font-semibold text-gray-800">
                            {normalizedMarca}
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Description */}
                  {selectedProduct.description && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h4>
                      <p className="text-gray-600 leading-relaxed">
                        {selectedProduct.description}
                      </p>
                    </div>
                  )}

                  {/* Price */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    {selectedProduct.in_offer && selectedProduct.offer_percent > 0 ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl text-gray-400 line-through">
                            {formatPrice(selectedProduct.price)}
                          </span>
                          <span className="bg-red-100 text-red-600 font-bold px-3 py-1 rounded-full text-sm">
                            -{selectedProduct.offer_percent}%
                          </span>
                        </div>
                        <div className="text-3xl font-bold text-red-600">
                          {formatPrice(Math.round(selectedProduct.price * (1 - selectedProduct.offer_percent / 100)))}
                        </div>
                        <p className="text-green-600 font-medium">
                          ¡Ahorrás {formatPrice(selectedProduct.price - Math.round(selectedProduct.price * (1 - selectedProduct.offer_percent / 100)))}!
                        </p>
                      </div>
                    ) : (
                      <div className="text-3xl font-bold text-blue-600">
                        {formatPrice(selectedProduct.price)}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      onClick={() => handleWhatsAppClick(selectedProduct)}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <MessageCircle className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                      Consultar por WhatsApp
                      <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estilos para las animaciones */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .gradient-text {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }

        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
        }

        .card-modern {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}