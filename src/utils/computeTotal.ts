export const computeTotal = (items: (any[] | undefined)) => {
  if (!items || items.length === 0) return 0
  return items.reduce((sum: number, it: any) => {
    const price = typeof it.price === 'number' ? it.price : Number(it.price || 0)
    const qty = typeof it.quantity === 'number' ? it.quantity : Number(it.quantity || 0)
    return sum + (price * qty)
  }, 0)
}
