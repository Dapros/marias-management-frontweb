import { Outlet } from "react-router-dom";
import SideBar from "../components/layoutcomponents/SideBar";


export default function Layout() {
  return (
    <>
      <main className="flex">
        <div>
          <SideBar />
        </div>
        <div>
          <Outlet />
        </div>
      </main>
    </>
  )
}
