import { useOrderStore } from "../../store/useOrderStore"


export default function OrderForm() {

  // estados globales
  const { isEditing } = useOrderStore()

  return (
    <div>
      <form>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          { isEditing ? "Editar pedido" : "Registrar pedido"}
        </h3>

        <div className="flex flex-col space-y-2">
          <label htmlFor="towerOrder">Elige la torre</label>
          <select id="towerOrder">

          </select>
        </div>

        <div>
          
        </div>
      </form>
    </div>
  )
}
