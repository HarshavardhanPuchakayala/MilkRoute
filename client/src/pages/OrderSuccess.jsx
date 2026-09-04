import { Link, useLocation } from "react-router-dom";
import { FiCheckCircle, FiShoppingBag } from "react-icons/fi";

const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm animate-[fadeUp_0.4s_ease-out]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 animate-[scaleIn_0.5s_cubic-bezier(0.34,1.56,0.64,1)]">
          <FiCheckCircle className="text-3xl text-emerald-600" />
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">Order Placed!</h1>

        <p className="mt-3 text-gray-600">
          Thank you for your order. Your order has been successfully placed.
        </p>

        {order && (
          <div className="mt-6 rounded-2xl bg-gray-50 p-4 text-left">
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="mt-1 break-all font-mono text-sm font-medium text-gray-900">
              {order._id}
            </p>

            <p className="mt-4 text-sm text-gray-500">Total</p>
            <p className="mt-1 text-lg font-bold text-emerald-600 tabular-nums">
              ₹{Number(order.totalAmount).toFixed(2)}
            </p>
          </div>
        )}

        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 hover:shadow-md active:scale-95"
        >
          <FiShoppingBag /> Continue Shopping
        </Link>
      </div>

 
    </main>
  );
};

export default OrderSuccess;