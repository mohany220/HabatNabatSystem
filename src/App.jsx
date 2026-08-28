import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";

import DashboardLayout from "./pages/DashboardLayout";

import DashboardHome from "./dashboard/DashboardHome";
import Products from "./dashboard/Products";
import Customers from "./dashboard/Customers";
import Orders from "./dashboard/Orders";
import Suppliers from "./dashboard/Suppliers";
import Inventory from "./dashboard/Inventory";
import Sales from "./dashboard/Sales";
import Reports from "./dashboard/Reports";
import Users from "./dashboard/Users";
import Settings from "./dashboard/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* الموقع الرئيسي */}
        <Route path="/" element={<Home />} />

        {/* تسجيل الدخول */}
        <Route path="/login" element={<Login />} />

        {/* لوحة التحكم */}
        <Route path="/dashboard" element={<DashboardLayout />}>

          {/* الرئيسية */}
          <Route index element={<DashboardHome />} />

          {/* المنتجات */}
          <Route path="products" element={<Products />} />

          {/* العملاء */}
          <Route path="customers" element={<Customers />} />

          {/* الطلبات */}
          <Route path="orders" element={<Orders />} />

          {/* الموردين */}
          <Route path="suppliers" element={<Suppliers />} />

          {/* المخزن */}
          <Route path="inventory" element={<Inventory />} />

          {/* المبيعات */}
          <Route path="sales" element={<Sales />} />

          {/* التقارير */}
          <Route path="reports" element={<Reports />} />

          {/* المستخدمين */}
          <Route path="users" element={<Users />} />

          {/* الإعدادات */}
          <Route path="settings" element={<Settings />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;