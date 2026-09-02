import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          to="/"
          className="text-xl font-bold text-green-600"
        >
          MilkRoute
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link
            to="/"
            className="text-gray-700 hover:text-green-600"
          >
            Catalog
          </Link>

          <Link
            to="/cart"
            className="text-gray-700 hover:text-green-600"
          >
            Cart
            {cart.length > 0 && (
              <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                {cart.length}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link
                to="/my-orders"
                className="text-gray-700 hover:text-green-600"
              >
                My Orders
              </Link>

              <button
                type="button"
                onClick={logout}
                className="text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-green-600"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;