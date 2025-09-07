import { useState } from "react";
import LunchForm from "../components/forms/LunchForm";
import { FaPlus } from "react-icons/fa6";
import ViewForm from "../components/custom/ViewForm";
import { useLunchStore } from "../store/useLunchStore";


export default function LunchPage() {

  // state local para mostrar el formulario si se crea un nuevo almuerzo
  const [showLunchForm, setShowLunchForm] = useState(false)

  const handleShowLunchForm = () => {
    setShowLunchForm(!showLunchForm)
    console.log("Formulario")
  }

  const { lunches } = useLunchStore()

  return (
    <div className="m-0 md:m-6 w-full min-h-full font-poppins overflow-x-hidden">
      {/* Encabezado de la página con titulo y texto */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-teal-600">Almuerzos</h1>
        <p>
          Aquí puedes registrar, editar y eliminar almuerzos, que luego puedes seleccionar al hacer
          <span className="font-bold text-teal-600"> pedidos.</span>
        </p>
      </div>

      {/* Contenido principal de la página */}
      <div className="mt-6">
        <button 
          onClick={handleShowLunchForm}
          className="flex items-center gap-2 py-2 px-4 border-2 text-teal-600 hover:bg-teal-50 border-teal-600 rounded-lg"
        >
          <FaPlus size={24}/>
          <p className="font-bold">Registrar nuevo almuerzo</p>
        </button>
        {showLunchForm && (
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-lg shadow-lg bg-white">
            {/* Formulario para crear un nuevo almuerzo */}
            <LunchForm />
            {/* Vista previa de como esta quedando el almuerzo */}
            <ViewForm />
          </div>
        )}
      </div>
    </div>
  )
}
