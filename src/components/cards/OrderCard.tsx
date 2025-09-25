import { useState } from "react";
import { useOrderStore } from "../../store/useOrderStore";
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
  
  const { loadOrderToDraft, toggleOrderForm, showOrderForm, setEditingMode, deleteOrderById, updateOrderStateById, } = useOrderStore();
  const [showConfirm, setShowConfirm] = useState(false)
  const cancelDelete = () => setShowConfirm(false)

  // Normalizar date -> Date | null
  const dateObj: Date | null = (() => {
    if (!date) return null;
    if (date instanceof Date) return isNaN(date.getTime()) ? null : date;
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? null : parsed;
  })();

  // Formatear hora de forma segura
  const timeStr = (() => {
    if (!time) return "-";
    if (time.includes("T") || time.includes("-")) {
      const d = new Date(time);
      return isNaN(d.getTime()) ? time : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    try {
      const d = new Date(`1970-01-01T${time}`);
      return isNaN(d.getTime()) ? time : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return time;
    }
  })();

  const dateStr = dateObj ? dateObj.toLocaleDateString() : "-";

  const handleEdit = () => {
    // Cargar al draft y abrir formulario en modo edición
    loadOrderToDraft({
      id,
      towerNum,
      apto,
      customer,
      phoneNum,
      payMethod,
      lunch,
      time,
      date,
      orderState,
    } as any);
    setEditingMode(true);
    if (!showOrderForm) toggleOrderForm();
  };

  const handleDelete = async () => {
    // se abre el modal de confirmación
    setShowConfirm(true)
  };

  const confirmDelete = async () => {
    setShowConfirm(false)
    await deleteOrderById(id);
  }

  const handleStateChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value as OrderState;
    if (newState === orderState) return;
    // actualizar backend + store
    await updateOrderStateById(id, newState);
  };
  
  return (
    <>
      <tr 
        key={id} 
        className="bg-white border-b border-gray-200"
      >
        <td className="px-6 py-2">{towerNum}</td>
        <td className="px-6 py-2">{apto}</td>
        <td className="px-6 py-2">{customer ?? 'N/A'}</td>
        <td className="px-6 py-2">{phoneNum ?? 'N/A'}</td>
        <td className="px-6 py-2">{payMethod.label ?? 'N/A'}</td>
        <td className="px-6 py-2">{lunch.map(l => l.title).join(', ') || 'N/A'}</td>
        <td className="px-6 py-2">{`${dateStr} - ${timeStr}`}</td>
        <td className="px-6 py-2">
          <select
            value={orderState}
            onChange={handleStateChange}
            className={`border px-2 py-1 rounded ${orderState === "pagado" ? "text-green-600" : "text-red-600"}`}
          >
            <option value="pendiente">Pendiente</option>
            <option value="pagado">Pagado</option>
          </select>
        </td>
        <td className="px-6 py-2 space-x-2">
          <button
            onClick={handleEdit}
            className="px-2 py-1 text-blue-600 hover:underline rounded-md cursor-pointer border"
          >
            editar
          </button>
          <button
            onClick={handleDelete}
            className="px-2 py-1 text-red-600 hover:underline rounded-md cursor-pointer border"
          >
            eliminar
          </button>
        </td>
      </tr>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-4 rounded shadow-lg w-[90%] max-w-md">
            <h1 className="text-xl font-bold text-teal-600 mb-1">¿Deseas eliminar este pedido?</h1>
            <p className="mb-8 text-sm px-1"><strong className="text-red-500">Advertencia: </strong>Eliminar este pedido es irreversible y podría afectar al análisis de datos</p>
            <div className="flex justify-end gap-2">
              <button className="px-3 py-1 bg-gray-200 rounded-md hover:shadow-md" onClick={cancelDelete}>Cancelar</button>
              <button className="px-3 py-1 bg-red-600 text-white rounded-md hover:shadow-md" onClick={confirmDelete}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
