

// formato de moneda COP - Colombiana
export const formatCurrencyCOP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP'
})

// formato de moneda USD - Estados Unidos USA
export const formatCurrencyUSD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})