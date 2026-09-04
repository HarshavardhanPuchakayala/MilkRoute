import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../api/orders";
import {
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiXCircle,
  FiAlertCircle,
  FiPackage,
  FiShoppingBag,
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

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyOrders();
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load your orders. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8 h-8 w-40 rounded-md bg-gray-100 animate-pulse" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-4 h-4 w-32 rounded bg-gray-100 animate-pulse" />
              <div className="mb-2 h-3 w-full rounded bg-gray-100 animate-pulse" />
              <div className="h-3 w-2/3 rounded bg-gray-100 animate-pulse" />
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
          <FiAlertCircle className="text-2xl" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">Unable to load orders</h1>
        <p className="mt-2 text-red-600 text-sm">{error}</p>

        <Link
          to="/"
          className="mt-6 inline-block font-medium text-emerald-600 hover:text-emerald-700"
        >
          Back to Catalog
        </Link>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
          <FiPackage className="text-2xl" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <p className="mt-2 text-gray-500">You haven't placed any orders yet.</p>

        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 hover:shadow-md active:scale-95"
        >
          <FiShoppingBag /> Browse Products
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="mt-1 text-gray-500">View your recent orders and their status.</p>
      </div>

      <div className="space-y-5">
        {orders.map((order, index) => {
          const status = order.status?.toLowerCase() || "pending";
          const statusClass = statusStyles[status] || "bg-gray-100 text-gray-700 border-gray-200";
          const StatusIcon = statusIcons[status] || FiClock;

          return (
            <article
              key={order._id}
              style={{ animationDelay: `${index * 60}ms` }}
              className="rounded-2xl bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md animate-[fadeUp_0.4s_ease-out_backwards]"
            >
              <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="mt-1 font-mono text-sm font-medium text-gray-900">
                    #{order._id.slice(-8)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <span
                  className={`flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold capitalize ${statusClass}`}
                >
                  <StatusIcon className="text-sm" />
                  {status}
                </span>
              </div>

              <div className="mt-5">
                <h2 className="font-semibold text-gray-900">Items</h2>

                <div className="mt-3 divide-y divide-gray-100">
                  {order.items.map((item, itemIndex) => (
                    <div
                      key={`${order._id}-${item.productId}-${itemIndex}`}
                      className="flex items-center justify-between gap-4 py-3"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="mt-1 text-sm text-gray-500 tabular-nums">
                          {item.quantity} × ₹{Number(item.price).toFixed(2)}
                        </p>
                      </div>

                      <p className="font-medium text-gray-900 tabular-nums">
                        ₹{(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-5">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-xl font-bold text-emerald-600 tabular-nums">
                  ₹{Number(order.totalAmount).toFixed(2)}
                </span>
              </div>

              {status !== "cancelled" && (
                <Link
                  to={`/orders/${order._id}/tracking`}
                  className="mt-4 flex items-center justify-center gap-1.5 rounded-full border border-emerald-200 py-2.5 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-50"
                >
                  <FiTruck /> Track Order
                </Link>
              )}
            </article>
          );
        })}
      </div>


    </main>
  );
};

export default MyOrders;