import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllOrders } from "../api/orders";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
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
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            All Orders
          </h1>

          <Link
            to="/admin/products"
            className="text-sm font-medium text-green-600 hover:text-green-700"
          >
            Manage Products
          </Link>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-600">No orders have been placed yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            All Orders
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {orders.length} {orders.length === 1 ? "order" : "orders"}
          </p>
        </div>

        <Link
          to="/admin/products"
          className="text-sm font-medium text-green-600 hover:text-green-700"
        >
          Manage Products
        </Link>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
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
                className={`w-fit rounded-full px-3 py-1 text-xs font-medium capitalize ${
                  statusStyles[order.status] ||
                  "bg-gray-100 text-gray-800"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="mb-5 rounded-lg bg-gray-50 p-4">
              <h3 className="text-sm font-semibold text-gray-900">
                Customer
              </h3>

              <p className="mt-1 text-sm text-gray-700">
                {order.userId?.name || "Unknown customer"}
              </p>

              <p className="text-sm text-gray-500">
                {order.userId?.email || "No email available"}
              </p>
            </div>

            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={`${order._id}-${item.productId || index}`}
                  className="flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {item.quantity} × ₹{Number(item.price).toFixed(2)}
                    </p>
                  </div>

                  <p className="font-medium text-gray-900">
                    ₹
                    {(Number(item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-between border-t border-gray-200 pt-5">
              <span className="font-semibold text-gray-900">
                Total
              </span>

              <span className="font-semibold text-gray-900">
                ₹{Number(order.totalAmount).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;