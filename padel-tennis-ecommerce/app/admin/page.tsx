import { getAllProducts } from "@/lib/products"
import AdminClientPage from "./AdminClientPage"
import { Suspense } from "react"

function AdminPageSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando productos...</p>
      </div>
    </div>
  )
}

export default async function AdminPage() {
  const products = await getAllProducts()

  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <AdminClientPage initialProducts={products} />
    </Suspense>
  )
}
