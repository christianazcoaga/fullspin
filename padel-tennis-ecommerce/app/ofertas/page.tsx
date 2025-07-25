"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MessageCircle, Heart, Share2, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProductsByCategory, searchProducts, type Product } from "@/lib/products";

const subcategoryNames: { [key: string]: string } = {
  palas: "Palas",
  zapatillas: "Zapatillas",
  pelotas: "Pelotas",
  bolsos: "Bolsos",
  ropa: "Ropa",
  accesorios: "Accesorios",
  paletas: "Paletas",
  gomas: "Gomas",
  mesas: "Mesas",
};

const formatPrice = (price: number): string => {
  return `$${price.toLocaleString("es-AR", { minimumFractionDigits: 0 }).replace(/,/g, ".")}`;
};

export default function OfertasPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      // Trae todos los productos de ambas categorías y filtra los que están en oferta
      const padel = await getProductsByCategory("padel");
      const tenis = await getProductsByCategory("tenis-mesa");
      const all = [...padel, ...tenis];
      setProducts(all.filter(p => p.in_offer));
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppClick = (product: Product) => {
    const message = `Hola! Me interesa el producto: ${product.name}. ¿Está disponible?`;
    const whatsappUrl = `https://wa.me/543705103672?text=${encodeURIComponent(message)}`;
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-red-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando ofertas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      {/* Header */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrollY > 50 ? "glass-effect shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-4 group">
              <div className="relative">
                <img 
                  src="/optimized/fullspin-logo.webp" 
                  alt="FullSpin Logo" 
                  width={50} 
                  height={50} 
                  className="rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300" 
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h1 className="text-2xl font-bold gradient-text group-hover:scale-105 transition-transform duration-300">
                FullSpin
              </h1>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/80 backdrop-blur-sm"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>

            <nav className="hidden md:flex space-x-8">
              <Link
                href="/"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors relative group"
              >
                <span className="relative z-10">Inicio</span>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </Link>
              <Link
                href="/padel"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors relative group"
              >
                <span className="relative z-10">Padel</span>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </Link>
              <Link
                href="/tenis-mesa"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors relative group"
              >
                <span className="relative z-10">Tenis de Mesa</span>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </Link>
              <Link
                href="/ofertas"
                className="text-sm font-medium text-blue-600 relative group"
              >
                <span className="relative z-10">Ofertas</span>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-100 transition-transform duration-300"></div>
              </Link>
              <Link
                href="/sobre-nosotros"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors relative group"
              >
                <span className="relative z-10">Sobre nosotros</span>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </Link>
            </nav>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-sm shadow-lg border-t border-gray-200">
              <div className="px-4 py-6 space-y-4">
                <Link
                  href="/"
                  className="block text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Inicio
                </Link>
                <Link
                  href="/padel"
                  className="block text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Padel
                </Link>
                <Link
                  href="/tenis-mesa"
                  className="block text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tenis de Mesa
                </Link>
                <Link
                  href="/ofertas"
                  className="block text-sm font-medium text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Ofertas
                </Link>
                <Link
                  href="/sobre-nosotros"
                  className="block text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sobre nosotros
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>
      <main className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Productos en Oferta</h2>
          <p className="text-xl text-gray-600 max-w-3xl">Encontrá productos seleccionados a precios especiales en FullSpin.</p>
        </div>
        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-500 text-xl mb-2">No hay productos en oferta actualmente</p>
            <p className="text-gray-400">Vuelve pronto para ver nuevas promociones</p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => (
              <Card
                key={product.id}
                className="group hover-lift card-modern border-0 overflow-hidden animate-scale-in"
                style={{animationDelay: `${index * 0.05}s`}}
              >
                <CardContent className="p-0">
                  <div className="relative bg-gray-100 overflow-hidden aspect-square mb-4 flex items-center justify-center">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
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
                        {subcategoryNames[product.subcategory] || product.subcategory}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3 p-4 flex flex-col h-full">
                    <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors text-sm min-h-[2.5rem]">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-xs">{product.description}</p>
                    <div className="h-8 flex items-center justify-start mb-2">
                      {product.marca && (
                        <img
                          src={`/optimized/${product.marca.toLowerCase()}-logo.webp`}
                          alt={product.marca + ' Logo'}
                          className="object-contain max-h-6 w-auto"
                          style={{ maxWidth: '60px' }}
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
                        <div className="font-bold text-red-600 text-lg">
                          {formatPrice(product.price)}
                        </div>
                      )}
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
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <img 
                  src="/optimized/fullspin-logo.webp" 
                  alt="FullSpin Logo" 
                  width={40} 
                  height={40} 
                  className="rounded-lg shadow-lg" 
                />
                <h3 className="text-2xl font-bold gradient-text">FullSpin</h3>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                Tu tienda especializada en equipamiento deportivo de primera calidad.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6">Categorías</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="/padel" className="hover:text-white transition-colors hover:translate-x-1 transform duration-300 inline-block">
                    Padel
                  </Link>
                </li>
                <li>
                  <Link href="/tenis-mesa" className="hover:text-white transition-colors hover:translate-x-1 transform duration-300 inline-block">
                    Tenis de Mesa
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6">Contacto</h3>
              <div className="space-y-3 text-gray-400">
                <p className="flex items-center">
                  <a href="https://wa.me/543705103672" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-pink-500 transition-colors">
                    <svg className="w-5 h-5 mr-3 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    +54 370 510-3672
                  </a>
                </p>
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@fullspin.com.ar
                </p>
                <p className="flex items-center">
                  <a href="https://www.instagram.com/fullspinargentina/" target="_blank" rel="noopener noreferrer" className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 2.75a5.75 5.75 0 1 1-5.75 5.75 5.75 5.75 0 0 1 5.75-5.75zm0 1.5a4.25 4.25 0 1 0 4.25 4.25A4.25 4.25 0 0 0 12 5.75zm5.25 1.25a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" />
                    </svg>
                    <span className="text-gray-400 hover:text-pink-500 transition-colors">@fullspinargentina</span>
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 FullSpin. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 