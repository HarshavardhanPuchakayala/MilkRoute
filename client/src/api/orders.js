import api from "./axios";

export const createOrder = async (items) => {
  const response = await api.post("/orders", { items });
  return response.data;
};