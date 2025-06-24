"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MessageCircle, Heart, Share2 } from "lucide-react";
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
  return `$${price.toLocaleString("es-AR", { minimumFractionDigits: 0 })}`;
};

export default function OfertasPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-4 group">
            <Image src="/fullspin-logo.png" alt="FullSpin Logo" width={40} height={40} className="rounded-lg" />
            <h1 className="text-2xl font-bold gradient-text">FullSpin</h1>
          </Link>
          <h2 className="text-2xl font-bold text-red-600">OFERTAS DEL MES</h2>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Productos en Oferta</h2>
          <p className="text-gray-600 text-lg">Aprovechá las mejores ofertas del mes en FullSpin.</p>
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
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
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
    </div>
  );
} 