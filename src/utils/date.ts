export const startOfWeek = (d: Date) => {
  const date = new Date(d)
  const day = (date.getDay() + 6) % 7 // lunes como inicio
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() - day)
  return date
}

export const endOfWeek = (d: Date) => {
  const s = startOfWeek(d)
  const e = new Date(s)
  e.setDate(s.getDate() + 6)
  e.setHours(23, 59, 59, 999)
  return e
}

export const isSameDay = (a?: string | Date | null, b?: Date) => {
  if(!a || !b) return false
  const da = (a instanceof Date) ? a : new Date(a)
  const db = b
  return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate()
}

export const isSameWeek = (a?: string | Date | null, b?: Date) => {
  if(!a || !b) return false
  const da = (a instanceof Date) ? a : new Date(a)
  const start = startOfWeek(b)
  const end = endOfWeek(b)
  return da.getTime() >= start.getTime() && da.getTime() <= end.getTime()
}

export const isSameMonth = (a?: string | Date | null, b?: Date) => {
  if(!a || !b) return false
  const da = (a instanceof Date) ? a : new Date(a)
  return da.getFullYear() === b.getFullYear() && da.getMonth() === b.getMonth()
}

export const formatDateLong = (d?: string | Date | null) => {
  if(!d) return '—'
  const date = d instanceof Date ? d : new Date(d)
  try {
    return date.toLocaleDateString('es-ES', {
      day: "numeric",
      month: "long",
      year: "numeric"
    })
  } catch {
    return date.toLocaleDateString()
  }
}