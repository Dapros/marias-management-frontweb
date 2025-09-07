import { NavLink } from "react-router-dom";
import { MdSpaceDashboard } from "react-icons/md";
import { GiHotMeal } from "react-icons/gi";
import { TbInvoice } from "react-icons/tb";
import { AnalyticsIcon } from "../icons-components/AnalyticsIcon";
import { FaPiggyBank } from "react-icons/fa6";


export default function SideBar() {
  const activeWrapper = "border-1 border-transparent px-4 py-2 rounded-md flex items-center bg-teal-950 text-teal-100";
  const inactiveWrapper = "border-1 border-transparent hover:border-white p-2 rounded-md flex items-center";

  return (
    <div className="min-h-screen bg-[#111] p-2 font-poppins flex flex-col">
      {/* Header del slider menu */}
      <div className="flex items-center gap-2 py-4">
        <h1 className="font-bold text-white">Marias Management</h1>
      </div>

      {/* Links de navegacion y Footer */}
      <div className="flex flex-col flex-1 justify-between">
        {/* Links de navegacion */}
        <div className="flex flex-col text-white mt-5 gap-3">
          {/* Link a Dashboard */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? activeWrapper : inactiveWrapper
            }
          >
            {({ isActive }) => (
              <>
                {/* Aplica clase condicional al svg */}
                <MdSpaceDashboard size={24} className={isActive ? "icon-dashboard text-current" : "text-current"}/>
                <h1 className="pl-2">Dashboard</h1>
              </>
            )}
          </NavLink>

          {/* Link a Almuerzos */}
          <NavLink 
            to="/lunch" 
            className={({isActive}) =>
              isActive ? activeWrapper : inactiveWrapper
            }
          >
            {({ isActive }) => (
              <>
                <GiHotMeal size={24} className={isActive ? "icon-lunch text-current" : "text-current"} />
                <h1 className="pl-2">Almuerzos</h1>
              </>
            )}
          </NavLink>

          {/* Link a Pedidos */}
          <NavLink 
            to="/orders" 
            className={({isActive}) =>
              isActive ? activeWrapper : inactiveWrapper
            }
          >
            {({ isActive }) => (
              <>
                <TbInvoice size={24} className={isActive ? "icon-orders text-current" : "text-current"} />
                <h1 className="pl-2">Pedidos</h1>
              </>
            )}
          </NavLink>

          {/* Link a Gestion de dinero */}
          <NavLink
            to="/management"
            className={({ isActive }) => 
              isActive ? activeWrapper : inactiveWrapper
            }
          >
            {({ isActive }) => (
              <>
                <FaPiggyBank size={24} className={isActive ? "icon-dashboard text-current" : "text-current" } />
                <h1 className="pl-2">Gestión</h1>
              </>
            )}
          </NavLink>

          {/* Link a Analisis */}
          <NavLink 
            to="/analytics" 
            className={({isActive}) =>
              isActive ? activeWrapper : inactiveWrapper
            }
          >
            {({ isActive }) => (
              <>
                <AnalyticsIcon isActive={isActive} className="text-teal-100" />
                <h1 className="pl-2">Análisis</h1>
              </>
            )}
          </NavLink>
        </div>
        {/* Footer del slider menu */}
        <div className="">
          <p className="text-xs font-extrabold text-center text-teal-600">Power By: Dapros</p>
          <p className="text-xs mt-1 text-center text-gray-400">© 2025 marias management</p>
        </div>
      </div>
    </div>
  )
}
