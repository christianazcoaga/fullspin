"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AdminLoadingProps {
  type?: "full" | "stats" | "list" | "form"
  count?: number
}

export function AdminLoading({ type = "full", count = 6 }: AdminLoadingProps) {
  if (type === "stats") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-3 mb-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="bg-white/80 backdrop-blur-sm border-0 shadow-sm animate-pulse">
            <CardContent className="p-2 sm:p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-16 sm:w-20 mb-1 sm:mb-2"></div>
                  <div className="h-6 sm:h-8 bg-gray-200 rounded w-12 sm:w-16 mb-1"></div>
                  <div className="h-2 sm:h-3 bg-gray-200 rounded w-20 sm:w-24"></div>
                </div>
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-200 rounded-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (type === "list") {
    return (
      <div className="space-y-3 max-h-[40vh] sm:max-h-[60vh] lg:max-h-[70vh] overflow-y-auto">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="p-3 sm:p-4 rounded-lg border bg-white/60 animate-pulse">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="relative">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gray-200 rounded-lg"></div>
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 bg-gray-200 rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-32 sm:w-48"></div>
                  <div className="h-4 sm:h-5 bg-gray-200 rounded w-12 sm:w-16"></div>
                </div>
                <div className="h-2 sm:h-3 bg-gray-200 rounded w-20 sm:w-24 mb-1"></div>
                <div className="flex items-center gap-2">
                  <div className="h-4 sm:h-5 bg-gray-200 rounded w-12 sm:w-16"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-16 sm:w-20"></div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-200 rounded"></div>
                <div className="h-2 sm:h-3 bg-gray-200 rounded w-6 sm:w-8"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === "form") {
    return (
      <div className="space-y-4 sm:space-y-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="h-5 sm:h-6 bg-gray-200 rounded w-24 sm:w-32 mb-3 sm:mb-4"></div>
              <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-32 sm:w-48 mb-1"></div>
                <div className="h-2 sm:h-3 bg-gray-200 rounded w-24 sm:w-32"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="h-5 sm:h-6 bg-gray-200 rounded w-20 sm:w-24 mb-3 sm:mb-4"></div>
              <div className="h-24 sm:h-32 bg-gray-200 rounded-lg"></div>
              <div className="h-8 sm:h-10 bg-gray-200 rounded w-24 sm:w-32"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="h-5 sm:h-6 bg-gray-200 rounded w-24 sm:w-32 mb-3 sm:mb-4"></div>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-16 sm:w-20"></div>
                  <div className="h-8 sm:h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
              <div className="h-8 sm:h-10 bg-gray-200 rounded w-full mt-4 sm:mt-6"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Full loading (default)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header Skeleton */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col gap-4 mb-4 sm:mb-6">
            <div className="text-center sm:text-left">
              <div className="h-6 sm:h-8 bg-gray-200 rounded-lg w-48 sm:w-64 mb-2 animate-pulse"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-72 sm:w-96 animate-pulse"></div>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-end gap-2">
              <div className="h-8 sm:h-10 bg-gray-200 rounded-lg w-24 sm:w-32 animate-pulse"></div>
              <div className="h-8 sm:h-10 bg-gray-200 rounded-lg w-20 sm:w-24 animate-pulse"></div>
              <div className="h-8 sm:h-10 bg-gray-200 rounded-lg w-24 sm:w-28 animate-pulse"></div>
            </div>
          </div>

          {/* Stats Skeleton */}
          <AdminLoading type="stats" />

          {/* Search Skeleton */}
          <div className="flex flex-col gap-3 mb-4 sm:mb-6">
            <div className="relative w-full">
              <div className="h-8 sm:h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 h-8 sm:h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-8 sm:h-10 bg-gray-200 rounded-lg w-8 sm:w-10 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Content Skeleton - Mobile */}
        <div className="block lg:hidden space-y-4">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <div className="h-5 sm:h-6 bg-gray-200 rounded w-24 sm:w-32 animate-pulse"></div>
                <Badge variant="secondary" className="bg-gray-200 text-gray-200 animate-pulse">
                  <div className="w-6 h-3 sm:w-8 sm:h-4 bg-gray-300 rounded"></div>
                </Badge>
              </div>
              <AdminLoading type="list" count={count} />
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full mb-3 sm:mb-4 animate-pulse"></div>
              <div className="h-5 sm:h-6 bg-gray-200 rounded w-36 sm:w-48 mb-2 animate-pulse"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-48 sm:w-64 mb-3 sm:mb-4 animate-pulse"></div>
              <div className="h-8 sm:h-10 bg-gray-200 rounded w-28 sm:w-32 animate-pulse"></div>
            </CardContent>
          </Card>
        </div>

        {/* Content Skeleton - Desktop */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                  <Badge variant="secondary" className="bg-gray-200 text-gray-200 animate-pulse">
                    <div className="w-8 h-4 bg-gray-300 rounded"></div>
                  </Badge>
                </div>
                <AdminLoading type="list" count={count} />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
              <CardContent className="p-6 text-center h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mb-4 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-64 mb-4 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 