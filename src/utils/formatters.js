/**
 * Format numeric price in INR (₹)
 */
export function formatCurrency(amount) {
  const num = Number(amount) || 0
  return `₹${num.toLocaleString('en-IN')}`
}

/**
 * Calculate size multiplier or extra price for frame sizes
 */
export function getSizePriceMultiplier(size) {
  const normalized = String(size || '').replace(/\s+/g, '').toLowerCase()
  const priceAddons = {
    '8x10': 0,
    '8×10': 0,
    '12x18': 250,
    '12×18': 250,
    '16x20': 500,
    '16×20': 500,
    '20x24': 850,
    '20×24': 850
  }
  return priceAddons[normalized] !== undefined ? priceAddons[normalized] : 0
}

/**
 * Format display size string consistently (e.g., "8x10" -> "8 × 10")
 */
export function formatSizeLabel(size) {
  if (!size) return '8 × 10'
  return String(size).replace(/x/gi, ' × ').replace(/\s+/g, ' ').trim()
}

/**
 * Format date string into readable Indian locale date
 */
export function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  } catch {
    return dateStr
  }
}
