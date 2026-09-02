import api from "./axios";

export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

export const getAdminProducts = async () => {
  const response = await api.get("/products/admin");
  return response.data;
};

export const createProduct = async (productData) => {
  const formData = new FormData();

  formData.append("name", productData.name);
  formData.append("description", productData.description);
  formData.append("price", productData.price);
  formData.append("stockQuantity", productData.stockQuantity);

  if (productData.image) {
    formData.append("image", productData.image);
  }

  const response = await api.post("/products", formData);

  return response.data;
};

export const updateProduct = async (id, productData) => {
  const formData = new FormData();

  formData.append("name", productData.name);
  formData.append("description", productData.description);
  formData.append("price", productData.price);
  formData.append("stockQuantity", productData.stockQuantity);

  if (productData.image) {
    formData.append("image", productData.image);
  }

  const response = await api.put(`/products/${id}`, formData);

  return response.data;
};


export const deleteProduct = async (productId) => {
  const response = await api.delete(`/products/${productId}`);
  return response.data;
};