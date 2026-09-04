import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiPackage,
  FiShoppingBag,
  FiImage,
  FiArrowLeft,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: FiGrid,
      end: true,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: FiPackage,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: FiShoppingBag,
    },
    {
      name: "Banners",
      path: "/admin/banners",
      icon: FiImage,
    },
  ];

  const handleLogout = () => {
    setMobileOpen(false);
    logout();
    navigate("/login");
  };

  const closeMobile = () => {
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">

      {/* Main Navbar */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/admin"
          onClick={closeMobile}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <span className="text-lg font-bold">M</span>
          </div>

          <div>
            <h1 className="text-lg font-bold leading-tight text-gray-900">
              MilkRoute
            </h1>

            <p className="text-[11px] font-medium uppercase tracking-wider text-emerald-600">
              Admin Panel
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <Icon className="text-base" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Desktop Right */}
        <div className="hidden items-center gap-4 md:flex">

          {/* User */}
          <div className="flex items-center gap-3 border-r border-gray-200 pr-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-700">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-gray-800">
                {user?.name || "Admin"}
              </p>

              <p className="text-xs text-gray-500">
                Administrator
              </p>
            </div>
          </div>

          {/* Store */}
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-emerald-600"
          >
            <FiArrowLeft />
            Store
          </Link>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <FiLogOut />
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100 md:hidden"
          aria-label="Toggle admin navigation"
        >
          {mobileOpen ? (
            <FiX className="text-xl" />
          ) : (
            <FiMenu className="text-xl" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`overflow-hidden border-t border-gray-100 transition-all duration-300 md:hidden ${
          mobileOpen
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-1 px-4 py-3">

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={closeMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                <Icon className="text-lg" />
                {item.name}
              </NavLink>
            );
          })}

          <div className="my-2 border-t border-gray-100" />

          {/* User */}
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-700">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-800">
                {user?.name || "Admin"}
              </p>

              <p className="text-xs text-gray-500">
                Administrator
              </p>
            </div>
          </div>

          {/* Store */}
          <Link
            to="/"
            onClick={closeMobile}
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <FiArrowLeft />
            Back to Store
          </Link>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-red-500 hover:bg-red-50"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;