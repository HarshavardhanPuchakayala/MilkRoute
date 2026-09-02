import { useEffect, useState } from "react";
import {
  createProduct,
  deleteProduct,
  getAdminProducts,
  updateProduct,
} from "../api/products";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stockQuantity: "",
  imageFile: null,
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminProducts();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;

    setForm((current) => ({
      ...current,
      imageFile: file,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingId) {
        await updateProduct(editingId, form);
        setSuccess("Product updated successfully.");
      } else {
        await createProduct(form);
        setSuccess("Product created successfully.");
      }

      resetForm();
      await fetchProducts();
    } catch (error) {
      console.error("Failed to save product:", error);

      setError(
        error.response?.data?.message ||
          "Failed to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      stockQuantity: product.stockQuantity ?? "",
      imageFile: null,
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(productId);
      setError("");
      setSuccess("");

      await deleteProduct(productId);

      setProducts((current) =>
        current.filter((product) => product._id !== productId)
      );

      if (editingId === productId) {
        resetForm();
      }

      setSuccess("Product deleted successfully.");
    } catch (error) {
      console.error("Failed to delete product:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete product."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-gray-600">
            Loading products...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">

        <div className="mb-6 flex items-center justify-between">
  <h1 className="text-2xl font-bold text-gray-900">
    Admin Products
  </h1>

  <Link
    to="/admin/orders"
    className="text-sm font-medium text-green-600 hover:text-green-700"
  >
    View All Orders
  </Link>
</div>

      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Product Management
          </h1>

          <p className="mt-1 text-gray-600">
            Create, edit, and manage your products.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
            {success}
          </div>
        )}

        {/* Product form */}
        <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {editingId ? "Edit Product" : "Add Product"}
            </h2>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Price
                </label>

                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label
                  htmlFor="stockQuantity"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Stock Quantity
                </label>

                <input
                  id="stockQuantity"
                  name="stockQuantity"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stockQuantity}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label
                  htmlFor="imageFile"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Product Image
                </label>

                <input
                  id="imageFile"
                  name="imageFile"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm"
                />

                {editingId && (
                  <p className="mt-1 text-xs text-gray-500">
                    Leave empty to keep the current image.
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows="4"
                value={form.description}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Product"
                : "Create Product"}
            </button>
          </form>
        </section>

        {/* Product list */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            All Products
          </h2>

          {products.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <p className="text-gray-600">
                No products found.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => {
                const isActive = product.isActive;
                const isOutOfStock = product.stockQuantity <= 0;

                return (
                  <article
                    key={product._id}
                    className="overflow-hidden rounded-2xl bg-white shadow-sm"
                  >
                    <div className="h-48 bg-gray-100">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-gray-500">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-bold text-gray-900">
                          {product.name}
                        </h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                        {product.description}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="font-semibold text-gray-900">
                          ₹{Number(product.price).toFixed(2)}
                        </span>

                        <span
                          className={`text-sm font-medium ${
                            isOutOfStock
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          Stock: {product.stockQuantity}
                        </span>
                      </div>

                      <div className="mt-5 flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleEdit(product)}
                          className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(product._id)}
                          disabled={deletingId === product._id}
                          className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingId === product._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default AdminProducts;