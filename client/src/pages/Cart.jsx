import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const {
    cart,
    cartTotal,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">
            Your Cart is Empty
          </h1>

          <p className="mt-3 text-gray-600">
            You haven't added any products to your cart yet.
          </p>

          <Link
            to="/"
            className="mt-6 inline-block rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition hover:bg-green-700"
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Your Cart
            </h1>

            <p className="mt-1 text-gray-600">
              Review your items before checkout.
            </p>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="text-sm font-medium text-red-600 hover:text-red-700"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart items */}
          <section className="space-y-4 lg:col-span-2">
            {cart.map((item) => {
              const lineTotal = Number(item.price) * item.quantity;

              return (
                <article
                  key={item.productId}
                  className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm"
                >
                  {/* Image */}
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

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-semibold text-gray-900">
                          {item.name}
                        </h2>

                        <p className="mt-1 text-sm text-gray-600">
                          ₹{Number(item.price).toFixed(2)} each
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId)}
                        className="text-sm font-medium text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        Quantity:

                        <select
                          value={item.quantity}
                          onChange={(event) =>
                            updateQuantity(
                              item.productId,
                              Number(event.target.value)
                            )
                          }
                          className="rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                        >
                          {Array.from(
                            {
                              length: Math.min(item.stockQuantity, 10),
                            },
                            (_, index) => index + 1
                          ).map((quantity) => (
                            <option key={quantity} value={quantity}>
                              {quantity}
                            </option>
                          ))}
                        </select>
                      </label>

                      <p className="font-semibold text-gray-900">
                        ₹{lineTotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          {/* Order summary */}
          <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Order Summary
            </h2>

            <div className="mt-6 flex items-center justify-between border-b border-gray-200 pb-4">
              <span className="text-gray-600">Subtotal</span>

              <span className="text-lg font-semibold text-gray-900">
                ₹{cartTotal.toFixed(2)}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">
                Total
              </span>

              <span className="text-2xl font-bold text-green-600">
                ₹{cartTotal.toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="mt-6 w-full rounded-lg bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              Proceed to Checkout
            </button>

            <Link
              to="/"
              className="mt-3 block text-center text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Continue Shopping
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Cart;