import { getAllProducts } from "@/lib/products.server"
import AdminClientPage from "./AdminClientPage"
import { Suspense } from "react"
import { Metadata } from "next"
import { getConversionRate } from "@/lib/settings.server"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Panel de Administración - FullSpin",
  description: "Gestiona productos, imágenes y contenido de la tienda FullSpin",
  robots: "noindex, nofollow", // Proteger el panel de admin
}

function AdminPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Skeleton */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-4">
            <div>
              <div className="h-8 bg-gray-200 rounded-lg w-64 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-lg w-28 animate-pulse"></div>
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm border-0 shadow-sm rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded w-16 mb-1 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                  </div>
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Search Skeleton */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-10 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-lg w-10 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm border-0 shadow-sm rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="p-3 border border-gray-200 rounded-lg bg-white/60">
                    <div className="flex items-center space-x-3">
                      <div className="w-14 h-14 bg-gray-200 rounded-lg animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-24 mb-1 animate-pulse"></div>
                        <div className="flex gap-2">
                          <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
                          <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm border-0 shadow-sm rounded-lg p-6">
              <div className="flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mb-3 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-64 mb-4 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AdminErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar el panel</h2>
        <p className="text-gray-600 mb-4">
          Ha ocurrido un error al cargar los productos. Por favor, intenta nuevamente.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Recargar página
        </button>
        <p className="text-xs text-gray-500 mt-4">
          Error: {error.message}
        </p>
      </div>
    </div>
  )
}

export default async function AdminPage() {
  try {
    const [products, conversionRate] = await Promise.all([
      getAllProducts(),
      getConversionRate()
    ])

    return (
      <Suspense fallback={<AdminPageSkeleton />}>
        <AdminClientPage initialProducts={products} conversionRate={conversionRate} />
      </Suspense>
    )
  } catch (error) {
    console.error("Error loading admin page:", error)
    return <AdminErrorBoundary error={error as Error} />
  }
}
