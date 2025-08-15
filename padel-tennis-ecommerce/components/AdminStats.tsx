"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Package, 
  BarChart3, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  DollarSign,
  ShoppingCart,
  Eye
} from "lucide-react"
import { type Product } from "@/lib/products"

interface AdminStatsProps {
  products: Product[]
}

export function AdminStats({ products }: AdminStatsProps) {
  const stats = {
    total: products.length,
    padel: products.filter(p => p.category === 'padel').length,
    tenisMesa: products.filter(p => p.category === 'tenis-mesa').length,
    tenis: products.filter(p => p.category === 'tenis').length,
    inOffer: products.filter(p => p.in_offer).length,
    inStock: products.filter(p => p.in_stock).length,
    outOfStock: products.filter(p => !p.in_stock).length,
    totalValue: products.reduce((sum, p) => sum + p.price, 0),
    averagePrice: products.length > 0 ? products.reduce((sum, p) => sum + p.price, 0) / products.length : 0
  }

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-AR').replace(/,/g, '.')}`
  }

  const getCategoryPercentage = (category: string) => {
    if (stats.total === 0) return 0
    const count = category === 'padel' ? stats.padel : category === 'tenis-mesa' ? stats.tenisMesa : stats.tenis
    return Math.round((count / stats.total) * 100)
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-3 mb-4">
      {/* Total Products */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-2 sm:p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Productos</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.inStock} en stock • {stats.outOfStock} sin stock
              </p>
            </div>
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-full">
              <Package className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Padel Products */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-2 sm:p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Padel</p>
              <p className="text-lg sm:text-2xl font-bold text-blue-600">{stats.padel}</p>
              <p className="text-xs text-gray-500 mt-1">
                {getCategoryPercentage('padel')}% del total
              </p>
            </div>
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-full">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tenis de Mesa Products */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-2 sm:p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Tenis de Mesa</p>
              <p className="text-lg sm:text-2xl font-bold text-purple-600">{stats.tenisMesa}</p>
              <p className="text-xs text-gray-500 mt-1">
                {getCategoryPercentage('tenis-mesa')}% del total
              </p>
            </div>
            <div className="p-1.5 sm:p-2 bg-purple-100 rounded-full">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tenis Products */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-2 sm:p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Tenis</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600">{stats.tenis}</p>
              <p className="text-xs text-gray-500 mt-1">
                {getCategoryPercentage('tenis')}% del total
              </p>
            </div>
            <div className="p-1.5 sm:p-2 bg-green-100 rounded-full">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Offers */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-2 sm:p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">En Oferta</p>
              <p className="text-lg sm:text-2xl font-bold text-red-600">{stats.inOffer}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.total > 0 ? Math.round((stats.inOffer / stats.total) * 100) : 0}% del catálogo
              </p>
            </div>
            <div className="p-1.5 sm:p-2 bg-red-100 rounded-full">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stock Status */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-2 sm:p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Stock</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600">{stats.inStock}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.outOfStock} sin stock
              </p>
            </div>
            <div className="p-1.5 sm:p-2 bg-green-100 rounded-full">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Value */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-2 sm:p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Valor Total</p>
              <p className="text-sm sm:text-xl font-bold text-gray-900">{formatPrice(stats.totalValue)}</p>
              <p className="text-xs text-gray-500 mt-1">
                Promedio: {formatPrice(stats.averagePrice)}
              </p>
            </div>
            <div className="p-1.5 sm:p-2 bg-green-100 rounded-full">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-2 sm:p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Acciones Rápidas</p>
              <div className="flex gap-1 mt-2">
                <Badge variant="outline" className="text-xs">Crear</Badge>
                <Badge variant="outline" className="text-xs">Editar</Badge>
                <Badge variant="outline" className="text-xs">Ver</Badge>
              </div>
            </div>
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-full">
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-2 sm:p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Rendimiento</p>
              <p className="text-lg sm:text-2xl font-bold text-orange-600">
                {stats.total > 0 ? Math.round((stats.inStock / stats.total) * 100) : 0}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Productos disponibles
              </p>
            </div>
            <div className="p-1.5 sm:p-2 bg-orange-100 rounded-full">
              <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 