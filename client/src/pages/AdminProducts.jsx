import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  createProduct,
  deleteProduct,
  getAdminProducts,
  updateProduct,
} from "../api/products";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiUpload,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRight,
  FiImage,
} from "react-icons/fi";

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
  const [imagePreview, setImagePreview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ========================================
  // Fetch Products
  // ========================================

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

  // ========================================
  // Handle Text Input
  // ========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // ========================================
  // Handle Image
  // ========================================

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;

    if (!file) {
      setForm((current) => ({
        ...current,
        imageFile: null,
      }));

      setImagePreview(null);
      return;
    }

    // Validate image type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG, and WebP images are allowed.");

      event.target.value = "";

      setForm((current) => ({
        ...current,
        imageFile: null,
      }));

      setImagePreview(null);

      return;
    }

    // Validate image size - 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");

      event.target.value = "";

      setForm((current) => ({
        ...current,
        imageFile: null,
      }));

      setImagePreview(null);

      return;
    }

    setError("");

    setForm((current) => ({
      ...current,
      imageFile: file,
    }));

    const reader = new FileReader();

    reader.onload = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // ========================================
  // Reset Form
  // ========================================

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setImagePreview(null);

    const fileInput = document.getElementById("imageFile");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // ========================================
  // Create / Update Product
  // ========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      // Image is required when creating
      if (!editingId && !form.imageFile) {
        setError("Please select a product image.");
        setSaving(false);
        return;
      }

      /*
       * IMPORTANT
       *
       * React state uses:
       * form.imageFile
       *
       * products.js expects:
       * productData.image
       *
       * Therefore we convert imageFile -> image here.
       */
      const productData = {
        name: form.name,
        description: form.description,
        price: form.price,
        stockQuantity: form.stockQuantity,
        image: form.imageFile,
      };


      if (editingId) {
        await updateProduct(editingId, productData);

        setSuccess("Product updated successfully.");
      } else {
        await createProduct(productData);

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

  // ========================================
  // Edit Product
  // ========================================

  const handleEdit = (product) => {
    setEditingId(product._id);

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      stockQuantity: product.stockQuantity ?? "",
      imageFile: null,
    });

    setImagePreview(product.imageUrl || null);

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ========================================
  // Delete Product
  // ========================================

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
        current.filter(
          (product) => product._id !== productId
        )
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

  // ========================================
  // Loading State
  // ========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 h-8 w-64 animate-pulse rounded-md bg-gray-100" />

          <div className="mb-8 h-72 animate-pulse rounded-2xl border border-gray-100 bg-white" />

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-2xl bg-gray-100"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

  // ========================================
  // UI
  // ========================================

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Product Management
            </h1>

            <p className="mt-1 text-gray-600">
              Create, edit, and manage your products.
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            View All Orders
            <FiArrowRight className="text-xs" />
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <FiAlertCircle className="mt-0.5 shrink-0" />

            <span>{error}</span>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
            <FiCheckCircle className="mt-0.5 shrink-0" />

            <span>{success}</span>
          </div>
        )}

        {/* ========================================
            Product Form
        ======================================== */}

        <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {editingId ? "Edit Product" : "Add Product"}
            </h2>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                <FiX className="text-sm" />

                Cancel Edit
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="grid gap-5 md:grid-cols-[200px_1fr]">

              {/* Image Upload */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Product Image
                </label>

                <label
                  htmlFor="imageFile"
                  className="group relative flex h-40 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 transition-colors hover:border-emerald-400 hover:bg-emerald-50/40"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <FiImage className="mb-1.5 text-2xl" />

                      <span className="text-xs">
                        Click to upload
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-all duration-200 group-hover:bg-black/30 group-hover:opacity-100">
                    <FiUpload className="text-xl" />
                  </div>
                </label>

                <input
                  id="imageFile"
                  name="imageFile"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {editingId && (
                  <p className="mt-1.5 text-xs text-gray-500">
                    Leave empty to keep the current image.
                  </p>
                )}
              </div>

              {/* Product Details */}
              <div className="grid gap-5 sm:grid-cols-2">

                {/* Name */}
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
                    className={inputClass}
                    placeholder="Fresh Cow Milk"
                  />
                </div>

                {/* Price */}
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
                    className={inputClass}
                    placeholder="60"
                  />
                </div>

                {/* Stock */}
                <div className="sm:col-span-2">
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
                    className={inputClass}
                    placeholder="100"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
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
                className={inputClass}
                placeholder="Enter product description..."
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}

              {!saving && !editingId && (
                <FiPlus />
              )}

              {saving
                ? "Saving..."
                : editingId
                ? "Update Product"
                : "Create Product"}
            </button>
          </form>
        </section>

        {/* ========================================
            Product List
        ======================================== */}

        <section>
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            All Products
          </h2>

          {products.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <p className="text-gray-600">
                No products found.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product, index) => {
                const isActive = product.isActive;

                const isOutOfStock =
                  Number(product.stockQuantity) <= 0;

                return (
                  <article
                    key={product._id}
                    style={{
                      animationDelay: `${index * 60}ms`,
                    }}
                    className="overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    {/* Product Image */}
                    <div className="h-48 bg-gray-100">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-gray-500">
                          <div className="flex flex-col items-center gap-2">
                            <FiImage className="text-2xl" />

                            <span>No image</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Product Content */}
                    <div className="p-5">

                      {/* Name + Status */}
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-bold text-gray-900">
                          {product.name}
                        </h3>

                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            isActive
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                        {product.description}
                      </p>

                      {/* Price + Stock */}
                      <div className="mt-4 flex items-center justify-between">
                        <span className="font-semibold text-gray-900 tabular-nums">
                          ₹
                          {Number(product.price).toFixed(
                            2
                          )}
                        </span>

                        <span
                          className={`text-sm font-medium tabular-nums ${
                            isOutOfStock
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          Stock:{" "}
                          {product.stockQuantity}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="mt-5 flex gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(product)
                          }
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          <FiEdit2 className="text-xs" />

                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(product._id)
                          }
                          disabled={
                            deletingId === product._id
                          }
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <FiTrash2 className="text-xs" />

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