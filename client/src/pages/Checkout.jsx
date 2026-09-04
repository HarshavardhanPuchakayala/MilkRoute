import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder, createPaymentOrder } from "../api/orders";
import {
  FiShoppingBag,
  FiAlertCircle,
  FiArrowLeft,
  FiLock,
  FiCreditCard,
} from "react-icons/fi";

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    try {
      setPlacingOrder(true);
      setError("");

      const items = cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      const { order } = await createOrder(items);

      const paymentData = await createPaymentOrder(order._id);

      const options = {
        key: paymentData.keyId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        order_id: paymentData.razorpayOrderId,
        name: "MilkRoute",
        description: `Order #${order._id.slice(-8)}`,

        handler: function () {
          // Only a client-side success signal.
          // Webhook is the actual payment confirmation.
          clearCart();

          navigate("/order-success", {
            state: { order },
          });
        },

        modal: {
          ondismiss: function () {
            setError("Payment was not completed. You can try again.");
            setPlacingOrder(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      console.error("Failed to place order:", error);

      setError(
        error.response?.data?.message || "Failed to place order. Please try again."
      );

      setPlacingOrder(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-[70vh] bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-md rounded-3xl bg-white p-10 text-center shadow-sm animate-[fadeUp_0.4s_ease-out]">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-4xl text-emerald-500">
            <FiShoppingBag />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Your Cart is Empty</h1>
          <p className="mt-2 text-sm text-gray-500">There are no items to checkout.</p>

          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 hover:shadow-md active:scale-95"
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="mt-1 text-sm text-gray-500">Review your order before placing it.</p>
        </div>

        {error && (
          <div
            className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 animate-[fadeUp_0.3s_ease-out]"
            role="alert"
          >
            <FiAlertCircle className="mt-0.5 shrink-0 text-lg" />
            <div>
              <p className="font-semibold">Unable to place order</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Order items */}
          <section className="lg:col-span-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">Order Items</h2>

              <div className="mt-6 divide-y divide-gray-100">
                {cart.map((item) => {
                  const lineTotal = Number(item.price) * item.quantity;

                  return (
                    <div key={item.productId} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-gray-500">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="mt-1 text-sm text-gray-500 tabular-nums">
                          ₹{Number(item.price).toFixed(2)} × {item.quantity}
                        </p>
                      </div>

                      <p className="font-semibold text-gray-900 tabular-nums">
                        ₹{lineTotal.toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <Link
              to="/cart"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700"
            >
              <FiArrowLeft className="text-sm" /> Back to Cart
            </Link>
          </section>

          {/* Summary */}
          <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>

            <div className="mt-6 flex items-center justify-between border-b border-gray-100 pb-4">
              <span className="text-gray-600">Items</span>
              <span className="font-medium text-gray-900 tabular-nums">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-emerald-600 tabular-nums">
                ₹{cartTotal.toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3.5 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {placingOrder ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Placing Order...
                </>
              ) : (
                <>
                  <FiCreditCard /> Place Order
                </>
              )}
            </button>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-gray-500">
              <FiLock className="text-xs" />
              Final price and stock availability are confirmed when the order is placed.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Checkout;