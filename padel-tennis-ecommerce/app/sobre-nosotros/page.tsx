"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SobreNosotrosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-4 cursor-pointer">
              <Image src="/fullspin-logo.png" alt="FullSpin Logo" width={50} height={50} className="rounded-lg" />
              <h1 className="text-2xl font-bold text-gray-900 hover:text-orange-600 transition-colors">FullSpin</h1>
            </Link>

            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors">
                Padel
              </Link>
              <Link href="/sobre-nosotros" className="text-sm font-medium text-orange-600 border-b-2 border-orange-600">
                Sobre nosotros
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al catálogo
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-orange-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Sobre Nosotros</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conoce la historia detrás de FullSpin y nuestro compromiso con el mundo del padel
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">FullSpin - Tu Tienda de Confianza</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                En FullSpin somos apasionados del padel y nos dedicamos a brindar el mejor equipamiento deportivo para
                jugadores de todos los niveles. Con años de experiencia en el sector, entendemos las necesidades
                específicas de cada deportista.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Trabajamos con las mejores marcas del mercado como Wilson, Adidas, Head, Babolat y Bullpadel para
                garantizar productos de máxima calidad. Nuestro compromiso es ayudarte a encontrar el equipamiento
                perfecto para mejorar tu juego.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Desde palas profesionales hasta accesorios especializados, cada producto en nuestro catálogo ha sido
                cuidadosamente seleccionado para ofrecerte la mejor experiencia de compra y rendimiento en la cancha.
              </p>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl p-8">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-orange-500 rounded-full mx-auto flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Calidad Garantizada</h3>
                  <p className="text-gray-600">
                    Todos nuestros productos son originales y cuentan con garantía oficial de fábrica.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">100+</div>
              <div className="text-gray-600 font-medium">Productos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">5+</div>
              <div className="text-gray-600 font-medium">Marcas Premium</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Atención WhatsApp</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">100%</div>
              <div className="text-gray-600 font-medium">Productos Originales</div>
            </div>
          </div>

          {/* Services */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Entrega Rápida</h3>
              <p className="text-gray-600">Consulta disponibilidad y tiempos de entrega por WhatsApp</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Atención Personalizada</h3>
              <p className="text-gray-600">Te asesoramos para elegir el equipamiento ideal para tu nivel</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Productos Originales</h3>
              <p className="text-gray-600">Trabajamos directamente con distribuidores oficiales</p>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-orange-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Misión</h3>
              <p className="text-gray-600 leading-relaxed">
                Proporcionar a los jugadores de padel el mejor equipamiento deportivo, combinando calidad, variedad y un
                servicio excepcional. Queremos ser tu aliado en cada partido y ayudarte a alcanzar tu máximo potencial
                en la cancha.
              </p>
            </div>

            <div className="bg-blue-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Visión</h3>
              <p className="text-gray-600 leading-relaxed">
                Ser la tienda de referencia en equipamiento de padel, reconocida por la calidad de nuestros productos,
                la confiabilidad de nuestro servicio y nuestro compromiso con el crecimiento de este deporte que tanto
                amamos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-orange-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">¿Tienes alguna pregunta?</h2>
          <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Contáctanos por WhatsApp y te asesoraremos en todo lo que necesites.
          </p>
          <Button
            onClick={() => {
              const message = "Hola! Me gustaría obtener más información sobre sus productos."
              const whatsappUrl = `https://wa.me/543705103672?text=${encodeURIComponent(message)}`
              window.open(whatsappUrl, "_blank")
            }}
            className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
          >
            Contactar por WhatsApp
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">FullSpin</h3>
              <p className="text-gray-400">Tu tienda especializada en equipamiento de padel.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <p className="text-gray-400">WhatsApp: +54 370 510-3672</p>
              <p className="text-gray-400">Email: info@fullspin.com.ar</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Horarios</h3>
              <p className="text-gray-400">Lunes a Viernes: 9:00 - 18:00</p>
              <p className="text-gray-400">Sábados: 9:00 - 13:00</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 FullSpin. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
