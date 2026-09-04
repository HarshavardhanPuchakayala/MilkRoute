import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllOrders } from "../api/orders";
import {
  FiClock,
  FiPackage,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiArrowRight,
} from "react-icons/fi";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const statusIcons = {
  pending: FiClock,
  confirmed: FiPackage,
  delivered: FiCheckCircle,
  cancelled: FiXCircle,
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data.orders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load orders. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="h-8 w-40 rounded-md bg-gray-100 animate-pulse mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-start gap-3 rounded-xl bg-red-50 p-4 text-red-700">
          <FiAlertCircle className="mt-0.5 shrink-0" />
          {error}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">All Orders</h1>

          <Link
            to="/admin/products"
            className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            Manage Products <FiArrowRight className="text-xs" />
          </Link>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-400">
            <FiPackage className="text-xl" />
          </div>
          <p className="text-gray-600">No orders have been placed yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Orders</h1>
          <p className="mt-1 text-sm text-gray-500">
            {orders.length} {orders.length === 1 ? "order" : "orders"}
          </p>
        </div>

        <Link
          to="/admin/products"
          className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          Manage Products <FiArrowRight className="text-xs" />
        </Link>
      </div>

      <div className="space-y-5">
        {orders.map((order, index) => {
          const StatusIcon = statusIcons[order.status] || FiClock;

          return (
            <div
              key={order._id}
              style={{ animationDelay: `${index * 50}ms` }}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md animate-[fadeUp_0.4s_ease-out_backwards]"
            >
              <div className="mb-5 flex flex-col gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Order #{order._id.slice(-8)}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium capitalize ${
                    statusStyles[order.status] || "bg-gray-100 text-gray-800 border-gray-200"
                  }`}
                >
                  <StatusIcon className="text-xs" />
                  {order.status}
                </span>
              </div>

              <div className="mb-5 rounded-xl bg-gray-50 p-4">
                <h3 className="text-sm font-semibold text-gray-900">Customer</h3>

                <p className="mt-1 text-sm text-gray-700">
                  {order.userId?.name || "Unknown customer"}
                </p>

                <p className="text-sm text-gray-500">
                  {order.userId?.email || "No email available"}
                </p>
              </div>

              <div className="space-y-3">
                {order.items.map((item, itemIndex) => (
                  <div
                    key={`${order._id}-${item.productId || itemIndex}`}
                    className="flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>

                      <p className="text-sm text-gray-500 tabular-nums">
                        {item.quantity} × ₹{Number(item.price).toFixed(2)}
                      </p>
                    </div>

                    <p className="font-medium text-gray-900 tabular-nums">
                      ₹{(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex justify-between border-t border-gray-100 pt-5">
                <span className="font-semibold text-gray-900">Total</span>

                <span className="font-semibold text-emerald-600 tabular-nums">
                  ₹{Number(order.totalAmount).toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

 </div>
  );
};

export default AdminOrders;