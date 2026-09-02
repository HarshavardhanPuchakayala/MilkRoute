import { Link, useLocation } from "react-router-dom";

const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <span className="text-2xl text-green-600">✓</span>
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Order Placed!
        </h1>

        <p className="mt-3 text-gray-600">
          Thank you for your order. Your order has been successfully
          placed.
        </p>

        {order && (
          <div className="mt-6 rounded-xl bg-gray-50 p-4 text-left">
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="mt-1 break-all font-medium text-gray-900">
              {order._id}
            </p>

            <p className="mt-4 text-sm text-gray-600">Total</p>
            <p className="mt-1 font-semibold text-gray-900">
              ₹{Number(order.totalAmount).toFixed(2)}
            </p>
          </div>
        )}

        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
};

export default OrderSuccess;