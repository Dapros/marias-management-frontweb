import { useLunchStore } from "../../store/useLunchStore";
import { formatCurrencyCOP } from "../../utils/format/curremcy";

type LunchCardProps = {
  id: string;
  title: string;
  imagen?: string;
  price: number;
  tags?: string[]
}

export default function LunchCard({ id, title, imagen, price, tags }: LunchCardProps) {
  
  const { toggleLunchForm, loadLunchToDraft } = useLunchStore()

  // al hacer doble click se abre el formulario y el draft se carga con los datos del almuerzo seleccionado
  const handleDoubleClick = () => {
    const lunchData = {
      id,
      title,
      imagen: imagen || "",
      price,
      tags: tags || []
    }
    loadLunchToDraft(lunchData)
    toggleLunchForm()
  }

  return (
    <button
      id={id}
      onDoubleClick={handleDoubleClick}
      className="w-fit h-fit shadow-md border border-gray-200 hover:border-teal-100 hover:bg-teal-50 rounded-lg p-2"
    >
      <div className="relative rounded-lg overflow-hidden w-fit flex items-center">
        <img 
          src={imagen ? imagen : "../../../public/logo/mariasMLogo.png"}
          alt={title}
          className={`transform transition-transform duration-300 hover:scale-125 ${imagen ? 'object-cover' : 'opacity-10'}`}
        />
      </div>
      <div className="flex flex-col items-start px-1 pb-1 mt-2">
        <h2 className="font-bold text-lg">{title}</h2>
        <p className="font-bold text-xl text-teal-600 my-1">{formatCurrencyCOP.format(price)} COP</p>
        <p className="text-sm font-semibold text-gray-600 mb-2">Detalles:</p>
        {tags && tags.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <span key={index} className="bg-teal-100 text-teal-800 text-sm font-semibold px-2.5 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs mt-2 text-gray-500">Este almuerzo no tiene detalles/tags</p>
        )}
      </div>
    </button>
  )
}
