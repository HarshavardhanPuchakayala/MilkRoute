import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  FiShoppingBag,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiArrowLeft,
  FiShoppingCart,
} from "react-icons/fi";

const Cart = () => {
  const { cart, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();

  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <main className="min-h-[70vh] bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-md rounded-3xl bg-white p-10 text-center shadow-sm animate-[fadeUp_0.4s_ease-out]">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-4xl">
            <FiShoppingCart className="text-emerald-500" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">Your Cart is Empty</h1>

          <p className="mt-2 text-sm text-gray-500">
            You haven't added any products to your cart yet.
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 hover:shadow-md active:scale-95"
          >
            <FiShoppingBag /> Browse Products
          </Link>
        </div>

 
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Your Cart</h1>
            <p className="mt-1 text-sm text-gray-500">Review your items before checkout.</p>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="flex items-center gap-1.5 text-sm font-medium text-red-500 transition-colors hover:text-red-600"
          >
            <FiTrash2 className="text-base" />
            Clear Cart
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Cart items */}
          <section className="space-y-3 lg:col-span-2">
            {cart.map((item, index) => {
              const lineTotal = Number(item.price) * item.quantity;
              const maxQty = Math.max(Math.min(item.stockQuantity || 0, 10), 1);

              return (
                <article
                  key={item.productId}
                  style={{ animationDelay: `${index * 60}ms` }}
                  className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md animate-[fadeUp_0.4s_ease-out_backwards]"
                >
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
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
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-semibold text-gray-900">{item.name}</h2>
                        <p className="mt-1 text-sm text-gray-500 tabular-nums">
                          ₹{Number(item.price).toFixed(2)} each
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                        aria-label="Remove item"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-1 py-1">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, Math.max(1, item.quantity - 1))
                          }
                          disabled={item.quantity <= 1}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm transition-transform active:scale-90 disabled:opacity-30"
                        >
                          <FiMinus className="text-xs" />
                        </button>

                        <span className="w-6 text-center text-sm font-semibold tabular-nums">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, Math.min(maxQty, item.quantity + 1))
                          }
                          disabled={item.quantity >= maxQty}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm transition-transform active:scale-90 disabled:opacity-30"
                        >
                          <FiPlus className="text-xs" />
                        </button>
                      </div>

                      <p className="font-semibold text-gray-900 tabular-nums">
                        ₹{lineTotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          {/* Order summary */}
          <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>

            <div className="mt-6 flex items-center justify-between border-b border-gray-100 pb-4">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-lg font-semibold text-gray-900 tabular-nums">
                ₹{cartTotal.toFixed(2)}
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
              onClick={() => navigate("/checkout")}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3.5 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 hover:shadow-md active:scale-[0.98]"
            >
              Proceed to Checkout
            </button>

            <Link
              to="/"
              className="mt-3 flex items-center justify-center gap-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-emerald-600"
            >
              <FiArrowLeft className="text-sm" />
              Continue Shopping
            </Link>
          </aside>
        </div>
      </div>


    </main>
  );
};

export default Cart;