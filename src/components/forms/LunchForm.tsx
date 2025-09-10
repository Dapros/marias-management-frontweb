import { LuUpload } from "react-icons/lu";
import { useLunchStore } from "../../store/useLunchStore";
import type { ChangeEvent, FormEvent } from "react";
import { TfiReload } from "react-icons/tfi";
import { IoTrashOutline } from "react-icons/io5";



export default function LunchForm() {
  // estados y funciones del store de almuerzos
  const {
    draft,
    setDraftTitle,
    setDraftImagen,
    setDraftPrice,
    setDraftTags,
    addLunchFromDraft,
    resetDraftImagen,
  } = useLunchStore()

  // manejador de cambios en el titulo
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDraftTitle(e.target.value)
  }

  // manejador de cambios en el precio
  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    setDraftPrice(Number.isNaN(value) ? 0 : value)
  }

  // manejador para agregar tags individuales al presionar Enter
  const handleTagsKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const input = e.target as HTMLInputElement
      const newTag = input.value.trim()
      
      if (newTag && !draft.tags.includes(newTag)) {
        setDraftTags([...draft.tags, newTag])
        input.value = ''
      }
    }
  }

  // manejador para eliminar un tag específico
  const removeTag = (tagToRemove: string) => {
    setDraftTags(draft.tags.filter(tag => tag !== tagToRemove))
  }

  // manejador de cambios de la imagen
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      setDraftImagen(objectUrl)
    } else {
      setDraftImagen("")
    }
  }

  // Envio del formulario para guardar en el store
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    addLunchFromDraft()
  }

  // manejador de click del botón de guardar
  const handleSaveClick = () => {
    addLunchFromDraft()
  }

  return (
    <div>
      <form
        className="flex flex-col gap-6 p-4"
        onSubmit={handleSubmit}
      >
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Formulario de agregar almuerzo</h3>

        <div className="flex space-x-2">
          <label htmlFor="imageUpload" className="flex items-center gap-2 text-teal-700 border w-fit py-2 px-4 border-teal-700 rounded-lg hover:border-dashed cursor-pointer">
            {draft.imagen ? "Cambiar imagen" : "Subir imagen"}
            {draft.imagen ? <TfiReload size={20} /> : <LuUpload size={20} />}
          </label>
          {draft.imagen && (
            <button 
              type="button" 
              onClick={() => resetDraftImagen()}
              className="flex items-center gap-2 text-red-600 border w-fit py-2 px-4 border-red-600 rounded-lg hover:border-dashed cursor-pointer"
            >
              Eliminar imagen
              <IoTrashOutline size={20} />
            </button>
          )}
          <input 
            type="file" 
            id="imageUpload" 
            style={{display: "none"}}
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="titleLunch" className="text-lg">Ingresa un titulo para el Almuerzo</label>
          <input 
            type="text" 
            id="titleLunch"
            className="outline-none border placeholder:opacity-50 py-1 px-2 rounded-lg border-gray-500 focus:border-teal-600 focus:placeholder:text-teal-600 transition-normal ease-in-out duration-300"
            placeholder="p. ej. Carne asada"
            value={draft.title}
            onChange={handleTitleChange}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="priceLunch" className="text-lg">Ingresa el precio del Almuerzo</label>
          <input 
            type="number" 
            id="priceLunch"
            className="outline-none border placeholder:opacity-50 py-1 px-2 rounded-lg border-gray-500 focus:border-teal-600 focus:placeholder:text-teal-600 transition-normal ease-in-out duration-300"
            placeholder="escribe el numero sin punto ni espacios. p. ej. 15000"
            value={draft.price || ""}
            onChange={handlePriceChange}
            min={0}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="tagsLunch" className="text-lg">Ingresa detalles del almuerzo</label>
          <input 
            type="text" 
            id="tagsLunch"
            className="outline-none border placeholder:opacity-50 py-1 px-2 rounded-lg border-gray-500 focus:border-teal-600 focus:placeholder:text-teal-600 transition-normal ease-in-out duration-300"
            placeholder="Presiona Enter para agregar cada detalle (ej: arroz, sopa, agua panela...)"
            onKeyPress={handleTagsKeyPress}
          />
          
          {/* Mostrar tags agregados */}
          {draft.tags.length > 0 && (
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
          )}
        </div>

        <div>
          <button
            type="button"
            onClick={handleSaveClick}
            className="py-2 px-4 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-normal ease-in-out duration-300 disabled:opacity-50"
            disabled={!draft.title || draft.price <= 0}
          >
            Guardar almuerzo
          </button>
        </div>
      </form>
    </div>
  )
}
