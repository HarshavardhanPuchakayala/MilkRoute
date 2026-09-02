import {  Routes, Route } from "react-router-dom";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import NotAuthorized from "./pages/NotAuthorized";
import AdminRoute from "./components/AdminRoute";
import Catalog from "./pages/Catalog";
function App() {
  return (

<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/not-authorized" element={<NotAuthorized />} />
<Route path="/" element={<Catalog />} />
  <Route path="/cart" element={<Cart />} />
  <Route element={<ProtectedRoute />}>
 
  </Route>

  <Route element={<AdminRoute />}>
  </Route>
</Routes>
  );
}

export default App;