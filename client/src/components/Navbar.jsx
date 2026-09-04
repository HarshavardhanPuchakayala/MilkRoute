import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

import {
  FiShoppingCart,
  FiMenu,
  FiX,
  FiLogOut,
  FiPackage,
  FiDroplet,
  FiCreditCard,
  FiSettings,
} from "react-icons/fi";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = cart?.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  ) || 0;

  // Exact route or nested route
  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  const linkClass = (path) =>
    `relative flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 ${
      isActive(path)
        ? "text-emerald-600"
        : "text-gray-600 hover:text-emerald-600"
    }`;

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-1.5 text-xl font-bold text-emerald-600 transition-transform duration-200 hover:scale-[1.02]"
        >
          <FiDroplet className="text-2xl" />
          MilkRoute
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 md:flex">

          <Link to="/" className={linkClass("/")}>
            Catalog
          </Link>

          <Link to="/cart" className={linkClass("/cart")}>
            <FiShoppingCart className="text-base" />
            Cart

            {cartCount > 0 && (
              <span
                key={cartCount}
                className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1.5 text-[11px] font-bold text-white"
              >
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link to="/my-orders" className={linkClass("/my-orders")}>
                <FiPackage className="text-base" />
                My Orders
              </Link>

              <Link
                to="/my-subscription"
                className={linkClass("/my-subscription")}
              >
                <FiCreditCard className="text-base" />
                Subscription
              </Link>

              {/* Admin link */}
              {user.role === "admin" && (
                <Link to="/admin" className={linkClass("/admin")}>
                  <FiSettings className="text-base" />
                  Admin
                </Link>
              )}

              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1.5 text-sm font-medium text-red-500 transition-colors duration-200 hover:text-red-600"
              >
                <FiLogOut className="text-base" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass("/login")}>
                Login
              </Link>

              <Link
                to="/signup"
                className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 hover:shadow-md active:scale-95"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-700 transition-colors duration-200 hover:bg-gray-100 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <FiX className="text-xl" />
          ) : (
            <FiMenu className="text-xl" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`overflow-hidden border-t border-gray-100 bg-white transition-all duration-300 ease-in-out md:hidden ${
          menuOpen
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-1 px-4 py-3">

          {/* Catalog */}
          <Link
            to="/"
            onClick={closeMenu}
            className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive("/")
                ? "bg-emerald-50 text-emerald-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Catalog
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            onClick={closeMenu}
            className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive("/cart")
                ? "bg-emerald-50 text-emerald-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <FiShoppingCart />
              Cart
            </span>

            {cartCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1.5 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              {/* My Orders */}
              <Link
                to="/my-orders"
                onClick={closeMenu}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive("/my-orders")
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FiPackage />
                My Orders
              </Link>

              {/* Subscription */}
              <Link
                to="/my-subscription"
                onClick={closeMenu}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive("/my-subscription")
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FiCreditCard />
                Subscription
              </Link>

              {/* Admin */}
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={closeMenu}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive("/admin")
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <FiSettings />
                  Admin Dashboard
                </Link>
              )}

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
              >
                <FiLogOut />
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Login */}
              <Link
                to="/login"
                onClick={closeMenu}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive("/login")
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Login
              </Link>

              {/* Sign Up */}
              <Link
                to="/signup"
                onClick={closeMenu}
                className="mt-1 rounded-lg bg-emerald-600 px-3 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
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