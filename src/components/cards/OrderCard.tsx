import type { LunchType, PayMethod, OrderState } from "../../types"

type OrderCardProps = {
  id: string;
  towerNum: string;
  apto: number;
  customer?: string;
  phoneNum: number;
  payMethod: PayMethod;
  lunch: LunchType[];
  time?: string;
  date?: string | Date;
  orderState: OrderState;
}

export default function OrderCard({ id, towerNum, apto, customer, phoneNum, payMethod, lunch, time, date, orderState } : OrderCardProps) {
  
  // Normalizar date -> Date | null
  const dateObj: Date | null = (() => {
    if(!date) return null
    if(date instanceof Date) return isNaN(date.getTime()) ? null : date
    const parsed = new Date(date)
    return isNaN(parsed.getTime()) ? null : parsed
  })()

  // Formatear hora de forma segura si tiene formado HH:mm lo convertimos a Date con fecha fija
  const timeStr = (() => {
    if(!time) return '-'
    // si ya es un ISO o contiene 'T' intentamos parsear directo
    if(time.includes('T') || time.includes('-')){
      const d = new Date(time)
      return isNaN(d.getTime()) ? time : d.toLocaleDateString()
    }

    try {
      const d = new Date(`1970-01-01T${time}`)
      return isNaN(d.getTime()) ? time : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch {
      return time
    }
  })()

  const dateStr = dateObj ? dateObj.toLocaleDateString() : '-'
  
  return (
    <tr key={id} className="p-2 border rounded shadow-sm">
      <td className="px-2 py-1">{towerNum}</td>
      <td className="px-2 py-1">{apto}</td>
      <td className="px-2 py-1">{customer ?? 'N/A'}</td>
      <td className="px-2 py-1">{phoneNum ?? 'N/A'}</td>
      <td className="px-2 py-1">{payMethod.label ?? 'N/A'}</td>
      <td className="px-2 py-1">{lunch.map(l => l.title).join(', ') || 'N/A'}</td>
      <td className="px-2 py-1">{`${dateStr} - ${timeStr}`}</td>
      <td className={`px-2 py-1 ${orderState === 'pagado' ? 'text-green-600' : 'text-red-600'}`}>{orderState}</td>
    </tr>
  )
}
