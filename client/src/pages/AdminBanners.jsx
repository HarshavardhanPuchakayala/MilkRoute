import { useEffect, useState } from "react";
import {
  getAdminBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "../api/banners.js";
import {
  FiImage,
  FiUpload,
  FiEdit2,
  FiTrash2,
  FiX,
  FiLink,
  FiHash,
} from "react-icons/fi";

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingBanner, setEditingBanner] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    linkUrl: "",
    isActive: true,
    displayOrder: 0,
    image: null,
  });

  const fetchBanners = async () => {
    try {
      setLoading(true);

      const data = await getAdminBanners();
      setBanners(data.banners || []);
    } catch (error) {
      console.error("Failed to fetch banners:", error);
      alert("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0] || null;

      setForm((prev) => ({ ...prev, image: file }));

      if (file) {
        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm({
      title: "",
      subtitle: "",
      linkUrl: "",
      isActive: true,
      displayOrder: 0,
      image: null,
    });

    setEditingBanner(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingBanner && !form.image) {
      alert("Please select a banner image");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("subtitle", form.subtitle);
      formData.append("linkUrl", form.linkUrl);
      formData.append("isActive", form.isActive);
      formData.append("displayOrder", form.displayOrder);

      if (form.image) {
        formData.append("image", form.image);
      }

      if (editingBanner) {
        await updateBanner(editingBanner._id, formData);
        alert("Banner updated successfully");
      } else {
        await createBanner(formData);
        alert("Banner created successfully");
      }

      resetForm();
      await fetchBanners();
    } catch (error) {
      console.error("Save banner error:", error);
      alert(error.response?.data?.message || "Failed to save banner");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);

    setForm({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      linkUrl: banner.linkUrl || "",
      isActive: banner.isActive,
      displayOrder: banner.displayOrder || 0,
      image: null,
    });

    setImagePreview(banner.imageUrl || null);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this banner?");

    if (!confirmed) return;

    try {
      await deleteBanner(id);

      alert("Banner deleted successfully");

      if (editingBanner?._id === id) {
        resetForm();
      }

      await fetchBanners();
    } catch (error) {
      console.error("Delete banner error:", error);
      alert(error.response?.data?.message || "Failed to delete banner");
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 px-3.5 py-2.5 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Banner Management</h1>
        <p className="text-gray-500 mt-1">Create and manage homepage banners.</p>
      </div>

      {/* Create / Edit Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingBanner ? "Edit Banner" : "Create Banner"}
          </h2>

          {editingBanner && (
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              <FiX className="text-sm" /> Cancel
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-[220px_1fr]">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Banner Image
              </label>

              <label
                htmlFor="image"
                className="group relative flex h-32 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 transition-colors hover:border-emerald-400 hover:bg-emerald-50/40"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <FiImage className="mb-1 text-xl" />
                    <span className="text-xs">Click to upload</span>
                  </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-all duration-200 group-hover:bg-black/30 group-hover:opacity-100">
                  <FiUpload />
                </div>
              </label>

              <input
                id="image"
                type="file"
                name="image"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleChange}
                className="hidden"
              />

              {editingBanner && (
                <p className="text-xs text-gray-500 mt-1.5">
                  Leave empty to keep the current image.
                </p>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700">Title</label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="Fresh Milk Delivered Daily"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700">Subtitle</label>

                <textarea
                  name="subtitle"
                  value={form.subtitle}
                  onChange={handleChange}
                  rows="2"
                  className={inputClass}
                  placeholder="Pure and fresh dairy products delivered to your door."
                />
              </div>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium mb-1.5 text-gray-700">
              <FiLink className="text-xs" /> Link URL
            </label>

            <input
              type="text"
              name="linkUrl"
              value={form.linkUrl}
              onChange={handleChange}
              className={inputClass}
              placeholder="/products"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium mb-1.5 text-gray-700">
                <FiHash className="text-xs" /> Display Order
              </label>

              <input
                type="number"
                name="displayOrder"
                value={form.displayOrder}
                onChange={handleChange}
                min="0"
                className={inputClass}
              />
            </div>

            <label className="flex items-center gap-3 md:pt-7 cursor-pointer">
              <span
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  form.isActive ? "bg-emerald-500" : "bg-gray-300"
                }`}
              >
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span
                  className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                    form.isActive ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </span>
              <span className="text-sm font-medium text-gray-700">Active Banner</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold shadow-sm transition-all duration-200 hover:bg-emerald-700 hover:shadow-md active:scale-95 disabled:opacity-50"
            >
              {saving ? "Saving..." : editingBanner ? "Update Banner" : "Create Banner"}
            </button>

            {editingBanner && (
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 rounded-xl border border-gray-200 font-medium transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Banner List */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">All Banners</h2>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-40 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : banners.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center text-gray-500">
            No banners found.
          </div>
        ) : (
          <div className="space-y-4">
            {banners.map((banner, index) => (
              <div
                key={banner._id}
                style={{ animationDelay: `${index * 60}ms` }}
                className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col md:flex-row gap-5 shadow-sm transition-shadow duration-200 hover:shadow-md animate-[fadeUp_0.4s_ease-out_backwards]"
              >
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full md:w-64 h-32 object-cover rounded-xl"
                />

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{banner.title}</h3>

                      {banner.subtitle && (
                        <p className="text-gray-500 text-sm mt-1">{banner.subtitle}</p>
                      )}
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${
                        banner.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {banner.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="text-sm text-gray-500 mt-3 space-y-1">
                    <p>
                      <strong className="text-gray-700">Order:</strong> {banner.displayOrder}
                    </p>

                    {banner.linkUrl && (
                      <p>
                        <strong className="text-gray-700">Link:</strong> {banner.linkUrl}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => handleEdit(banner)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold transition-colors hover:bg-gray-50"
                    >
                      <FiEdit2 className="text-xs" /> Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(banner._id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-semibold transition-colors hover:bg-red-100"
                    >
                      <FiTrash2 className="text-xs" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


    </div>
  );
};

export default AdminBanners;