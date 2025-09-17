import { LuUpload } from "react-icons/lu";
import { useLunchStore } from "../../store/useLunchStore";
import type { ChangeEvent, FormEvent } from "react";
import { TfiReload } from "react-icons/tfi";
import { IoTrashOutline } from "react-icons/io5";



export default function LunchForm() {
  // estados y funciones del store de almuerzos
  const {
    draft,
    isEditing,
    loading,
    error,
    setDraftTitle,
    setDraftImagen,
    setDraftPrice,
    setDraftTags,
    toggleLunchForm,
    addLunchFromDraft,
    updateLunchFromLunches,
    deleteLunchById,
    resetDraftImagen,
    setError,
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

  // manejador de cambios de la imagen (convierte a base64 data URL)
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      setDraftImagen("")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setDraftImagen(result)
    }
    reader.onerror = () => {
      setDraftImagen("")
    }
    reader.readAsDataURL(file)
  }

  // Envio del formulario para guardar en el store
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    try {
      await addLunchFromDraft()
      toggleLunchForm()
    } catch (error) {
      console.error('Error al guardar almuerzo:', error)
    }
  }

  // Manejador para actualizar un almuerzo existente
  const handleUpdate = async () => {
    setError(null)
    try {
      await updateLunchFromLunches()
      toggleLunchForm()
    } catch (error) {
      console.error('Error al actualizar almuerzo:', error)
    }
  }

  // Manejador para eliminar un almuerzo
  const handleDelete = async () => {
    if (draft.id) {
      setError(null)
      try {
        await deleteLunchById(draft.id)
        toggleLunchForm()
      } catch (error) {
        console.error('Error al eliminar almuerzo:', error)
      }
    }
  }

  return (
    <div>
      <form
        className="flex flex-col gap-6 p-4"
        onSubmit={handleSubmit}
      >
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          {isEditing ? "Formulario de editar almuerzo" : "Formulario de agregar almuerzo"}
        </h3>

        {/* Mostrar errores */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Mostrar estado de carga */}
        {loading && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
            <p className="font-semibold">Procesando...</p>
            <p>Por favor espera mientras se guarda la información.</p>
          </div>
        )}

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

        <div className="flex gap-3">
          <button
            type="submit"
            className="py-2 px-4 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-normal ease-in-out duration-300 disabled:opacity-50"
            disabled={!draft.title || draft.price <= 0 || loading}
          >
            {loading ? "Guardando..." : (isEditing ? "Duplicar almuerzo" : "Guardar almuerzo")}
          </button>
          
          {isEditing && (
            <>
              <button
                type="button"
                onClick={handleUpdate}
                className="py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-normal ease-in-out duration-300 disabled:opacity-50"
                disabled={!draft.title || draft.price <= 0 || loading}
              >
                {loading ? "Actualizando..." : "Actualizar almuerzo"}
              </button>
              
              <button
                type="button"
                onClick={handleDelete}
                className="py-2 px-4 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-normal ease-in-out duration-300 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Eliminando..." : "Eliminar almuerzo"}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  )
}
