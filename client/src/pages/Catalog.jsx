import { useEffect, useState } from "react";
import { getProducts } from "../api/products";

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

    console.log("Add to cart:", {
      productId: product._id,
      quantity,
    });
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return (
      <div>
        <h2>Unable to load products</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div>
        <h2>No products available</h2>
        <p>Check back soon for new products.</p>
      </div>
    );
  }

  return (
    <main>
      <h1>Products</h1>

      <div>
        {products.map((product) => {
          const isOutOfStock = product.stockQuantity <= 0;
          const quantity = quantities[product._id] || 1;

          return (
            <article key={product._id}>
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                />
              ) : (
                <div>No image available</div>
              )}

              <h2>{product.name}</h2>

              <p>{product.description}</p>

              <p>₹{Number(product.price).toFixed(2)}</p>

              {isOutOfStock ? (
                <p>Out of stock</p>
              ) : (
                <p>In stock: {product.stockQuantity}</p>
              )}

              <label>
                Quantity:
                <select
                  value={quantity}
                  onChange={(event) =>
                    handleQuantityChange(
                      product._id,
                      event.target.value
                    )
                  }
                  disabled={isOutOfStock}
                >
                  {Array.from(
                    {
                      length: Math.min(product.stockQuantity, 10),
                    },
                    (_, index) => index + 1
                  ).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                disabled={isOutOfStock}
                onClick={() => handleAddToCart(product)}
              >
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
            </article>
          );
        })}
      </div>
    </main>
  );
};

export default Catalog;