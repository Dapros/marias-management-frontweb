import LunchForm from "../components/forms/LunchForm";
import { FaPlus } from "react-icons/fa6";
import ViewForm from "../components/custom/ViewForm";
import { IoClose } from "react-icons/io5";
import { useLunchStore } from "../store/useLunchStore";
import LunchCard from "../components/cards/LunchCard";


export default function LunchPage() {

  // estados globales y acciones de almuerzo
  const { lunches, showLunchForm, toggleLunchForm, resetDraft, setEditingMode } = useLunchStore()

  const handleShowLunchForm = () => {
    toggleLunchForm()
    if(showLunchForm === false) {
      resetDraft()
      setEditingMode(false)
    }
    console.log("Formulario")
  }

  return (
    <div className="p-4 md:p-6 min-h-full font-poppins">
      {/* Encabezado de la página con titulo y texto */}
      <div className="flex flex-col mb-6">
        <h1 className="text-xl font-bold text-teal-600">Almuerzos</h1>
        <p>
          Aquí puedes registrar, editar y eliminar almuerzos, que luego puedes seleccionar al hacer
          <span className="font-bold text-teal-600"> pedidos.</span>
        </p>
      </div>

      {/* Contenido principal de la página */}
      <div className="space-y-4">
        <button 
          onClick={handleShowLunchForm}
          className={`flex items-center gap-2 py-2 px-4 border-2 rounded-lg transition-normal ease-in-out duration-300 ${showLunchForm ? "text-red-600 hover:bg-red-50" : "text-teal-600 hover:bg-teal-50 border-teal-600"}`}
        >
          {showLunchForm ? <IoClose size={24}/> : <FaPlus size={24}/>}
          <p className="font-bold">{showLunchForm ? "Cancelar nuevo almuerzo" : "Registrar nuevo almuerzo"}</p>
        </button>
        {showLunchForm && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 rounded-lg shadow-lg bg-white overflow-hidden">
            {/* Formulario para almuerzo */}
            <LunchForm />
            {/* Vista previa de como esta quedando el almuerzo */}
            <ViewForm />
          </div>
        )}

        {/* Almuerzos listados */}
        <div className=" mt-8">
          <h1 className="text-xl mb-8 font-semibold text-teal-600">Lista de almuerzos agregados</h1>
          {lunches.length === 0 ? (
            <p className="text-gray-500 text-center">No hay almuerzos registrados aun.</p>
          ): (
            <div className="columns-1 md:columns-2 lg:columns-4 gap-4">
              {lunches.map(lunch => (
                <div key={lunch.id} className="mb-4 break-inside-avoid">
                  <LunchCard 
                    id={lunch.id}
                    title={lunch.title}
                    imagen={lunch.imagen}
                    price={lunch.price}
                    tags={lunch.tags}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
