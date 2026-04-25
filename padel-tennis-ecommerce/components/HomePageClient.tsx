"use client";

import Image from "next/image";
import OptimizedImage from "@/components/OptimizedImage";
import Link from "next/link";
import {
  Menu,
  X,
  ArrowRight,
  MessageCircle,
  Users,
  Award,
  Zap,
  Shield,
  Tag,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getProducts, type Product } from "@/lib/products";
import { subscribeToNewsletter, subscribePhoneToNewsletter } from "@/lib/newsletter";
import { getOptimizedImage, getImageSrcSet } from "@/lib/image-mapping";

import { ProductOfferSection } from "@/components/home/ProductOfferSection";

export default function HomePageClient({
  initialPadelOffers = [],
  initialTenisMesaOffers = [],
  initialTenisOffers = [],
  initialComingSoonProducts = []
}: {
  initialPadelOffers: Product[];
  initialTenisMesaOffers: Product[];
  initialTenisOffers: Product[];
  initialComingSoonProducts: Product[];
}) {
  const [isLoading, setIsLoading] = useState(false);
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

  const handleWhatsAppClick = (product: Product) => {
    const message = product.coming_soon
      ? `Hola! Quiero consultar sobre la ${product.name} de ${product.marca} que estará disponible próximamente.`
      : `Hola! Me interesa la ${product.name} de ${product.marca}. ¿Tienen stock disponible?`;
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
    <div className="bg-brand-cream">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-24">
        <div className="absolute inset-0">
          <img src="/BG-INICIO.png" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-blue-900/40" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center animate-fade-in-up">
            <div className="inline-block mb-6 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold tracking-wide uppercase">
              Nueva Temporada 2026
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.1] mb-6">
              ELEVA TU <br />
              <span className="gradient-text">
                NIVEL DE JUEGO
              </span>
            </h1>

            <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto font-medium">
              El mejor equipamiento deportivo para Padel, Tenis y Tenis de Mesa.
              Calidad premium, marcas originales y asesoramiento personalizado.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/padel">
                <Button className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-blue-900/20 hover:shadow-2xl">
                  Ver Catalogo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/ofertas">
                <Button className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-full font-bold text-lg transition-all hover:bg-white/10">
                  Explorar Ofertas
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/50 animate-fade-in-up pointer-events-none" style={{ animationDelay: "1s" }}>
          <span className="text-[10px] font-bold uppercase tracking-widest">Explorar</span>
          <div className="w-[2px] h-8 bg-white/20 overflow-hidden rounded-full">
            <div className="w-full h-1/2 bg-white rounded-full animate-scroll-indicator" />
          </div>
        </div>
      </section>

      {/* Promotional Image Carousel Section */}
      <section className="w-full bg-white">
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-0">
            {/* Slide 1 - Edición 2026 Promotional Banner */}
            <CarouselItem className="pl-0 basis-full">
              <div className="relative w-full h-[200px] xs:h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] bg-white flex items-center justify-center overflow-hidden">
                <OptimizedImage
                  src="/optimized/adidas_2026.webp"
                  alt="Metalbone Edición 2026 - Power of Nature"
                  fill
                  sizes="100vw"
                  className="w-full h-full"
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
            </CarouselItem>
            {/* Slide 2 - Adidas Banner */}
            <CarouselItem className="pl-0 basis-full">
              <div className="relative w-full h-[200px] xs:h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] bg-white flex items-center justify-center overflow-hidden">
                <OptimizedImage
                  src="/optimized/adidas-banner.webp"
                  alt="Adidas Banner"
                  fill
                  sizes="100vw"
                  className="w-full h-full"
                  style={{ objectFit: 'contain' }}
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

      {/* Coming Soon Products Section */}
      {initialComingSoonProducts.length > 0 && (
        <ProductOfferSection
          title="Proximamente"
          subtitle="Productos que estarán disponibles muy pronto"
          products={initialComingSoonProducts}
          categoryLink="/padel"
          categoryName="Productos"
          isComingSoon={true}
          onProductClick={openProductModal}
          variant="blue"
        />
      )}

      {/* Padel Offers Section */}
      <ProductOfferSection
        title="Ofertas de Padel"
        subtitle="Productos de padel con descuentos especiales"
        products={initialPadelOffers}
        categoryLink="/padel"
        categoryName="Padel"
        onProductClick={openProductModal}
        variant="blue"
      />

      {/* Tenis de Mesa Offers Section */}
      <ProductOfferSection
        title="Ofertas de Tenis de Mesa"
        subtitle="Productos de tenis de mesa con descuentos especiales"
        products={initialTenisMesaOffers}
        categoryLink="/tenis-mesa"
        categoryName="Tenis de Mesa"
        onProductClick={openProductModal}
        variant="white"
      />

      {/* Tenis Offers Section */}
      <ProductOfferSection
        title="Ofertas de Tenis"
        subtitle="Productos de tenis con descuentos especiales"
        products={initialTenisOffers}
        categoryLink="/tenis"
        categoryName="Tenis"
        onProductClick={openProductModal}
        variant="blue"
      />

      {/* Banner Carousel Section (Brand Logos) */}
      <section className="py-16 bg-white">
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
      <section id="categorias" className="py-24 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
                NUESTRAS <span className="text-blue-200">CATEGORIAS</span>
              </h2>
              <p className="text-lg text-blue-100 font-medium">
                Encuentra el equipamiento perfecto para tu deporte favorito.
              </p>
            </div>
            <Link href="/padel" className="hidden md:flex items-center gap-2 text-white font-bold hover:underline mt-4 md:mt-0">
              Ver todo el catalogo <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "PADEL",
                description: "Palas, zapatillas, pelotas y accesorios para dominar la pista.",
                href: "/padel",
                gradient: "from-blue-500 via-blue-600 to-blue-700",
                logos: [
                  { src: "/optimized/adidas-logo.webp", alt: "Adidas" },
                  { src: "/optimized/wilson-logo.webp", alt: "Wilson" },
                ],
              },
              {
                title: "TENIS DE MESA",
                description: "Maderas, gomas, mesas y todo lo necesario para tu juego.",
                href: "/tenis-mesa",
                gradient: "from-gray-700 via-gray-800 to-gray-900",
                logos: [
                  { src: "/optimized/butterfly-logo.webp", alt: "Butterfly" },
                  { src: "/optimized/dhs-logo.webp", alt: "DHS" },
                ],
              },
              {
                title: "TENIS",
                description: "Raquetas, cuerdas, indumentaria y calzado de primer nivel.",
                href: "/tenis",
                gradient: "from-blue-600 via-blue-700 to-blue-800",
                logos: [
                  { src: "/optimized/wilson-logo.webp", alt: "Wilson" },
                  { src: "/optimized/head-logo.webp", alt: "Head" },
                ],
              },
            ].map((cat, index) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group relative h-[420px] rounded-3xl overflow-hidden block shadow-lg animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-3xl font-black text-white mb-2 tracking-tight">{cat.title}</h3>
                    <p className="text-gray-200 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {cat.description}
                    </p>
                    <div className="flex items-center gap-4 mb-4">
                      {cat.logos.map((logo) => (
                        <img
                          key={logo.alt}
                          src={logo.src}
                          alt={logo.alt}
                          className="object-contain max-h-10 w-auto bg-white/90 rounded-lg px-3 py-1 shadow-sm"
                        />
                      ))}
                    </div>
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white group-hover:scale-110 transition-transform">
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <Link href="/padel" className="md:hidden flex items-center justify-center gap-2 text-white font-bold mt-8 hover:underline">
            Ver todo el catalogo <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-blue-600 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
              POR QUE ELEGIR <span className="text-blue-200">FULLSPIN?</span>
            </h2>
            <p className="text-lg text-blue-100 font-medium">
              Nos apasiona el deporte tanto como a vos. Por eso te ofrecemos lo mejor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Award, title: "Calidad Premium", description: "Seleccionamos los mejores productos para garantizar tu maximo rendimiento." },
              { icon: Zap, title: "Entrega Rapida", description: "Envios a todo el pais con seguimiento en tiempo real." },
              { icon: Users, title: "Atencion Personalizada", description: "Asesoramiento experto para ayudarte a elegir tu equipamiento ideal." },
              { icon: Shield, title: "100% Originales", description: "Trabajamos directamente con las mejores marcas del mercado." },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-3xl hover:bg-white/20 transition-colors animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-white text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-blue-100 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>





      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">
              PREGUNTAS <span className="text-blue-600">FRECUENTES</span>
            </h2>
            <p className="text-lg text-gray-600 font-medium">
              Resolvemos tus dudas para que compres con total confianza.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "Como puedo consultar disponibilidad de productos?",
                answer: "Puedes contactarnos directamente por WhatsApp al +54 370 510-3672 o por Instagram @fullspinargentina. Te responderemos en menos de 24 horas con toda la informacion sobre stock y precios.",
              },
              {
                question: "Realizan envios a todo el pais?",
                answer: "Si, realizamos envios a todo el territorio argentino. Los tiempos de entrega varian segun la ubicacion, pero generalmente son de 3-7 dias habiles. Consulta los costos de envio segun tu localidad.",
              },
              {
                question: "Los productos son originales?",
                answer: "Absolutamente. Todos nuestros productos son 100% originales con garantia oficial de fabrica. Trabajamos directamente con distribuidores autorizados de las mejores marcas como Adidas, Wilson, Butterfly y DHS.",
              },
              {
                question: "Pueden asesorarme para elegir el equipamiento adecuado?",
                answer: "Por supuesto! Nuestro equipo esta especializado en padel y tenis de mesa. Te ayudaremos a elegir el equipamiento ideal segun tu nivel, estilo de juego y presupuesto.",
              },
              {
                question: "Aceptan diferentes metodos de pago?",
                answer: "Si, aceptamos transferencias bancarias, efectivo, y todas las tarjetas de credito y debito. Tambien ofrecemos opciones de pago en cuotas sin interes segun el producto y banco.",
              },
            ].map((faq, index) => {
              const isOpen = index === 0;
              return (
                <div
                  key={index}
                  className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-full flex items-center justify-between p-6 text-left">
                    <span className="text-lg font-bold text-gray-900 pr-8">
                      {faq.question}
                    </span>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-50 text-blue-600 flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100">
                    {faq.answer}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">No encontraste la respuesta que buscabas?</p>
            <Button
              onClick={() => {
                const message = "Hola! Tengo una consulta sobre sus productos.";
                const whatsappUrl = `https://wa.me/543705103672?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, "_blank");
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            >
              <MessageCircle className="w-5 h-5 mr-3" />
              Consultar por WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Mantente Informado!
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Recibe las ultimas ofertas, novedades y consejos de equipamiento directamente en tu email
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
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      Consejos de equipamiento personalizado
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      Novedades de productos
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
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
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-green-600 hover:bg-green-700 text-white"
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
      <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: "3s" }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6">
            LISTO PARA MEJORAR TU JUEGO?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Contactanos por WhatsApp y te ayudaremos a encontrar el equipamiento perfecto para ti.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => {
                const message = "Hola! Me gustaria obtener mas informacion sobre sus productos.";
                const whatsappUrl = `https://wa.me/543705103672?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, "_blank");
              }}
              className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 text-lg font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
            >
              <MessageCircle className="w-5 h-5 mr-3" />
              Contactar por WhatsApp
            </Button>
            <Button
              onClick={() => {
                window.open("https://www.instagram.com/fullspinargentina/", "_blank");
              }}
              className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 px-10 py-4 text-lg font-bold rounded-full transition-all duration-300 hover:scale-105"
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 2.75a5.75 5.75 0 1 1-5.75 5.75 5.75 5.75 0 0 1 5.75-5.75zm0 1.5a4.25 4.25 0 1 0 4.25 4.25A4.25 4.25 0 0 0 12 5.75zm5.25 1.25a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" />
              </svg>
              Seguinos en Instagram
            </Button>
          </div>
        </div>
      </section>

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

                  {/* Price or Coming Soon Badge */}
                  {selectedProduct.coming_soon ? (
                    <div className="bg-blue-50 rounded-xl p-6 text-center">
                      <div className="inline-flex items-center justify-center px-6 py-3 bg-blue-100 text-blue-700 rounded-lg font-bold text-xl">
                        Proximamente
                      </div>
                      <p className="text-gray-600 mt-3 text-sm">
                        Este producto estará disponible muy pronto
                      </p>
                    </div>
                  ) : (
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
                  )}

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
