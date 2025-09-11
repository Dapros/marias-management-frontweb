import { IoClose } from "react-icons/io5"
import { useOrderStore } from "../store/useOrderStore"
import { FaPlus } from "react-icons/fa6"
import OrderForm from "../components/forms/OrderForm"
import ViewOrder from "../components/custom/ViewOrder"

export default function OrderPage() {

  // estados globales y acciones de pedidos
  const { orders, showOrderForm, toggleOrderForm, resetDraft, setEditingMode } = useOrderStore()
  
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
        <p>
          En esta pestaña puedes registrar y editar pedidos que se hagan de 
          <span className="font-bold text-teal-600"> almuerzos.</span>
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
          <h1 className="text-xl mb-8 font-semibold text-teal-600">Lista de pedidos agregados</h1>
          {orders.length === 0 ? (
            <p className="text-gray-500 text-center">No hay registro de pedidos aun.</p>
          ) : (
            <ul>
              
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
