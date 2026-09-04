import { useEffect, useState } from "react";
import api from "../api/axios.js";
import {
  FiShoppingBag,
  FiDollarSign,
  FiUsers,
  FiPackage,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiXCircle,
  FiRepeat,
  FiPause,
} from "react-icons/fi";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const params = {};

      if (filters.startDate) {
        params.startDate = filters.startDate;
      }

      if (filters.endDate) {
        params.endDate = filters.endDate;
      }

      const response = await api.get("/admin/analytics", { params });

      setStats(response.data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleFilter = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
    });

    setTimeout(fetchAnalytics, 0);
  };

  if (loading && !stats) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="h-8 w-56 rounded-md bg-gray-100 animate-pulse mb-6" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Monitor MilkRoute performance.</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">From</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilter}
              className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">To</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilter}
              className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <button
            type="button"
            onClick={fetchAnalytics}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold shadow-sm transition-all duration-200 hover:bg-emerald-700 hover:shadow-md active:scale-95"
          >
            Apply
          </button>

          <button
            type="button"
            onClick={clearFilters}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium transition-colors hover:bg-gray-50"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FiShoppingBag} title="Total Orders" value={stats?.totalOrders ?? 0} />
        <StatCard
          icon={FiDollarSign}
          title="Total Revenue"
          value={`₹${stats?.totalRevenue ?? 0}`}
          highlight
        />
        <StatCard icon={FiUsers} title="Customers" value={stats?.totalCustomers ?? 0} />
        <StatCard icon={FiPackage} title="Products" value={stats?.totalProducts ?? 0} />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-lg mb-4 text-gray-900">Order Summary</h2>

          <div className="space-y-1">
            <SummaryRow icon={FiClock} iconColor="text-amber-500" label="Pending" value={stats?.pendingOrders ?? 0} />
            <SummaryRow icon={FiPackage} iconColor="text-blue-500" label="Confirmed" value={stats?.confirmedOrders ?? 0} />
            <SummaryRow icon={FiCheckCircle} iconColor="text-emerald-500" label="Delivered" value={stats?.deliveredOrders ?? 0} />
            <SummaryRow icon={FiXCircle} iconColor="text-red-500" label="Cancelled" value={stats?.cancelledOrders ?? 0} />
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-lg mb-4 text-gray-900">Subscription Summary</h2>

          <div className="space-y-1">
            <SummaryRow icon={FiRepeat} iconColor="text-emerald-500" label="Active Subscriptions" value={stats?.activeSubscriptions ?? 0} />
            <SummaryRow icon={FiPause} iconColor="text-amber-500" label="Paused Subscriptions" value={stats?.pausedSubscriptions ?? 0} />
            <SummaryRow icon={FiXCircle} iconColor="text-red-500" label="Cancelled Subscriptions" value={stats?.cancelledSubscriptions ?? 0} />
          </div>
        </div>
      </div>

      {/* Top Products */}
      {stats?.topProducts?.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 mt-6 shadow-sm">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-900">
            <FiTrendingUp className="text-emerald-500" /> Top Products
          </h2>

          <div className="space-y-1">
            {stats.topProducts.map((product, index) => (
              <div
                key={product._id || index}
                className="flex justify-between items-center border-b border-gray-50 last:border-0 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-600">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.quantitySold ?? 0} sold</p>
                  </div>
                </div>

                <p className="font-semibold text-gray-900 tabular-nums">₹{product.revenue ?? 0}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, highlight }) => (
  <div
    className={`rounded-2xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
      highlight ? "bg-emerald-600 text-white" : "bg-white border border-gray-100 text-gray-900"
    }`}
  >
    <div className="flex items-center justify-between mb-3">
      <p className={`text-sm ${highlight ? "text-emerald-50" : "text-gray-500"}`}>{title}</p>
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full ${
          highlight ? "bg-white/20" : "bg-emerald-50 text-emerald-600"
        }`}
      >
        <Icon className="text-sm" />
      </div>
    </div>

    <p className="text-2xl font-bold tabular-nums">{value}</p>
  </div>
);

const SummaryRow = ({ icon: Icon, iconColor, label, value }) => (
  <div className="flex justify-between items-center py-2">
    <span className="flex items-center gap-2 text-gray-600">
      <Icon className={iconColor} />
      {label}
    </span>

    <span className="font-semibold text-gray-900 tabular-nums">{value}</span>
  </div>
);

export default AdminDashboard;