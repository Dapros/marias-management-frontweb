import { IoClose } from "react-icons/io5"
import { useOrderStore } from "../store/useOrderStore"
import { FaPlus } from "react-icons/fa6"
import OrderForm from "../components/forms/OrderForm"
import ViewOrder from "../components/custom/ViewOrder"
import OrderCard from "../components/cards/OrderCard"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import { formatDateLong } from "../utils/date";

export default function OrderPage() {

  // estados globales y acciones de pedidos
  const { 
    loadOrders,
    showOrderForm, 
    toggleOrderForm, 
    resetDraft, 
    setEditingMode, 
    loading,
    // filtros
    statusFilter,
    dateFilterType,
    dateFilterDate,
    setStatusFilter,
    setDateFilterType,
    setDateFilterDate,
    clearFilters,
    filteredOrders,
    orders,
  } = useOrderStore()

  const results = filteredOrders()
  
  const handleShowOrderForm = () => {
    toggleOrderForm()
    if(showOrderForm === false ) {
      resetDraft()
      setEditingMode(false)
    }
  }

  const renderEmptyMessages = () => {
    // mensaje dinamico segun el filtro de fecha
    if(dateFilterType === 'today') {
      return "No hay pedidos para el dia de hoy."
    }
    if(dateFilterType === 'week') {
      return "No hay pedidos para esta semana."
    }
    if(dateFilterType === "month") {
      return "No hay pedidos para este mes."
    }
    if(dateFilterType === "date" && dateFilterDate) {
      return `No hay pedidos para ${formatDateLong(dateFilterDate)}.`
    }
    if(statusFilter !== "all") {
      return `No hay pedidos con estado "${statusFilter}".`
    }
    return "No hay pedidos registrados..."
  }
  
  return (
    <div className="p-4 md:p-6 min-h-full font-poppins">
      <div className="flex flex-col mb-6">
        <h1 className="text-xl font-bold text-teal-600">Pedidos</h1>
        <p className="text-gray-700">
          En esta pestaña puedes registrar, editar y filtrar pedidos.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleShowOrderForm}
              className={`flex items-center gap-2 py-2 px-4 border-2 rounded-lg transition-normal ease-in-out duration-300 ${showOrderForm ? "text-red-600 hover:bg-red-50" : "text-teal-600 hover:bg-teal-50 border-teal-600"}`}
            >
              {showOrderForm ? <IoClose size={20}/> : <FaPlus size={20} />}
              <p className="font-bold">{showOrderForm ? "Cancelar nuevo pedido" : "Registrar nuevo pedido"}</p>
            </button>

            <button
              onClick={loadOrders}
              disabled={loading}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
            >
              {loading ? "Cargando..." : "Actualizar"}
            </button>
          </div>

          {/* FILTROS */}
          <div className="flex flex-col md:flex-row gap-2 items-center">
            {/* Estado */}
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="border text-teal-700 outline-teal-800 border-teal-600 p-2 rounded-lg">
              <option value="all">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="pagado">Pagado</option>
            </select>

            {/* Rango rápido */}
            <div className="flex gap-2">
              <button onClick={() => setDateFilterType('today')} className={`px-3 py-2 rounded-lg border ${dateFilterType==='today' ? 'bg-teal-600 text-white' : 'text-teal-700 border-teal-600'}`}>Hoy</button>
              <button onClick={() => setDateFilterType('week')} className={`px-3 py-2 rounded-lg border ${dateFilterType==='week' ? 'bg-teal-600 text-white' : 'text-teal-700 border-teal-600'}`}>Semana</button>
              <button onClick={() => setDateFilterType('month')} className={`px-3 py-2 rounded-lg border ${dateFilterType==='month' ? 'bg-teal-600 text-white' : 'text-teal-700 border-teal-600'}`}>Mes</button>
            </div>

            {/* Fecha específica */}
            <div className="flex items-center gap-2">
              <DatePicker
                selected={dateFilterDate ?? null}
                onChange={(d: Date | null) => {
                  setDateFilterDate(d ?? undefined);
                  setDateFilterType(d ? 'date' : 'all');
                }}
                dateFormat="dd/MM/yyyy"
                placeholderText="Seleccionar fecha"
                className="border p-2 rounded-lg text-teal-700 outline-teal-800 border-teal-600"
              />
            </div>

            <button onClick={() => clearFilters()} className="px-3 py-2 rounded-lg border text-teal-700 border-teal-600">Limpiar</button>
          </div>
        </div>

        {showOrderForm && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 rounded-lg shadow-lg bg-white overflow-hidden">
            <OrderForm />
            <ViewOrder />
          </div>
        )}

        {/* RESULTADOS */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold text-teal-600">Lista de pedidos</h1>
            <p className="text-sm text-gray-600">{results.length} resultado(s)</p>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {renderEmptyMessages()}
            </div>
          ) : (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-800">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Torre</th>
                    <th className="px-6 py-3">Apartamento</th>
                    <th className="px-6 py-3">Vecino</th>
                    <th className="px-6 py-3">Teléfono</th>
                    <th className="px-6 py-3">Método de pago</th>
                    <th className="px-6 py-3">Almuerzo</th>
                    <th className="px-6 py-3">Fecha y hora</th>
                    <th className="px-6 py-3">Estado</th>
                    <th className="px-6 py-3">Total</th>
                    <th className="px-6 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(order => (
                    <OrderCard
                      key={order.id}
                      id={order.id}
                      towerNum={order.towerNum}
                      apto={order.apto}
                      customer={order.customer}
                      phoneNum={order.phoneNum}
                      payMethod={order.payMethod}
                      lunch={order.lunch}
                      time={order.time}
                      date={order.date}
                      orderState={order.orderState}
                      total={order.total}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}