import { useLunchStore } from "../../store/useLunchStore"
import { formatCurrencyCOP } from "../../utils/format/curremcy"

export default function ViewForm() {
  const { draft, setDraftTags } = useLunchStore()
  
  // manejador para eliminar un tag específico
  const removeTag = (tagToRemove: string) => {
    setDraftTags(draft.tags.filter(tag => tag !== tagToRemove))
  }

  return (
    <div className="p-4 bg-gray-50">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Vista previa del almuerzo</h3>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Imagen del almuerzo */}
        <div className="aspect-video h-64 w-full bg-gray-200 flex items-center justify-center">
          {draft.imagen ? (
            <img 
              src={draft.imagen} 
              alt={draft.title || "Almuerzo"} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-400 text-center">
              <p className="text-sm">Sin imagen</p>
            </div>
          )}
        </div>

        {/* Información del almuerzo */}
        <div className="p-4 space-y-3">
          {/* Título */}
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {draft.title || "Sin título"}
            </h2>
          </div>

          {/* Precio */}
          <div>
            <p className="text-2xl font-bold text-teal-600">
              {draft.price > 0 ? formatCurrencyCOP.format(draft.price) : "Sin precio"}
            </p>
          </div>

          {/* Tags/Detalles */}
          <div>
            <h4 className="text-sm font-semibold text-gray-600 mb-2">Detalles:</h4>
            {draft.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                <div className="flex flex-wrap gap-2 mt-2">
                  {draft.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-950 rounded-full text-sm font-medium"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-teal-600 hover:text-teal-800 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Sin detalles agregados</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
