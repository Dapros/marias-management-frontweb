import { Outlet } from "react-router-dom";
import SideBar from "../components/layoutcomponents/SideBar";


export default function Layout() {
  return (
    <>
      <main className="flex h-screen w-full overflow-hidden">
        <div className="w-64 flex-shrink-0">
          <SideBar />
        </div>
        <div className="flex-1 min-w-0 overflow-auto overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </>
  )
}
