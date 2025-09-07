
export default function LunchForm() {
  return (
    <form className="flex flex-col p-4 gap-2">
      
      <div className="py-1 px-2 bg-gray-100 rounded-lg w-fit">
        <label htmlFor="lunchImage">Subir Imagen</label>
        <input 
          type="file" 
          style={{ display: "none" }} 
          id="lunchImage" 
          accept="image/*" name="lunchImage" 
        />
      </div>

      <div className="px-2">
        <label htmlFor="lunchTitle">Titulo para el almuerzo</label>
        <input 
          type="text"
          placeholder="Ej: Almuerzo Ejecutivo, Carne asada, Pechuga, etc.."
          className="border-b w-full"
          name="lunchTitle"
        />
      </div>
    </form>
  )
}
