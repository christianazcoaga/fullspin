'use client' // Error components must be Client Components
 
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-red-100 to-yellow-100 text-center px-4">
        <div className="p-8 md:p-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl max-w-2xl w-full animate-fade-in-up border border-red-200/50">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-red-600 mb-4">¡Oops! Algo salió mal.</h1>
            <p className="text-gray-600 text-lg mb-8">
                Lo sentimos, pero parece que ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                    onClick={() => reset()}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                    Intentar de nuevo
                </Button>
                <Link href="/">
                    <Button
                        variant="outline"
                        className="bg-transparent hover:bg-red-50 text-red-600 border-red-200 hover:border-red-300 px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full"
                    >
                        Volver al Inicio
                    </Button>
                </Link>
            </div>
            <div className="mt-8 text-sm text-gray-500">
                <p>Si el problema persiste, puedes contactar a soporte.</p>
                <p className="mt-1 font-mono bg-red-50 text-red-600 px-2 py-1 rounded-md inline-block">
                    Error Digest: {error.digest || 'N/A'}
                </p>
            </div>
        </div>
    </div>
  )
} 