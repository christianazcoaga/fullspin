"use client";

import Image from "next/image";
import OptimizedImage from "@/components/OptimizedImage";
import Link from "next/link";
import {
  Menu,
  X,
  ArrowRight,
  MessageCircle,
  Star,
  Users,
  Award,
  Zap,
  Sparkles,
  TrendingUp,
  Shield,
  Tag,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getProducts, searchProducts, type Product } from "@/lib/products";
import { subscribeToNewsletter, subscribePhoneToNewsletter } from "@/lib/newsletter";
import { getOptimizedImage, getImageSrcSet } from "@/lib/image-mapping";

import { ProductOfferSection } from "@/components/home/ProductOfferSection";

export default function HomePageClient({
  initialPadelOffers = [],
  initialTenisMesaOffers = [],
  initialTenisOffers = []
}: {
  initialPadelOffers: Product[];
  initialTenisMesaOffers: Product[];
  initialTenisOffers: Product[];
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterPhone, setNewsletterPhone] = useState("");
  const [subscriptionType, setSubscriptionType] = useState<"email" | "phone">("email");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState<"idle" | "success" | "error">("idle");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);

  // Ocultar mensaje de éxito o error después de 5 segundos
  useEffect(() => {
    if (subscriptionStatus === "success" || subscriptionStatus === "error") {
      const timer = setTimeout(() => {
        setSubscriptionStatus("idle");
        setSubscriptionMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [subscriptionStatus]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Removed client-side fetching of offers in favor of SSR props

  // Función para manejar la búsqueda
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      setIsSearching(true);
      const results = await searchProducts(query);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Error searching products:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
    setShowSearchResults(false);
    setSearchQuery("");
    document.body.style.overflow = 'hidden';
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
    document.body.style.overflow = 'unset';
  };

  const handleWhatsAppClick = (product: Product) => {
    const message = `Hola! Me interesa la ${product.name} de ${product.marca}. ¿Tienen stock disponible?`;
    const whatsappUrl = `https://wa.me/543705103672?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const formatPrice = (price: number): string => {
    return `$${price.toLocaleString("es-AR", { minimumFractionDigits: 0 }).replace(/,/g, ".")}`;
  };

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showProductModal) {
        closeProductModal();
      }
    };

    if (showProductModal) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showProductModal]);

  // Debounce para la búsqueda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Prevenir scroll del body cuando el overlay móvil esté abierto
  useEffect(() => {
    if (showSearchResults && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showSearchResults]);

  // Cerrar resultados de búsqueda al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // Para móvil: solo cerrar si se hace clic en el backdrop (fondo oscuro)
      if (window.innerWidth < 768) {
        // No cerrar si se hace clic en el input o en elementos dentro del overlay
        if (target.closest('.mobile-search-overlay')) {
          return;
        }
        // Solo cerrar si se hace clic específicamente en el backdrop
        if (target.classList.contains('mobile-search-backdrop')) {
          setShowSearchResults(false);
          setSearchQuery("");
        }
        return;
      }
      
      // Para desktop: cerrar si se hace clic fuera del contenedor de búsqueda
      if (!target.closest('.search-container')) {
        setShowSearchResults(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowSearchResults(false);
        setSearchQuery("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  // Función para manejar la suscripción al newsletter
  const handleNewsletterSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (subscriptionType === "email" && !newsletterEmail.trim()) {
      setSubscriptionStatus("error");
      setSubscriptionMessage("Por favor ingresa tu email");
      return;
    }
    
    if (subscriptionType === "phone" && !newsletterPhone.trim()) {
      setSubscriptionStatus("error");
      setSubscriptionMessage("Por favor ingresa tu número de teléfono");
      return;
    }

    try {
      setIsSubscribing(true);
      setSubscriptionStatus("idle");
      
      let result;
      
      if (subscriptionType === "email") {
        result = await subscribeToNewsletter(newsletterEmail.trim());
        if (result.success) {
          setNewsletterEmail("");
        }
      } else {
        result = await subscribePhoneToNewsletter(newsletterPhone.trim());
        if (result.success) {
          setNewsletterPhone("");
        }
      }
      
      if (result.success) {
        setSubscriptionStatus("success");
        setSubscriptionMessage(result.message);
      } else {
        setSubscriptionStatus("error");
        setSubscriptionMessage(result.message);
      }
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      setSubscriptionStatus("error");
      setSubscriptionMessage("Error al suscribirse. Por favor intenta nuevamente.");
    } finally {
      setIsSubscribing(false);
    }
  };

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
                <OptimizedImage
                  src="/optimized/fullspin-logo.webp"
                  alt="FullSpin Logo"
                  width={50}
                  height={50}
                  className="rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h1 className="text-2xl font-bold text-black group-hover:scale-105 transition-transform duration-300">
                FullSpin
              </h1>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:block flex-1 max-w-md mx-8 relative search-container">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearchResults(true)}
                  className="w-full px-4 py-2 pl-10 pr-4 text-base bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-500"
                  style={{ fontSize: '16px' }}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && (searchResults.length > 0 || isSearching) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-[70vh] overflow-y-auto z-50">
                  {isSearching ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                      Buscando productos...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((product) => (
                        <div
                          key={product.id}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200 flex items-center space-x-3"
                          onClick={() => openProductModal(product)}
                        >
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={24}
                              height={24}
                              className="object-contain w-6 h-6"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {product.marca} • {product.category === "padel" ? "Padel" : product.category === "tenis-mesa" ? "Tenis de Mesa" : "Tenis"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">
                              ${product.in_offer 
                                ? Math.round(product.price * (1 - product.offer_percent / 100)).toLocaleString().replace(/,/g, ".")
                                : product.price.toLocaleString().replace(/,/g, ".")
                              }
                            </p>
                            {product.in_offer && (
                              <p className="text-xs text-red-500 font-medium">
                                -{product.offer_percent}%
                              </p>
                            )}
                          </div>
                        </div>
                      ))}

                    </div>
                  ) : searchQuery.trim().length >= 2 ? (
                    <div className="p-6 text-center text-gray-500">
                      <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm mb-2">No se encontraron productos para "{searchQuery}"</p>
                      <p className="text-xs text-gray-400">Intenta con otros términos de búsqueda</p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            <nav className="hidden md:flex space-x-8">
              <Link
                href="/"
                className="text-sm font-medium text-blue-600 relative group"
              >
                <span className="relative z-10">Inicio</span>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-100 transition-transform duration-300"></div>
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
                href="/tenis"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors relative group"
              >
                <span className="relative z-10">Tenis</span>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </Link>
              <Link
                href="/ofertas"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors relative group"
              >
                <span className="relative z-10">Ofertas</span>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </Link>
              <Link
                href="/sobre-nosotros"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors relative group"
              >
                <span className="relative z-10">Sobre nosotros</span>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </Link>
            </nav>

            <div className="md:hidden flex items-center space-x-2">
              <button
                className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowSearchResults(true);
                }}
              >
                <Search className="h-6 w-6" />
              </button>
              <button
                className="p-2 rounded-lg hover:bg-white/20 transition-colors"
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
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-effect border-t animate-fade-in-up">
            <div className="px-4 py-2 space-y-2">
              <Link
                href="/"
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-700"
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
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tenis de Mesa
              </Link>
              <Link
                href="/tenis"
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tenis
              </Link>
              <Link
                href="/ofertas"
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Ofertas
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

        {/* Mobile Search Overlay */}
        {showSearchResults && (
          <div 
            className="md:hidden fixed top-0 left-0 right-0 bottom-0 bg-black/70 z-[9999] flex items-start justify-center mobile-search-backdrop" 
            style={{ 
              paddingTop: '80px',
              minHeight: '100vh',
              minWidth: '100vw'
            }}
          >
            <div className="w-full max-w-md mx-4 bg-white rounded-xl shadow-2xl max-h-[calc(100vh-100px)] flex flex-col mobile-search-overlay">
              <div className="p-4 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Buscar productos</h3>
                  <button
                    onClick={() => {
                      setShowSearchResults(false);
                      setSearchQuery("");
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="relative">
                  <input
                    ref={mobileSearchInputRef}
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      // Asegurar que el overlay permanezca abierto cuando se enfoca el input
                      if (!showSearchResults) {
                        setShowSearchResults(true);
                      }
                    }}
                    className="w-full px-4 py-3 pl-10 pr-4 text-base bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-500"
                    style={{ fontSize: '16px' }}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Search Results */}
              <div className="flex-1 overflow-y-auto">
                {isSearching ? (
                  <div className="p-6 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
                    <p className="text-sm">Buscando productos...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        className="px-4 py-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 flex items-center space-x-3 border-b border-gray-100 last:border-b-0"
                        onClick={() => openProductModal(product)}
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={32}
                            height={32}
                            className="object-contain w-8 h-8"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500 mb-1">
                            {product.marca} • {product.category === "padel" ? "Padel" : product.category === "tenis-mesa" ? "Tenis de Mesa" : "Tenis"}
                          </p>
                          {product.in_offer && (
                            <p className="text-xs text-red-500 font-medium">
                              -{product.offer_percent}% de descuento
                            </p>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-semibold text-gray-900">
                            ${product.in_offer 
                              ? Math.round(product.price * (1 - product.offer_percent / 100)).toLocaleString().replace(/,/g, ".")
                              : product.price.toLocaleString().replace(/,/g, ".")
                            }
                          </p>
                          {product.in_offer && (
                            <p className="text-xs text-gray-500 line-through">
                              ${product.price.toLocaleString().replace(/,/g, ".")}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {/* Botón para ver todos los resultados */}
                    <div className="p-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setShowSearchResults(false);
                          const searchUrl = `/buscar?q=${encodeURIComponent(searchQuery)}`;
                          window.location.href = searchUrl;
                        }}
                        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        Ver todos los resultados ({searchResults.length})
                      </button>
                    </div>
                  </div>
                ) : searchQuery.trim().length >= 2 ? (
                  <div className="p-6 text-center text-gray-500">
                    <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm mb-2">No se encontraron productos para "{searchQuery}"</p>
                    <p className="text-xs text-gray-400">Intenta con otros términos de búsqueda</p>
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm mb-2">Escribe para buscar productos</p>
                    <p className="text-xs text-gray-400">Busca por nombre, marca o categoría</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-pink-600/10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Decorative Images */}
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/3 opacity-15 drop-shadow-lg hidden lg:block pointer-events-none"
          style={{ top: "50%" }}
        >
          <OptimizedImage
            src="/optimized/padel-racket-bg.webp"
            alt="Padel Racket"
            width={420}
            height={420}
            className="transform -rotate-45"
          />
        </div>
        <div
          className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 opacity-15 drop-shadow-lg hidden lg:block pointer-events-none"
          style={{ top: "50%" }}
        >
          <OptimizedImage
            src="/optimized/tt-paddle-bg.webp"
            alt="Table Tennis Paddle"
            width={420}
            height={420}
            className="transform rotate-45"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Bienvenido a{" "}
              <span className="text-blue-600 relative">
                FullSpin
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-blue-600 rounded-full"></div>
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Especialistas en{" "}
              <span className="font-semibold text-blue-600">Padel</span>{" "}
              y <span className="font-semibold text-blue-600">
                Tenis de Mesa
              </span>{" "}
              en Argentina. Envíos a todo el país.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/padel">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                  Productos de Padel
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <Link href="/tenis-mesa">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                  Productos de Tenis de Mesa
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <Link href="/tenis">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                  Productos de Tenis
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Image Carousel Section */}
      <section className="w-full bg-gradient-to-br from-gray-50 to-blue-50">
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-0">
            {/* Slide 1 - Adidas Banner */}
            <CarouselItem className="pl-0 basis-full">
              <div className="relative w-full h-[200px] xs:h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] bg-white flex items-center justify-center overflow-hidden">
                <OptimizedImage
                  src="/optimized/adidas-banner.webp"
                  alt="Adidas Banner"
                  fill
                  sizes="100vw"
                  className="w-full h-full"
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
            </CarouselItem>
            {/* Slide 2 - Butterfly Banner */}
            <CarouselItem className="pl-0 basis-full">
              <div className="relative w-full h-[200px] xs:h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] bg-white flex items-center justify-center overflow-hidden">
                <OptimizedImage
                  src="/optimized/butterfly-banner.webp"
                  alt="Butterfly Banner"
                  fill
                  sizes="100vw"
                  className="w-full h-full"
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </CarouselItem>
            {/* Slide 3 - DHS Banner */}
            <CarouselItem className="pl-0 basis-full">
              <div className="relative w-full h-[200px] xs:h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] bg-white flex items-center justify-center overflow-hidden">
                <OptimizedImage
                  src="/optimized/dhs-banner.webp"
                  alt="DHS Banner"
                  fill
                  sizes="100vw"
                  className="w-full h-full"
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </CarouselItem>
            {/* Slide 4 - Wilson Banner */}
            <CarouselItem className="pl-0 basis-full">
              <div className="relative w-full h-[200px] xs:h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] bg-white flex items-center justify-center overflow-hidden">
                <OptimizedImage
                  src="/optimized/wilson-banner.webp"
                  alt="Wilson Banner"
                  fill
                  sizes="100vw"
                  className="w-full h-full"
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="left-2 sm:left-4 bg-white/80 hover:bg-white text-gray-800 border-0 shadow-lg transition-all duration-300 hover:scale-110" />
          <CarouselNext className="right-2 sm:right-4 bg-white/80 hover:bg-white text-gray-800 border-0 shadow-lg transition-all duration-300 hover:scale-110" />
        </Carousel>
      </section>

      {/* Padel Offers Section */}
      <ProductOfferSection
        title="Ofertas de Padel"
        subtitle="Productos de padel con descuentos especiales"
        products={initialPadelOffers}
        categoryLink="/padel"
        categoryName="Padel"
      />

      {/* Tenis de Mesa Offers Section */}
      <ProductOfferSection
        title="Ofertas de Tenis de Mesa"
        subtitle="Productos de tenis de mesa con descuentos especiales"
        products={initialTenisMesaOffers}
        categoryLink="/tenis-mesa"
        categoryName="Tenis de Mesa"
      />

      {/* Tenis Offers Section */}
      <ProductOfferSection
        title="Ofertas de Tenis"
        subtitle="Productos de tenis con descuentos especiales"
        products={initialTenisOffers}
        categoryLink="/tenis"
        categoryName="Tenis"
      />


      {/* Banner Carousel Section (Brand Logos) */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {/* Slide 1 - Butterfly, DHS & Sanwei Logos */}
              <CarouselItem className="md:basis-1/1 flex items-center justify-center">
                <div className="relative flex flex-col items-center justify-center h-80 md:h-96 bg-white rounded-2xl shadow-2xl px-4 md:px-8 py-6 md:py-0">
                  <div className="block md:absolute md:top-6 md:left-1/2 md:-translate-x-1/2 z-10 mb-4 md:mb-0">
                    <span className="text-2xl md:text-3xl font-bold text-gray-700">
                      TENIS DE MESA
                    </span>
                  </div>
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 w-full mt-2">
                    <img
                      src="/optimized/butterfly-logo.webp"
                      alt="Butterfly Logo"
                      className="object-contain max-h-20 md:max-h-32 w-auto"
                    />
                    <img
                      src="/optimized/dhs-logo.webp"
                      alt="DHS Logo"
                      className="object-contain max-h-20 md:max-h-32 w-auto"
                    />
                    <img
                      src="/optimized/sanwei-logo.webp"
                      alt="Sanwei Logo"
                      className="object-contain max-h-6 md:max-h-10 w-auto"
                    />
                  </div>
                </div>
              </CarouselItem>
              {/* Slide 2 - Adidas & Wilson Logos (Padel) */}
              <CarouselItem className="md:basis-1/1 flex items-center justify-center">
                <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 h-80 md:h-96 bg-white rounded-2xl shadow-2xl px-4 md:px-8 py-6 md:py-0">
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
                    <span className="text-2xl md:text-3xl font-bold text-gray-700">
                      PADEL
                    </span>
                  </div>
                  <img
                    src="/optimized/adidas-logo.webp"
                    alt="Adidas Logo"
                    className="object-contain max-h-20 md:max-h-32 w-auto"
                  />
                  <img
                    src="/optimized/wilson-logo.webp"
                    alt="Wilson Logo"
                    className="object-contain max-h-20 md:max-h-32 w-auto"
                  />
                </div>
              </CarouselItem>
              {/* Slide 3 - Wilson & Head Logos (Tenis) */}
              <CarouselItem className="md:basis-1/1 flex items-center justify-center">
                <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 h-80 md:h-96 bg-white rounded-2xl shadow-2xl px-4 md:px-8 py-6 md:py-0">
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
                    <span className="text-2xl md:text-3xl font-bold text-gray-700">
                      TENIS
                    </span>
                  </div>
                  <img
                    src="/optimized/wilson-logo.webp"
                    alt="Wilson Logo"
                    className="object-contain max-h-20 md:max-h-32 w-auto"
                  />
                  <img
                    src="/optimized/head-logo.webp"
                    alt="Head Logo"
                    className="object-contain max-h-20 md:max-h-32 w-auto"
                  />
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-white/80 hover:bg-white text-gray-800 border-0 shadow-lg" />
            <CarouselNext className="right-4 bg-white/80 hover:bg-white text-gray-800 border-0 shadow-lg" />
          </Carousel>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Nuestras Categorías
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Encuentra el equipamiento perfecto para tu deporte favorito con la
              mejor calidad y precios
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Padel Card */}
            <Card className="group hover-lift card-modern border-0 overflow-hidden animate-scale-in">
              <CardContent className="p-0">
                <div className="relative h-80 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-4 right-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <h3 className="text-4xl font-bold mb-2 text-white">PADEL</h3>
                    <p className="text-xl opacity-90 mb-6 text-white">Palas, zapatillas, pelotas y más</p>
                    {/* Brand Logos */}
                    <div className="flex justify-center items-center gap-x-12">
                      <img
                        src="/optimized/adidas-logo.webp"
                        alt="Adidas Logo"
                        className="object-contain max-h-16 w-auto bg-white/80 rounded-lg p-2 shadow"
                        style={{ maxWidth: '100px' }}
                      />
                      <img
                        src="/optimized/wilson-logo.webp"
                        alt="Wilson Logo"
                        className="object-contain max-h-16 w-auto bg-white/80 rounded-lg p-2 shadow"
                        style={{ maxWidth: '100px' }}
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-400"></div>
                </div>
                <div className="p-8">
                  <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                    Descubre nuestra amplia selección de productos de padel de
                    las mejores marcas como Wilson y Adidas.
                  </p>
                  <Link href="/padel">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl py-3 group">
                      Explorar Padel
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Tenis de Mesa Card */}
            <Card
              className="group hover-lift card-modern border-0 overflow-hidden animate-scale-in"
              style={{ animationDelay: "0.2s" }}
            >
              <CardContent className="p-0">
                <div className="relative h-80 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-4 right-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <h3 className="text-4xl font-bold mb-2 text-white">TENIS DE MESA</h3>
                    <p className="text-xl opacity-90 mb-6 text-white">Paletas, gomas, mesas y accesorios</p>
                    {/* Brand Logos */}
                    <div className="flex justify-center items-center gap-x-8">
                      <img
                        src="/optimized/butterfly-logo.webp"
                        alt="Butterfly Logo"
                        className="object-contain max-h-16 w-auto bg-white/80 rounded-lg p-2 shadow"
                        style={{ maxWidth: '100px' }}
                      />
                      <img
                        src="/optimized/dhs-logo.webp"
                        alt="DHS Logo"
                        className="object-contain max-h-16 w-auto bg-white/80 rounded-lg p-2 shadow"
                        style={{ maxWidth: '100px' }}
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-400"></div>
                </div>
                <div className="p-8">
                  <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                    Equipamiento profesional de tenis de mesa con las mejores
                    marcas como Butterfly y DHS.
                  </p>
                  <Link href="/tenis-mesa">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl py-3 group">
                      Explorar Tenis de Mesa
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Tenis Card */}
            <Card
              className="group hover-lift card-modern border-0 overflow-hidden animate-scale-in"
              style={{ animationDelay: "0.4s" }}
            >
              <CardContent className="p-0">
                <div className="relative h-80 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-4 right-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <h3 className="text-4xl font-bold mb-2 text-white">TENIS</h3>
                    <p className="text-xl opacity-90 mb-6 text-white">Raquetas, zapatillas, pelotas y más</p>
                    {/* Brand Logos */}
                    <div className="flex justify-center items-center gap-x-12">
                      <img
                        src="/optimized/wilson-logo.webp"
                        alt="Wilson Logo"
                        className="object-contain max-h-16 w-auto bg-white/80 rounded-lg p-2 shadow"
                        style={{ maxWidth: '100px' }}
                      />
                      <img
                        src="/optimized/head-logo.webp"
                        alt="Head Logo"
                        className="object-contain max-h-16 w-auto bg-white/80 rounded-lg p-2 shadow"
                        style={{ maxWidth: '100px' }}
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-400"></div>
                </div>
                <div className="p-8">
                  <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                    Equipamiento profesional de tenis con las mejores
                    marcas como Wilson y Head.
                  </p>
                  <Link href="/tenis">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl py-3 group">
                      Explorar Tenis
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              ¿Por qué elegir FullSpin?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Somos tu mejor opción en equipamiento deportivo con años de
              experiencia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: "Calidad Premium",
                description:
                  "Productos originales de las mejores marcas del mercado",
                color: "from-blue-600 to-violet-600",
                delay: "0s",
              },
              {
                icon: Zap,
                title: "Entrega Rápida",
                description:
                  "Consulta disponibilidad y tiempos de entrega por WhatsApp",
                color: "from-blue-600 to-violet-600",
                delay: "0.1s",
              },
              {
                icon: Users,
                title: "Atención Personalizada",
                description: "Te asesoramos para elegir el equipamiento ideal",
                color: "from-blue-600 to-violet-600",
                delay: "0.2s",
              },
              {
                icon: Shield,
                title: "100% Originales",
                description:
                  "Garantía oficial de fábrica en todos nuestros productos",
                color: "from-blue-600 to-violet-600",
                delay: "0.3s",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center group animate-fade-in-up"
                style={{ animationDelay: feature.delay }}
              >
                <div
                  className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                >
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>





      {/* FAQ Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Preguntas Frecuentes
            </h2>
            <p className="text-xl text-gray-600">
              Resolvemos las dudas más comunes de nuestros clientes
            </p>
          </div>

          <div className="space-y-6">
            {/* FAQ Item 1 */}
            <Card className="group hover-lift card-modern border-0 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    ¿Cómo puedo consultar disponibilidad de productos?
                  </h3>
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">+</span>
                  </div>
                </div>
                <p className="text-gray-600 mt-4 leading-relaxed">
                  Puedes contactarnos directamente por WhatsApp al +54 370 510-3672 o por Instagram @fullspinargentina. Te responderemos en menos de 24 horas con toda la información sobre stock y precios.
                </p>
              </CardContent>
            </Card>

            {/* FAQ Item 2 */}
            <Card className="group hover-lift card-modern border-0 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    ¿Realizan envíos a todo el país?
                  </h3>
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">+</span>
                  </div>
                </div>
                <p className="text-gray-600 mt-4 leading-relaxed">
                  Sí, realizamos envíos a todo el territorio argentino. Los tiempos de entrega varían según la ubicación, pero generalmente son de 3-7 días hábiles. Consulta los costos de envío según tu localidad.
                </p>
              </CardContent>
            </Card>

            {/* FAQ Item 3 */}
            <Card className="group hover-lift card-modern border-0 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    ¿Los productos son originales?
                  </h3>
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">+</span>
                  </div>
                </div>
                <p className="text-gray-600 mt-4 leading-relaxed">
                  Absolutamente. Todos nuestros productos son 100% originales con garantía oficial de fábrica. Trabajamos directamente con distribuidores autorizados de las mejores marcas como Adidas, Wilson, Butterfly y DHS.
                </p>
              </CardContent>
            </Card>

            {/* FAQ Item 4 */}
            <Card className="group hover-lift card-modern border-0 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    ¿Pueden asesorarme para elegir el equipamiento adecuado?
                  </h3>
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">+</span>
                  </div>
                </div>
                <p className="text-gray-600 mt-4 leading-relaxed">
                  ¡Por supuesto! Nuestro equipo está especializado en padel y tenis de mesa. Te ayudaremos a elegir el equipamiento ideal según tu nivel, estilo de juego y presupuesto. No dudes en consultarnos.
                </p>
              </CardContent>
            </Card>

            {/* FAQ Item 5 */}
            <Card className="group hover-lift card-modern border-0 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    ¿Aceptan diferentes métodos de pago?
                  </h3>
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">+</span>
                  </div>
                </div>
                <p className="text-gray-600 mt-4 leading-relaxed">
                  Sí, aceptamos transferencias bancarias, efectivo, y todas las tarjetas de crédito y débito. También ofrecemos opciones de pago en cuotas sin interés según el producto y banco.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              ¿No encontraste la respuesta que buscabas?
            </p>
            <Button
              onClick={() => {
                const message = "Hola! Tengo una consulta sobre sus productos.";
                const whatsappUrl = `https://wa.me/543705103672?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, "_blank");
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            >
              <svg
                className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
              </svg>
              Consultar por WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              ¡Mantente Informado!
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Recibe las últimas ofertas, novedades y consejos de equipamiento directamente en tu email
            </p>
          </div>

          <Card className="group hover-lift card-modern border-0 overflow-hidden max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Beneficios Exclusivos
                  </h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      Ofertas especiales antes que nadie
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      Consejos de equipamiento personalizado
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      Novedades de productos
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      Descuentos exclusivos
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col justify-center">
                  <div className="mb-6">
                    <p className="text-gray-600 mb-4">
                      ¡Es gratis y sin spam!
                    </p>
                    
                    {/* Selector de tipo de suscripción */}
                    <div className="flex space-x-2 mb-4">
                      <button
                        type="button"
                        onClick={() => setSubscriptionType("email")}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          subscriptionType === "email"
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Email
                      </button>
                      <button
                        type="button"
                        onClick={() => setSubscriptionType("phone")}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          subscriptionType === "phone"
                            ? "bg-green-600 text-white shadow-lg"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <svg className="w-4 h-4 mr-2 inline" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                        </svg>
                        WhatsApp
                      </button>
                    </div>
                    
                    <form onSubmit={handleNewsletterSubscription} className="space-y-4">
                      {subscriptionType === "email" ? (
                        <div className="relative">
                          <input
                            type="email"
                            placeholder="tu@email.com"
                            value={newsletterEmail}
                            onChange={(e) => setNewsletterEmail(e.target.value)}
                            className="w-full px-4 py-3 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-500"
                            disabled={isSubscribing}
                          />
                        </div>
                      ) : (
                        <div className="relative">
                          <input
                            type="tel"
                            placeholder="+54 370 510-3672"
                            value={newsletterPhone}
                            onChange={(e) => setNewsletterPhone(e.target.value)}
                            className="w-full px-4 py-3 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 placeholder-gray-500"
                            disabled={isSubscribing}
                          />
                        </div>
                      )}
                      
                      <Button
                        type="submit"
                        disabled={isSubscribing}
                        className={`w-full px-6 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group disabled:opacity-50 disabled:cursor-not-allowed ${
                          subscriptionType === "email"
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                            : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                        }`}
                      >
                        {isSubscribing ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                            Suscribiendo...
                          </>
                        ) : (
                          <>
                            {subscriptionType === "email" ? (
                              <svg
                                className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            ) : (
                              <svg
                                className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                              </svg>
                            )}
                            Suscribirse al Newsletter
                          </>
                        )}
                      </Button>
                    </form>

                    {/* Mensaje de estado */}
                    {subscriptionMessage && (
                      <div className={`mt-4 p-3 rounded-lg text-sm ${
                        subscriptionStatus === "success" 
                          ? "bg-green-100 text-green-700 border border-green-200" 
                          : "bg-red-100 text-red-700 border border-red-200"
                      }`}>
                        {subscriptionMessage}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    Al suscribirte, aceptas recibir comunicaciones promocionales
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
          <div
            className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-xl animate-float"
            style={{ animationDelay: "3s" }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para mejorar tu juego?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Contáctanos por WhatsApp y te ayudaremos a encontrar el equipamiento
            perfecto para ti
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => {
                const message =
                  "Hola! Me gustaría obtener más información sobre sus productos.";
                const whatsappUrl = `https://wa.me/543705103672?text=${encodeURIComponent(
                  message
                )}`;
                window.open(whatsappUrl, "_blank");
              }}
              className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
            >
              <svg
                className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
              </svg>
              Contactar por WhatsApp
            </Button>
            <Button
              onClick={() => {
                window.open(
                  "https://www.instagram.com/fullspinargentina/",
                  "_blank"
                );
              }}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
            >
              <svg
                className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 2.75a5.75 5.75 0 1 1-5.75 5.75 5.75 5.75 0 0 1 5.75-5.75zm0 1.5a4.25 4.25 0 1 0 4.25 4.25A4.25 4.25 0 0 0 12 5.75zm5.25 1.25a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" />
              </svg>
              Contactar por Instagram
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <OptimizedImage
                  src={getOptimizedImage("/fullspin-logo.png")}
                  alt="FullSpin Logo"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <h3 className="text-2xl font-bold text-white">FullSpin</h3>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                Tu tienda especializada en equipamiento deportivo de primera
                calidad.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6">Categorías</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link
                    href="/padel"
                    className="hover:text-white transition-colors hover:translate-x-1 transform duration-300 inline-block"
                  >
                    Padel
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tenis-mesa"
                    className="hover:text-white transition-colors hover:translate-x-1 transform duration-300 inline-block"
                  >
                    Tenis de Mesa
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tenis"
                    className="hover:text-white transition-colors hover:translate-x-1 transform duration-300 inline-block"
                  >
                    Tenis
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6">Contacto</h3>
              <div className="space-y-3 text-gray-400">
                <p className="flex items-center">
                  <a
                    href="https://wa.me/543705103672"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-pink-500 transition-colors"
                  >
                    <svg
                      className="w-5 h-5 mr-3 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                    </svg>
                    +54 370 510-3672
                  </a>
                </p>
                <p className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-3 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  info@fullspin.com.ar
                </p>
                <p className="flex items-center">
                  <a
                    href="https://www.instagram.com/fullspinargentina/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <svg
                      className="w-5 h-5 mr-3 text-pink-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 2.75a5.75 5.75 0 1 1-5.75 5.75 5.75 5.75 0 0 1 5.75-5.75zm0 1.5a4.25 4.25 0 1 0 4.25 4.25A4.25 4.25 0 0 0 12 5.75zm5.25 1.25a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" />
                    </svg>
                    <span className="text-gray-400 hover:text-pink-500 transition-colors">
                      @fullspinargentina
                    </span>
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

      <Link href="/ofertas">
        <button
          className="fixed left-4 bottom-6 z-50 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-6 py-3 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-2 border border-white/20 transition-all duration-300 hover:scale-110 hover:shadow-2xl animate-float"
          style={{ fontSize: "0.9rem", letterSpacing: "0.02em" }}
        >
          <Tag className="w-5 h-5 text-white" />
          OFERTAS
        </button>
      </Link>

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
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="space-y-4">
                  <div className="bg-gray-100 rounded-2xl p-8 flex items-center justify-center aspect-square">
                    <img
                      src={selectedProduct.image || "/placeholder.svg"}
                      alt={selectedProduct.name}
                      className="w-full h-full object-contain max-w-sm"
                    />
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                  {/* Product Name & Brand */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedProduct.name}
                    </h3>
                    <p className="text-lg text-gray-600 font-medium">
                      {selectedProduct.marca}
                    </p>
                    <p className="text-sm text-gray-500 capitalize mt-1">
                      {selectedProduct.category === "padel" ? "Padel" : selectedProduct.category === "tenis-mesa" ? "Tenis de Mesa" : "Tenis"}
                      {selectedProduct.subcategory && ` • ${selectedProduct.subcategory}`}
                    </p>
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

      {/* WhatsApp Floating Button */}
      <button
        onClick={() => {
          const message = "Hola! Me gustaría obtener más información sobre sus productos.";
          const whatsappUrl = `https://wa.me/543705103672?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, "_blank");
        }}
        className="fixed right-4 bottom-6 z-50 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold p-4 rounded-full shadow-xl backdrop-blur-md flex items-center justify-center border border-white/20 transition-all duration-300 hover:scale-110 hover:shadow-2xl animate-float"
        style={{ animationDelay: "1s" }}
        aria-label="Contactar por WhatsApp"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
      </button>

      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        /* Asegurar que el hover azul funcione correctamente */
        .group:hover .group-hover\\:text-blue-600 {
          color: #2563eb !important;
        }
        
        /* Estilo específico para los títulos de productos en ofertas */
        .group:hover h3.text-lg.font-bold.text-gray-800.text-center {
          color: #2563eb !important;
        }
      `}</style>


    </div>
  );
}
