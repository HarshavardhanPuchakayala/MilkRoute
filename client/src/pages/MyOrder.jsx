import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../api/orders";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
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
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-gray-600">
            Loading your orders...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Unable to load orders
          </h1>

          <p className="mt-3 text-red-600">{error}</p>

          <Link
            to="/"
            className="mt-6 inline-block font-medium text-green-600 hover:text-green-700"
          >
            Back to Catalog
          </Link>
        </div>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">
            My Orders
          </h1>

          <p className="mt-3 text-gray-600">
            You haven't placed any orders yet.
          </p>

          <Link
            to="/"
            className="mt-6 inline-block rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Orders
          </h1>

          <p className="mt-1 text-gray-600">
            View your recent orders and their status.
          </p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => {
            const status = order.status?.toLowerCase() || "pending";

            const statusClass =
              statusStyles[status] || "bg-gray-100 text-gray-800";

            return (
              <article
                key={order._id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                {/* Order header */}
                <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID
                    </p>

                    <p className="mt-1 font-mono text-sm font-medium text-gray-900">
                      #{order._id.slice(-8)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Date
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-sm font-semibold capitalize ${statusClass}`}
                  >
                    {status}
                  </span>
                </div>

                {/* Items */}
                <div className="mt-5">
                  <h2 className="font-semibold text-gray-900">
                    Items
                  </h2>

                  <div className="mt-3 divide-y divide-gray-100">
                    {order.items.map((item, index) => (
                      <div
                        key={`${order._id}-${item.productId}-${index}`}
                        className="flex items-center justify-between gap-4 py-3"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.name}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            {item.quantity} × ₹
                            {Number(item.price).toFixed(2)}
                          </p>
                        </div>

                        <p className="font-medium text-gray-900">
                          ₹
                          {(
                            Number(item.price) * item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-5">
                  <span className="text-lg font-semibold text-gray-900">
                    Total
                  </span>

                  <span className="text-xl font-bold text-green-600">
                    ₹{Number(order.totalAmount).toFixed(2)}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default MyOrders;