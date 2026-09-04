import api from "./axios.js";

// Public banners
export const getBanners = async () => {
  const response = await api.get("/banners");
  return response.data;
};

// Admin - all banners
export const getAdminBanners = async () => {
  const response = await api.get("/banners/admin");
  return response.data;
};

// Admin - create banner
export const createBanner = async (bannerData) => {
  const response = await api.post("/banners", bannerData);
  return response.data;
};

// Admin - update banner
export const updateBanner = async (bannerId, bannerData) => {
  const response = await api.put(`/banners/${bannerId}`, bannerData);
  return response.data;
};

// Admin - delete banner
export const deleteBanner = async (bannerId) => {
  const response = await api.delete(`/banners/${bannerId}`);
  return response.data;
};