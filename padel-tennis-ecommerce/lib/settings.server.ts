"use server"

import { createClient } from "./supabase/server"
import { cookies } from "next/headers"
import { convertUsdToArs } from "./price-utils"

/**
 * Get the current USD to ARS conversion rate
 */
export async function getConversionRate(): Promise<number> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "usd_to_ars_rate")
    .single()

  if (error) {
    console.error("Error fetching conversion rate:", error)
    return 1400 // Default fallback
  }

  return parseFloat(data.value)
}

/**
 * Update the USD to ARS conversion rate
 */
export async function updateConversionRate(newRate: number): Promise<{ success: boolean; error?: string }> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Validate the rate
  if (newRate <= 0 || isNaN(newRate)) {
    return { success: false, error: "La tasa de conversión debe ser un número positivo" }
  }

  const { error } = await supabase
    .from("settings")
    .update({ value: newRate.toString() })
    .eq("key", "usd_to_ars_rate")

  if (error) {
    console.error("Error updating conversion rate:", error)
    return { success: false, error: "Error al actualizar la tasa de conversión" }
  }

  return { success: true }
}

/**
 * Recalculate all product prices in ARS based on their USD base price and the new conversion rate
 */
export async function recalculateAllPrices(conversionRate: number): Promise<{ 
  success: boolean; 
  updatedCount?: number;
  error?: string 
}> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  try {
    // Fetch all products with their USD prices
    const { data: products, error: fetchError } = await supabase
      .from("productos_fullspin")
      .select("id, price_usd")

    if (fetchError) {
      console.error("Error fetching products:", fetchError)
      return { success: false, error: "Error al obtener productos" }
    }

    if (!products || products.length === 0) {
      return { success: true, updatedCount: 0 }
    }

    // Calculate new ARS prices for each product
    const updates = products.map(product => {
      const newArsPrice = convertUsdToArs(product.price_usd, conversionRate)
      return {
        id: product.id,
        price: newArsPrice
      }
    })

    // Update products in batch
    let updatedCount = 0
    for (const update of updates) {
      const { error: updateError } = await supabase
        .from("productos_fullspin")
        .update({ price: update.price })
        .eq("id", update.id)

      if (!updateError) {
        updatedCount++
      }
    }

    return { success: true, updatedCount }
  } catch (error) {
    console.error("Error recalculating prices:", error)
    return { success: false, error: "Error al recalcular precios" }
  }
}

/**
 * Update conversion rate and recalculate all prices in one operation
 */
export async function updateConversionRateAndRecalculate(newRate: number): Promise<{ 
  success: boolean; 
  updatedCount?: number;
  error?: string 
}> {
  // Update the conversion rate
  const updateResult = await updateConversionRate(newRate)
  if (!updateResult.success) {
    return updateResult
  }

  // Recalculate all prices with the new rate
  return await recalculateAllPrices(newRate)
}




