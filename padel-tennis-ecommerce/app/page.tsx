"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  X,
  ArrowRight,
  Star,
  Users,
  Award,
  Zap,
  Sparkles,
  TrendingUp,
  Shield,
  Tag,
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

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
                <Image
                  src="/fullspin-logo.png"
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
                href="/sobre-nosotros"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors relative group"
              >
                <span className="relative z-10">Sobre nosotros</span>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
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
          <Image
            src="/padel-racket-bg.png"
            alt="Padel Racket"
            width={420}
            height={420}
            className="transform -rotate-45"
            priority
          />
        </div>
        <div
          className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 opacity-15 drop-shadow-lg hidden lg:block pointer-events-none"
          style={{ top: "50%" }}
        >
          <Image
            src="/tt-paddle-bg.png"
            alt="Table Tennis Paddle"
            width={420}
            height={420}
            className="transform rotate-45"
            priority
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Bienvenido a{" "}
              <span className="gradient-text relative">
                FullSpin
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Especialistas en{" "}
              <span className="font-semibold text-blue-600">Padel</span> y{" "}
              <span className="font-semibold text-purple-600">
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
                <Button
                  variant="outline"
                  className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                >
                  Productos de Tenis de Mesa
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Image Carousel Section */}
      <section className="py-10 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full mb-10"
          >
            <CarouselContent>
              {/* Slide 1 - Adidas Banner */}
              <CarouselItem className="md:basis-1/1 flex items-center justify-center">
                <div className="relative h-96 md:h-[32rem] w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex items-center justify-center">
                  <Image
                    src="/adidas-banner.png"
                    alt="Adidas Banner"
                    fill
                    className="object-contain bg-neutral-100"
                    style={{ borderRadius: "1rem" }}
                    priority
                  />
                </div>
              </CarouselItem>
              {/* Slide 2 - Butterfly Banner */}
              <CarouselItem className="md:basis-1/1 flex items-center justify-center">
                <div className="relative h-96 md:h-[32rem] w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex items-center justify-center">
                  <Image
                    src="/butterfly-banner.png"
                    alt="Butterfly Banner"
                    fill
                    className="object-contain bg-neutral-100"
                    style={{ borderRadius: "1rem" }}
                    priority
                  />
                </div>
              </CarouselItem>
              {/* Slide 3 - DHS Banner */}
              <CarouselItem className="md:basis-1/1 flex items-center justify-center">
                <div className="relative h-96 md:h-[32rem] w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex items-center justify-center">
                  <Image
                    src="/dhs-banner.png"
                    alt="DHS Banner"
                    fill
                    className="object-contain bg-neutral-100"
                    style={{ borderRadius: "1rem" }}
                  />
                </div>
              </CarouselItem>
              {/* Slide 4 - Wilson Banner */}
              <CarouselItem className="md:basis-1/1 flex items-center justify-center">
                <div className="relative h-96 md:h-[32rem] w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex items-center justify-center">
                  <Image
                    src="/wilson-banner.png"
                    alt="Wilson Banner"
                    fill
                    className="object-contain bg-neutral-100"
                    style={{ borderRadius: "1rem" }}
                  />
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-white/80 hover:bg-white text-gray-800 border-0 shadow-lg" />
            <CarouselNext className="right-4 bg-white/80 hover:bg-white text-gray-800 border-0 shadow-lg" />
          </Carousel>
        </div>
      </section>

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
                    <Image
                      src="/butterfly-logo.png"
                      alt="Butterfly Logo"
                      width={120}
                      height={60}
                      className="object-contain max-h-20 md:max-h-32 w-auto"
                      priority
                    />
                    <Image
                      src="/dhs-logo.png"
                      alt="DHS Logo"
                      width={120}
                      height={60}
                      className="object-contain max-h-20 md:max-h-32 w-auto"
                    />
                    <Image
                      src="/sanwei-logo.png"
                      alt="Sanwei Logo"
                      width={50}
                      height={22}
                      className="object-contain max-h-6 md:max-h-10 w-auto"
                    />
                  </div>
                </div>
              </CarouselItem>
              {/* Slide 2 - Adidas & Wilson Logos */}
              <CarouselItem className="md:basis-1/1 flex items-center justify-center">
                <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 h-80 md:h-96 bg-white rounded-2xl shadow-2xl px-4 md:px-8 py-6 md:py-0">
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
                    <span className="text-2xl md:text-3xl font-bold text-gray-700">
                      PADEL
                    </span>
                  </div>
                  <Image
                    src="/adidas-logo.png"
                    alt="Adidas Logo"
                    width={140}
                    height={70}
                    className="object-contain max-h-20 md:max-h-32 w-auto"
                  />
                  <Image
                    src="/wilson-logo.png"
                    alt="Wilson Logo"
                    width={140}
                    height={70}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h3 className="text-4xl font-bold mb-2">PADEL</h3>
                      <p className="text-xl opacity-90 mb-6">
                        Palas, zapatillas, pelotas y más
                      </p>
                      {/* Brand Logos */}
                      <div className="flex justify-center items-center gap-x-12">
                        <Image
                          src="/adidas-logo.png"
                          alt="Adidas Logo"
                          width={120}
                          height={70}
                          className="object-contain opacity-60 filter grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                        />
                        <Image
                          src="/wilson-logo.png"
                          alt="Wilson Logo"
                          width={140}
                          height={70}
                          className="object-contain opacity-60 filter grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                        />
                      </div>
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
                <div className="relative h-80 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-4 right-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h3 className="text-4xl font-bold mb-2">TENIS DE MESA</h3>
                      <p className="text-xl opacity-90 mb-6">
                        Paletas, gomas, mesas y accesorios
                      </p>
                      {/* Brand Logos */}
                      <div className="flex justify-center items-center gap-x-6">
                        <Image
                          src="/butterfly-logo.png"
                          alt="Butterfly Logo"
                          width={80}
                          height={50}
                          className="object-contain opacity-60 filter grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                        />
                        <Image
                          src="/dhs-logo.png"
                          alt="DHS Logo"
                          width={80}
                          height={50}
                          className="object-contain opacity-60 filter grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-400"></div>
                </div>
                <div className="p-8">
                  <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                    Equipamiento profesional de tenis de mesa con las mejores
                    marcas como Butterfly y DHS.
                  </p>
                  <Link href="/tenis-mesa">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white rounded-xl py-3 group">
                      Explorar Tenis de Mesa
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
                <Image
                  src="/fullspin-logo.png"
                  alt="FullSpin Logo"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <h3 className="text-2xl font-bold gradient-text">FullSpin</h3>
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
          className="fixed left-6 bottom-8 z-50 bg-red-600 hover:bg-red-700 text-white font-extrabold px-8 py-4 rounded-full shadow-2xl backdrop-blur-lg flex items-center gap-3 border-4 border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_32px_0_rgba(255,0,0,0.25)] animate-bounce-slow ring-2 ring-red-300/40"
          style={{ minWidth: 200, fontSize: "1.2rem", letterSpacing: "0.05em" }}
        >
          <Tag className="w-7 h-7 text-white drop-shadow" />
          OFERTAS DEL MES
        </button>
      </Link>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2.5s infinite;
        }
      `}</style>
    </div>
  );
}
