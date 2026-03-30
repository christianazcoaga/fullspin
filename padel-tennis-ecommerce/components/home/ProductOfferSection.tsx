"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import OptimizedImage from "@/components/OptimizedImage";
import type { Product } from "@/lib/products";

interface ProductOfferSectionProps {
  title: string;
  subtitle: string;
  products: Product[];
  categoryLink: string;
  categoryName: string;
  isLoading?: boolean;
  isComingSoon?: boolean;
  onProductClick?: (product: Product) => void;
  variant?: "white" | "blue";
}

export function ProductOfferSection({
  title,
  subtitle,
  products,
  categoryLink,
  categoryName,
  isLoading = false,
  isComingSoon = false,
  onProductClick,
  variant = "white",
}: ProductOfferSectionProps) {
  return (
    <section className={`py-12 md:py-20 ${variant === "blue" ? "bg-blue-600" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16">
          <h2 className={`text-3xl md:text-5xl font-bold mb-4 md:mb-6 ${variant === "blue" ? "text-white" : "text-gray-900"}`}>
            {title}
          </h2>
          <p className={`text-lg md:text-xl max-w-3xl mx-auto ${variant === "blue" ? "text-blue-100" : "text-gray-600"}`}>
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="group hover-lift card-modern border-0 overflow-hidden animate-pulse">
                <CardContent className="p-0">
                  <div className="relative h-64 bg-gray-200 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-32 h-32 bg-gray-300 rounded-full mb-4"></div>
                        <div className="h-4 bg-gray-300 rounded w-24 mx-auto mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-16 mx-auto"></div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : products.length > 0 ? (
            products.map((product) => (
              <Card 
                key={product.id} 
                className="group hover-lift card-modern border-0 overflow-hidden cursor-pointer"
                onClick={() => onProductClick?.(product)}
              >
                <CardContent className="p-0">
                  <div className="relative h-64 bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
                        <OptimizedImage
                          src={product.image}
                          alt={product.name}
                          width={80}
                          height={80}
                          className="object-contain w-20 h-20"
                        />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 text-center group-hover:text-blue-600 transition-colors px-4 w-full line-clamp-2">{product.name}</h3>
                      <p className="text-sm text-gray-600 text-center">{product.marca}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    {isComingSoon ? (
                      <div className="mb-4 text-center">
                        <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold text-lg">
                          Proximamente
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-gray-900">${Math.round(product.price * (1 - product.offer_percent / 100)).toLocaleString().replace(/,/g, ".")}</span>
                        <span className="text-lg text-gray-500 line-through">
                          ${product.price.toLocaleString().replace(/,/g, ".")}
                        </span>
                      </div>
                    )}
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const message = isComingSoon 
                          ? `Hola! Quiero consultar sobre la ${product.name} de ${product.marca} que estará disponible próximamente.`
                          : `Hola! Me interesa la ${product.name} de ${product.marca}. ¿Tienen stock disponible?`;
                        const whatsappUrl = `https://wa.me/543705103672?text=${encodeURIComponent(message)}`;
                        window.open(whatsappUrl, "_blank");
                      }}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl py-3 group"
                    >
                      {isComingSoon ? "Consultar Disponibilidad" : "Consultar Stock"}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            // No products found
            <div className="col-span-full text-center py-12">
              <p className={`text-lg ${variant === "blue" ? "text-blue-100" : "text-gray-600"}`}>No hay ofertas de {categoryName.toLowerCase()} disponibles en este momento.</p>
              <Link href={categoryLink} className="inline-block mt-4">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl">
                  Ver Productos de {categoryName}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

