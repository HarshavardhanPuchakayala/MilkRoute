import api from "./axios.js";

// Get available subscription plans
export const getSubscriptionPlans = async () => {
  const response = await api.get("/subscriptions/plans");
  return response.data;
};

// Create a subscription
export const createSubscription = async (subscriptionData) => {
  const response = await api.post(
    "/subscriptions",
    subscriptionData
  );
  return response.data;
};

// Get current user's subscription
export const getMySubscription = async () => {
  const response = await api.get("/subscriptions/my");
  return response.data;
};

// Update subscription
export const updateSubscription = async (
  subscriptionId,
  subscriptionData
) => {
  const response = await api.put(
    `/subscriptions/${subscriptionId}`,
    subscriptionData
  );
  return response.data;
};

// Pause subscription
export const pauseSubscription = async (subscriptionId) => {
  const response = await api.patch(
    `/subscriptions/${subscriptionId}/pause`
  );
  return response.data;
};

// Resume subscription
export const resumeSubscription = async (subscriptionId) => {
  const response = await api.patch(
    `/subscriptions/${subscriptionId}/resume`
  );
  return response.data;
};

// Cancel subscription
export const cancelSubscription = async (subscriptionId) => {
  const response = await api.patch(
    `/subscriptions/${subscriptionId}/cancel`
  );
  return response.data;
};