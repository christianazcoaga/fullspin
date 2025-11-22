"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, DollarSign, RefreshCw, TrendingUp } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { updateConversionRateAction } from "@/app/admin/actions"

interface ConversionRateManagerProps {
  initialRate: number
  productCount: number
}

export function ConversionRateManager({ initialRate, productCount }: ConversionRateManagerProps) {
  const [currentRate, setCurrentRate] = useState(initialRate)
  const [newRate, setNewRate] = useState(initialRate.toString())
  const [isUpdating, setIsUpdating] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [updatedCount, setUpdatedCount] = useState<number | null>(null)

  useEffect(() => {
    setCurrentRate(initialRate)
    setNewRate(initialRate.toString())
  }, [initialRate])

  const handleUpdateRate = async () => {
    const parsedRate = parseFloat(newRate)
    
    if (isNaN(parsedRate) || parsedRate <= 0) {
      setMessage({ type: "error", text: "Por favor ingresa una tasa de conversión válida" })
      return
    }

    setIsUpdating(true)
    setMessage(null)
    setUpdatedCount(null)

    try {
      const result = await updateConversionRateAction(parsedRate)
      
      if (result.success) {
        setCurrentRate(parsedRate)
        setUpdatedCount(result.updatedCount || 0)
        setMessage({ 
          type: "success", 
          text: `Tasa actualizada exitosamente. ${result.updatedCount} productos actualizados.` 
        })
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      } else {
        setMessage({ type: "error", text: result.error || "Error al actualizar la tasa" })
      }
    } catch (error) {
      console.error("Error updating conversion rate:", error)
      setMessage({ type: "error", text: "Error inesperado al actualizar la tasa" })
    } finally {
      setIsUpdating(false)
    }
  }

  const calculateExamplePrices = () => {
    const exampleUsd = 100
    const currentArsRaw = exampleUsd * currentRate
    const currentArsRounded = Math.round(currentArsRaw / 1000) * 1000
    
    const parsedNewRate = parseFloat(newRate)
    const newArsRaw = exampleUsd * parsedNewRate
    const newArsRounded = Math.round(newArsRaw / 1000) * 1000

    return {
      currentArsRaw,
      currentArsRounded,
      newArsRaw,
      newArsRounded,
      isValid: !isNaN(parsedNewRate) && parsedNewRate > 0
    }
  }

  const examples = calculateExamplePrices()
  const hasChanged = parseFloat(newRate) !== currentRate && examples.isValid

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <CardTitle className="text-lg">Tasa de Conversión USD a ARS</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {productCount} productos
          </Badge>
        </div>
        <CardDescription>
          Configura la tasa de conversión para calcular automáticamente los precios en pesos argentinos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Rate Display */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tasa Actual</p>
              <p className="text-2xl font-bold text-gray-900">
                1 USD = {currentRate.toLocaleString('es-AR')} ARS
              </p>
            </div>
            <div className="text-green-600">
              <TrendingUp className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Input for New Rate */}
        <div className="space-y-2">
          <Label htmlFor="conversion_rate" className="text-sm font-semibold">
            Nueva Tasa de Conversión
          </Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                id="conversion_rate"
                type="number"
                step="0.01"
                min="0"
                value={newRate}
                onChange={(e) => setNewRate(e.target.value)}
                placeholder="Ej: 1450"
                className="h-10 text-lg"
                disabled={isUpdating}
              />
            </div>
            <Button
              onClick={handleUpdateRate}
              disabled={isUpdating || !hasChanged}
              className="bg-green-600 hover:bg-green-700 min-w-[140px]"
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Aplicando...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Aplicar Cambio
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Al aplicar, todos los precios en ARS se recalcularán automáticamente desde el precio base en USD
            y se redondearán al millar más cercano.
          </p>
        </div>

        {/* Example Calculation */}
        {examples.isValid && hasChanged && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-900 mb-3">
              Ejemplo de Conversión (100 USD):
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Precio Actual:</p>
                <p className="font-semibold text-gray-900">
                  ${examples.currentArsRounded.toLocaleString('es-AR')} ARS
                </p>
                <p className="text-xs text-gray-500">
                  (redondeado desde ${examples.currentArsRaw.toLocaleString('es-AR')})
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Nuevo Precio:</p>
                <p className="font-semibold text-green-700">
                  ${examples.newArsRounded.toLocaleString('es-AR')} ARS
                </p>
                <p className="text-xs text-gray-500">
                  (redondeado desde ${examples.newArsRaw.toLocaleString('es-AR')})
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success/Error Messages */}
        {message && (
          <Alert variant={message.type === "error" ? "destructive" : "default"}>
            {message.type === "success" ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {/* Info Box */}
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Redondeo Automático
          </h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>$148.001 a $148.499 se redondea a $148.000</li>
            <li>$148.500 a $148.999 se redondea a $149.000</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}



