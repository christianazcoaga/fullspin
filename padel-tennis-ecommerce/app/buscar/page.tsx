"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Search, Filter, SortAsc, SortDesc, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { searchProducts, type Product } from "@/lib/products";

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "price" | "marca">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterMarca, setFilterMarca] = useState<string>("all");

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const results = await searchProducts(query);
        setProducts(results);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  // Obtener marcas únicas para el filtro
  const uniqueMarcas = Array.from(new Set(products.map(p => p.marca))).sort();
  const uniqueCategories = Array.from(new Set(products.map(p => p.category))).sort();

  // Aplicar filtros y ordenamiento
  const filteredAndSortedProducts = products
    .filter(product => {
      if (filterCategory !== "all" && product.category !== filterCategory) return false;
      if (filterMarca !== "all" && product.marca !== filterMarca) return false;
      return true;
    })
    .sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "price":
          aValue = a.in_offer ? a.price * (1 - a.offer_percent / 100) : a.price;
          bValue = b.in_offer ? b.price * (1 - b.offer_percent / 100) : b.price;
          break;
        case "marca":
          aValue = a.marca.toLowerCase();
          bValue = b.marca.toLowerCase();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const handleProductClick = (product: Product) => {
    const message = `Hola! Me interesa la ${product.name} de ${product.marca}. ¿Tienen stock disponible?`;
    const whatsappUrl = `https://wa.me/543705103672?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Search className="h-5 w-5 text-gray-400" />
                <h1 className="text-lg font-semibold text-gray-900">
                  Resultados de búsqueda
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Info */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Búsqueda: "{query}"
          </h2>
          <p className="text-gray-600">
            {isLoading ? "Buscando productos..." : `${filteredAndSortedProducts.length} productos encontrados`}
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Filtros:</span>
              </div>
              
              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas las categorías</option>
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>
                    {category === "padel" ? "Padel" : "Tenis de Mesa"}
                  </option>
                ))}
              </select>

              {/* Marca Filter */}
              <select
                value={filterMarca}
                onChange={(e) => setFilterMarca(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas las marcas</option>
                {uniqueMarcas.map(marca => (
                  <option key={marca} value={marca}>{marca}</option>
                ))}
              </select>
            </div>

            {/* Sort and View Controls */}
            <div className="flex items-center space-x-4">
              {/* Sort */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "name" | "price" | "marca")}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Nombre</option>
                  <option value="price">Precio</option>
                  <option value="marca">Marca</option>
                </select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                >
                  {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>

              {/* View Mode */}
              <div className="flex items-center space-x-1 border border-gray-300 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredAndSortedProducts.length > 0 ? (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" : "space-y-4"}>
            {filteredAndSortedProducts.map((product) => (
              <Card key={product.id} className="group hover-lift card-modern border-0 overflow-hidden">
                <CardContent className={viewMode === "grid" ? "p-0" : "p-0"}>
                  {viewMode === "grid" ? (
                    // Grid View
                    <>
                      <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={80}
                              height={40}
                              className="object-contain w-20 h-20"
                            />
                          </div>
                          <h3 className="text-lg font-bold text-gray-800 text-center">{product.name}</h3>
                          <p className="text-sm text-gray-600 text-center">{product.marca}</p>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-gray-900">
                            ${product.in_offer 
                              ? Math.round(product.price * (1 - product.offer_percent / 100)).toLocaleString().replace(/,/g, ".")
                              : product.price.toLocaleString().replace(/,/g, ".")
                            }
                          </span>
                          {product.in_offer && (
                            <span className="text-lg text-gray-500 line-through">
                              ${product.price.toLocaleString().replace(/,/g, ".")}
                            </span>
                          )}
                        </div>
                        <Button 
                          onClick={() => handleProductClick(product)}
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl py-3"
                        >
                          Consultar Stock
                        </Button>
                      </div>
                    </>
                  ) : (
                    // List View
                    <div className="flex items-center p-6 space-x-6">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="object-contain w-12 h-12"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{product.marca}</p>
                        <p className="text-xs text-gray-500">
                          {product.category === "padel" ? "Padel" : "Tenis de Mesa"}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-2xl font-bold text-gray-900">
                            ${product.in_offer 
                              ? Math.round(product.price * (1 - product.offer_percent / 100)).toLocaleString().replace(/,/g, ".")
                              : product.price.toLocaleString().replace(/,/g, ".")
                            }
                          </span>
                          {product.in_offer && (
                            <span className="text-lg text-gray-500 line-through">
                              ${product.price.toLocaleString().replace(/,/g, ".")}
                            </span>
                          )}
                        </div>
                        {product.in_offer && (
                          <span className="inline-block bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                            -{product.offer_percent}%
                          </span>
                        )}
                      </div>
                      <Button 
                        onClick={() => handleProductClick(product)}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl px-6 py-2"
                      >
                        Consultar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-600 mb-6">
              No encontramos productos que coincidan con "{query}"
            </p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl">
                Volver al inicio
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 