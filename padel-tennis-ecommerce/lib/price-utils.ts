/**
 * Utility functions for price conversion and rounding
 */

/**
 * Rounds a number to the nearest thousand (similar to Excel's REDONDEAR(valor, -3))
 * Examples:
 * - 148,001 to 148,499 -> 148,000
 * - 148,500 to 148,999 -> 149,000
 * @param value The value to round
 * @returns The rounded value
 */
export function roundToNearestThousand(value: number): number {
  return Math.round(value / 1000) * 1000
}

/**
 * Converts USD price to ARS using the given conversion rate and rounds to nearest thousand
 * @param priceUsd Price in USD
 * @param conversionRate USD to ARS conversion rate
 * @returns Price in ARS rounded to nearest thousand
 */
export function convertUsdToArs(priceUsd: number, conversionRate: number): number {
  const arsPrice = priceUsd * conversionRate
  return roundToNearestThousand(arsPrice)
}

/**
 * Formats a price for display in Argentine format
 * @param price Price in ARS
 * @returns Formatted price string (e.g., "$148.000")
 */
export function formatPrice(price: number): string {
  return `$${price.toLocaleString('es-AR').replace(/,/g, '.')}`
}

/**
 * Calculates the offered price with discount
 * @param basePrice Base price
 * @param offerPercent Discount percentage
 * @returns Discounted price
 */
export function calculateOfferPrice(basePrice: number, offerPercent: number): number {
  return Math.round(basePrice * (1 - offerPercent / 100))
}



