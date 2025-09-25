import { useMemo } from "react"
import { useOrderStore } from "../../store/useOrderStore"
import type { OrderType } from "../../types"
import { formatCurrencyCOP } from "../../utils/format/curremcy"

export default function ViewOrder() {

  const { draft } = useOrderStore()

  // helper para normalizar date -> Date | null
  const dateObj: Date | null = (() => {
    if(!draft.date) return null
    if(draft.date instanceof Date) return isNaN(draft.date.getTime()) ? null : draft.date
    try {
      const d = new Date(draft.date)
      return isNaN(d.getTime()) ? null : d
    } catch {
      return null
    }
  })()

  const formattedDate = dateObj ? dateObj.toLocaleDateString() : "—";
  const formattedTime = (() => {
    if (!draft?.time) return "—";
    // si draft.time es algo como "13:45"
    try {
      if (draft.time.includes("T") || draft.time.includes("-")) {
        const d = new Date(draft.time)
        return isNaN(d.getTime()) ? draft.time : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
      const d = new Date(`1970-01-01T${draft.time}`)
      return isNaN(d.getTime()) ? draft.time : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } catch {
      return draft.time
    }
  })()

  // lunch items: pueden venir como LunchType[] con quantity
  const items = (draft?.lunch ?? []) as (Partial<OrderType["lunch"][0]> & { quantity?: number })[]

  // calculos
  const totals = useMemo(() => {
    const lines = items.map(it => {
      const qty = typeof it.quantity === "number" ? it.quantity : Number(it.quantity ?? 0);
      const unit = typeof it.price === "number" ? it.price : Number(it.price ?? 0);
      const subtotal = unit * qty;
      return {
        id: it.id ?? Math.random().toString(36).slice(2, 9),
        title: it.title ?? "Item",
        qty,
        unit,
        subtotal,
      };
    });
    const total = typeof (draft as any).total === "number"
      ? (draft as any).total
      : lines.reduce((s, l) => s + l.subtotal, 0);
    const totalQty = lines.reduce((s, l) => s + l.qty, 0);
    return { lines, total, totalQty };
  }, [items, draft]);

  return (
    <div className="p-4 bg-gray-50">
      <h3 className="text-lg font-semibold text-gray-700 mb-16">Vista previa del pedido</h3>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header tipo factura */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Pedido</h2>
            <p className="text-sm text-gray-500">Vista previa, resumen y detalles del pedido</p>
          </div>

          <div className="mt-3 md:mt-0 text-right">
            <div className="text-sm text-gray-600">Fecha del pedido</div>
            <div className="font-medium">{formattedDate} {formattedTime !== "—" && `— ${formattedTime}`}</div>
            {draft?.id && <div className="text-xs text-gray-400 mt-1">ID: {draft.id}</div>}
          </div>
        </div>

        {/* Cliente y dirección / info pedido */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 border-b">
          <div>
            <h4 className="text-sm font-semibold text-teal-600">Cliente</h4>
            <p className="text-md font-medium text-gray-800">{draft.customer ?? "—"}</p>
            <p className="text-sm text-gray-600 mt-1">Torre: <span className="font-medium">{draft.towerNum || "—"}</span></p>
            <p className="text-sm text-gray-600">Apto: <span className="font-medium">{draft.apto ?? "—"}</span></p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-teal-600">Contacto</h4>
            <p className="text-md font-medium text-gray-800">{draft.phoneNum ?? "—"}</p>
            <p className="text-sm text-gray-500 mt-1">Método de pago: <span className="font-medium">{draft.payMethod?.label ?? "—"}</span></p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-teal-600">Estado</h4>
            <div className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${draft.orderState === "pagado" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
              {draft.orderState ?? "pendiente"}
            </div>

            <div className="mt-3">
              <h4 className="text-sm font-semibold text-teal-600">Resumen</h4>
              <p className="text-sm text-gray-700">Items: <span className="font-medium">{totals.lines.length}</span></p>
              <p className="text-sm text-gray-700">Cantidad total: <span className="font-medium">{totals.totalQty}</span></p>
            </div>
          </div>
        </div>

        {/* Tabla items */}
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-3 py-2">Item</th>
                  <th className="px-3 py-2">Precio unit.</th>
                  <th className="px-3 py-2">Cantidad</th>
                  <th className="px-3 py-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {totals.lines.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-gray-400">No hay almuerzos seleccionados</td>
                  </tr>
                ) : (
                  totals.lines.map(line => (
                    <tr key={line.id} className="border-b last:border-b-0">
                      <td className="px-3 py-3">
                        <div className="font-medium">{line.title}</div>
                      </td>
                      <td className="px-3 py-3">{formatCurrencyCOP.format(line.unit)}</td>
                      <td className="px-3 py-3">{line.qty}</td>
                      <td className="px-3 py-3">{formatCurrencyCOP.format(line.subtotal)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Totales */}
          <div className="mt-4 flex flex-col md:flex-row md:justify-end md:items-center gap-4">
            <div className="text-left">
              <div className="text-xs text-gray-500 bg-gray-50 font-bold py-2 px-2 uppercase">Total:</div>
              <div className="text-2xl font-bold text-teal-600">{formatCurrencyCOP.format(totals.total)}</div>
            </div>
          </div>
        </div>

        {/* Detalles / notas */}
        <div className="p-4 border-t">
          <h4 className="text-sm font-semibold text-teal-600 mb-2">Detalles / Observaciones del pedido</h4>
          <p className="text-sm text-gray-700">{draft.details && draft.details.trim().length > 0 ? draft.details : "—"}</p>
        </div>

        {/* Footer */}
        <div className="p-4 text-xs text-gray-500 border-t">
          <p>factura de pedido · Marias management</p>
        </div>
      </div>
    </div>
  )
}
