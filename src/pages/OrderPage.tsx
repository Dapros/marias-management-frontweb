import { IoClose } from "react-icons/io5"
import { useOrderStore } from "../store/useOrderStore"
import { FaPlus } from "react-icons/fa6"
import OrderForm from "../components/forms/OrderForm"
import ViewOrder from "../components/custom/ViewOrder"
import OrderCard from "../components/cards/OrderCard"

export default function OrderPage() {

  // estados globales y acciones de pedidos
  const { orders, showOrderForm, toggleOrderForm, resetDraft, setEditingMode, loadOrders, loading } = useOrderStore()
  
  const handleShowOrderForm = () => {
    toggleOrderForm()
    if(showOrderForm === false ) {
      resetDraft()
      setEditingMode(false)
    }
  }
  
  return (
    <div className="p-4 md:p-6 min-h-full font-poppins">
      {/* Encabezado de la pagina con titulo y texto */}
      <div className="flex flex-col mb-6">
        <h1 className="text-xl font-bold text-teal-600">Pedidos</h1>
        <p className="text-gray-700">
          En esta pestaña puedes registrar, editar y eliminar 
          <span className="font-bold text-teal-600"> pedidos.</span>
        </p>
      </div>

      {/* Contenido principal de la pagina */}
      <div className="space-y-4">
        <button
          onClick={handleShowOrderForm}
          className={`flex items-center gap-2 py-2 px-4 border-2 rounded-lg transition-normal ease-in-out duration-300 ${showOrderForm ? "text-red-600 hover:bg-red-50" : "text-teal-600 hover:bg-teal-50 border-teal-600"}`}
        >
          {showOrderForm ? <IoClose size={24}/> : <FaPlus size={24} />}
          <p className="font-bold">{showOrderForm ? "Cancelar nuevo pedido" : "Registrar nuevo pedido"}</p>
        </button>
        {showOrderForm && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 rounded-lg shadow-lg bg-white overflow-hidden">
            {/* Formulario para pedido */}
            <OrderForm />
            {/* Vista previa de como esta quedando el pedido - estilo de factura */}
            <ViewOrder />
          </div>
        )}

        {/* Lista de pedidos */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-xl font-semibold text-teal-600">
                Lista de pedidos agregados
              </h1>
              <p className="text-sm text-gray-700">Pedidos registrados recientemente</p>
            </div>
            <div>
              <button
                onClick={loadOrders}
                disabled={loading}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
              >
                {loading ? "Cargando..." : "Actualizar"}
              </button>
            </div>
          </div>

          {orders.length === 0 ? (
            <p className="text-gray-500 py-16 text-center">No hay registro de pedidos aun.</p>
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
                    <th className="px-6 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
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
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}