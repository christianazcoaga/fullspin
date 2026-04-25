"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Award,
  Zap,
  Sparkles,
  TrendingUp,
  Shield,
  Star,
  MessageCircle,
  Heart,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SobreNosotrosPage() {
  return (
    <div className="bg-brand-cream">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-pink-600/10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Sobre{" "}
              <span className="text-blue-600 relative">
                Nosotros
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-blue-600 rounded-full"></div>
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Somos una tienda argentina, especialistas en{" "}
              <span className="font-semibold text-blue-600">Padel</span>,{" "}
              <span className="font-semibold text-blue-600">
                Tenis de Mesa
              </span>{" "}
              y <span className="font-semibold text-blue-600">Tenis</span>{" "}
              en Argentina. Envíos a todo el país.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/padel">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                  Productos de Padel
                  <ArrowLeft className="ml-2 h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <Link href="/tenis-mesa">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                  Productos de Tenis de Mesa
                  <ArrowLeft className="ml-2 h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <Link href="/tenis">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                  Productos de Tenis
                  <ArrowLeft className="ml-2 h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 animate-fade-in-up">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                FullSpin - Tu Tienda de Confianza
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                En FullSpin somos apasionados del deporte y nos dedicamos a
                brindar el mejor equipamiento deportivo para jugadores de todos
                los niveles. Con años de experiencia en el sector, entendemos
                las necesidades específicas de cada deportista.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Trabajamos con las mejores marcas del mercado como Wilson,
                Adidas, Head, Babolat y Bullpadel para garantizar productos de
                máxima calidad. Nuestro compromiso es ayudarte a encontrar el
                equipamiento perfecto para mejorar tu juego.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Desde palas profesionales hasta accesorios especializados, cada
                producto en nuestro catálogo ha sido cuidadosamente seleccionado
                para ofrecerte la mejor experiencia de compra y rendimiento en
                la cancha.
              </p>
            </div>

            <Card className="card-modern hover-lift overflow-hidden animate-scale-in">
              <CardContent className="p-0">
                <div className="relative h-80 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 p-8">
                  <div className="absolute top-4 right-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-center text-white h-full flex flex-col justify-center">
                    <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center bg-white/20 backdrop-blur-sm mb-6">
                      <Shield className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-4">
                      Calidad Garantizada
                    </h3>
                    <p className="text-white/90 text-lg">
                      Todos nuestros productos son originales y cuentan con
                      garantía oficial de fábrica.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 animate-fade-in-up">
            <Card className="card-modern hover-lift text-center p-6 animate-scale-in">
              <CardContent className="p-0">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  100+
                </div>
                <div className="text-gray-600 font-medium">Productos</div>
              </CardContent>
            </Card>
            <Card
              className="card-modern hover-lift text-center p-6 animate-scale-in"
              style={{ animationDelay: "0.1s" }}
            >
              <CardContent className="p-0">
                <div className="text-4xl font-bold text-blue-600 mb-2">5+</div>
                <div className="text-gray-600 font-medium">Marcas Premium</div>
              </CardContent>
            </Card>
            <Card
              className="card-modern hover-lift text-center p-6 animate-scale-in"
              style={{ animationDelay: "0.2s" }}
            >
              <CardContent className="p-0">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  24/7
                </div>
                <div className="text-gray-600 font-medium">
                  Atención WhatsApp
                </div>
              </CardContent>
            </Card>
            <Card
              className="card-modern hover-lift text-center p-6 animate-scale-in"
              style={{ animationDelay: "0.3s" }}
            >
              <CardContent className="p-0">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  100%
                </div>
                <div className="text-gray-600 font-medium">
                  Productos Originales
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Services */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-fade-in-up">
            <Card className="card-modern hover-lift text-center p-6 animate-scale-in">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full mx-auto flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Entrega Rápida
                </h3>
                <p className="text-gray-600">
                  Consulta disponibilidad y tiempos de entrega por WhatsApp
                </p>
              </CardContent>
            </Card>

            <Card
              className="card-modern hover-lift text-center p-6 animate-scale-in"
              style={{ animationDelay: "0.1s" }}
            >
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full mx-auto flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Atención Personalizada
                </h3>
                <p className="text-gray-600">
                  Te asesoramos para elegir el equipamiento ideal para tu nivel
                </p>
              </CardContent>
            </Card>

            <Card
              className="card-modern hover-lift text-center p-6 animate-scale-in"
              style={{ animationDelay: "0.2s" }}
            >
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full mx-auto flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Productos Originales
                </h3>
                <p className="text-gray-600">
                  Trabajamos directamente con distribuidores oficiales
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-fade-in-up">
            <Card className="card-modern hover-lift p-8 animate-scale-in">
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full flex items-center justify-center mr-4">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Nuestra Misión
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Proporcionar a los jugadores de padel el mejor equipamiento
                  deportivo, combinando calidad, variedad y un servicio
                  excepcional. Queremos ser tu aliado en cada partido y ayudarte
                  a alcanzar tu máximo potencial en la cancha.
                </p>
              </CardContent>
            </Card>

            <Card
              className="card-modern hover-lift p-8 animate-scale-in"
              style={{ animationDelay: "0.1s" }}
            >
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full flex items-center justify-center mr-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Nuestra Visión
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Ser la tienda de referencia en equipamiento de padel,
                  reconocida por la calidad de nuestros productos, la
                  confiabilidad de nuestro servicio y nuestro compromiso con el
                  crecimiento de este deporte que tanto amamos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float"></div>
        <div
          className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Tienes alguna pregunta?
          </h2>
          <p className="text-blue-100 text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Estamos aquí para ayudarte. Contáctanos por WhatsApp y te
            asesoraremos en todo lo que necesites.
          </p>
          <Button
            onClick={() => {
              const message =
                "Hola! Me gustaría obtener más información sobre sus productos.";
              const whatsappUrl = `https://wa.me/543705103672?text=${encodeURIComponent(
                message
              )}`;
              window.open(whatsappUrl, "_blank");
            }}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Contactar por WhatsApp
          </Button>
        </div>
      </section>

    </div>
  );
}
