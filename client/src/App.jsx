import {  Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Catalog from "./pages/Catalog";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrder";
import NotAuthorized from "./pages/NotAuthorized";

import AdminRoute from "./components/AdminRoute";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/Adminoders";
function App() {
  return (
<>
<Navbar/>
 <Routes>
            <Route path="/" element={<Catalog />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/not-authorized" element={<NotAuthorized />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/my-orders" element={<MyOrders />} />
            </Route>

            <Route element={<AdminRoute />}>
              <Route
                path="/admin/products"
                element={<AdminProducts />}
              />
              <Route
                path="/admin/orders"
                element={<AdminOrders />}
              />
            </Route>
          </Routes>
</>
  );
}

export default App;