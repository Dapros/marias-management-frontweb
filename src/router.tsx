import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import DashboardPage from "./pages/DashboardPage";
import LunchPage from "./pages/LunchPage";
import OrderPage from "./pages/OrderPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ManagementPage from "./pages/ManagementPage";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout/>}>
          <Route path='/' element={<DashboardPage />} />
          <Route path='/lunch' element={<LunchPage />} />
          <Route path='/orders' element={<OrderPage />} />
          <Route path='/management' element={<ManagementPage />} />
          <Route path='/analytics' element={<AnalyticsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
