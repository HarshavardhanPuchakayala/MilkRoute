import { useEffect, useState } from "react";
import { getProducts } from "../api/products";
import { useCart } from "../context/CartContext";
import BannerCarousel from "../components/BannerCarousel";
import {
  FiShoppingCart,
  FiPlus,
  FiMinus,
  FiAlertCircle,
  FiPackage,
} from "react-icons/fi";

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [justAdded, setJustAdded] = useState(null);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();
        setProducts(data.products || []);

        const initialQuantities = {};

        (data.products || []).forEach((product) => {
          initialQuantities[product._id] = 1;
        });

        setQuantities(initialQuantities);
      } catch (error) {
        console.error("Failed to fetch products:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load products. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleQuantityChange = (productId, value) => {
    setQuantities((current) => ({
      ...current,
      [productId]: Number(value),
    }));
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product._id] || 1;

    addToCart(product, quantity);
    setJustAdded(product._id);
    setTimeout(() => setJustAdded(null), 700);
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 h-64 md:h-96 rounded-2xl bg-gray-100 animate-pulse" />
        <div className="mb-6 h-7 w-40 rounded-md bg-gray-100 animate-pulse" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-gray-100 bg-white p-3">
              <div className="mb-3 h-32 rounded-xl bg-gray-100 animate-pulse" />
              <div className="mb-2 h-3 w-3/4 rounded bg-gray-100 animate-pulse" />
              <div className="mb-3 h-3 w-1/2 rounded bg-gray-100 animate-pulse" />
              <div className="h-9 w-full rounded-full bg-gray-100 animate-pulse" />
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
        <h2 className="text-lg font-semibold text-gray-900">Unable to load products</h2>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
      </main>
    );
  }

  if (products.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
          <FiPackage className="text-2xl" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">No products available</h2>
        <p className="mt-1 text-sm text-gray-500">Check back soon for new products.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 md:py-8">
      <div className="mb-8">
        <BannerCarousel />
      </div>

      <div className="mb-5 flex items-end justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Products</h1>
        <p className="text-sm text-gray-500">{products.length} items</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {products.map((product, index) => {
          const isOutOfStock = product.stockQuantity <= 0;
          const isLowStock = !isOutOfStock && product.stockQuantity <= 10;
          const maxQty = Math.max(Math.min(product.stockQuantity || 0, 10), 0);
          const quantity = quantities[product._id] || 1;

          return (
            <article
              key={product._id}
              style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-[fadeUp_0.5s_ease-out_backwards]"
            >
              <div className="relative h-32 sm:h-40 overflow-hidden bg-gray-50">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                      isOutOfStock ? "grayscale opacity-60" : ""
                    }`}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                    No image available
                  </div>
                )}

                {isOutOfStock && (
                  <span className="absolute top-2 left-2 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                    Out of stock
                  </span>
                )}

                {isLowStock && (
                  <span className="absolute top-2 left-2 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                    Only {product.stockQuantity} left
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-3">
                <h2 className="text-sm font-semibold text-gray-900 line-clamp-1">
                  {product.name}
                </h2>

                <p className="mt-0.5 text-xs text-gray-500 line-clamp-2 min-h-[2rem]">
                  {product.description}
                </p>

                <p className="mt-1.5 text-base font-bold text-gray-900 tabular-nums">
                  ₹{Number(product.price).toFixed(2)}
                </p>

                {!isOutOfStock && (
                  <div className="mt-2 flex items-center justify-between rounded-full border border-gray-200">
                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(product._id, Math.max(1, quantity - 1))
                      }
                      disabled={quantity <= 1}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-30"
                    >
                      <FiMinus className="text-xs" />
                    </button>

                    <span className="text-xs font-semibold tabular-nums text-gray-800">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(product._id, Math.min(maxQty, quantity + 1))
                      }
                      disabled={quantity >= maxQty}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-30"
                    >
                      <FiPlus className="text-xs" />
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => handleAddToCart(product)}
                  className={`mt-2.5 flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold transition-all duration-200 active:scale-95 ${
                    isOutOfStock
                      ? "cursor-not-allowed bg-gray-100 text-gray-400"
                      : justAdded === product._id
                      ? "bg-emerald-700 text-white"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  <FiShoppingCart className="text-sm" />
                  {isOutOfStock ? "Out of Stock" : justAdded === product._id ? "Added!" : "Add to Cart"}
                </button>
              </div>
            </article>
          );
        })}
      </div>


    </main>
  );
};

export default Catalog;