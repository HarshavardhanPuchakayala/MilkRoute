import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Catalog from "./pages/Catalog";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrder";
import NotAuthorized from "./pages/NotAuthorized";

import SubscriptionSetup from "./pages/SubscriptionSetup";
import MySubscription from "./pages/MySubscription.jsx";
import OrderTracking from "./pages/OrderTracking";

import AdminLayout from "./components/AdminLayout.jsx";
import AdminBanners from "./pages/AdminBanners.jsx";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/Adminoders";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Catalog />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/not-authorized"
          element={<NotAuthorized />}
        />

        {/* Protected User Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/order-success"
            element={<OrderSuccess />}
          />
          <Route path="/my-orders" element={<MyOrders />} />

          {/* Subscriptions */}
          <Route
            path="/subscription-setup"
            element={<SubscriptionSetup />}
          />

          <Route
            path="/my-subscription"
            element={<MySubscription />}
          />

          {/* Live Order Tracking */}
          <Route
            path="/orders/:orderId/tracking"
            element={<OrderTracking />}
          />
        </Route>

        {/* Admin Routes */}
     <Route element={<AdminRoute />}>
  <Route element={<AdminLayout />}>
    
    <Route
      path="/admin"
      element={<AdminDashboard />}
    />

    <Route
      path="/admin/products"
      element={<AdminProducts />}
    />

    <Route
      path="/admin/orders"
      element={<AdminOrders />}
    />

    <Route
      path="/admin/banners"
      element={<AdminBanners />}
    />
  </Route>
  

</Route>

      </Routes>
    </>
  );
}

export default App;