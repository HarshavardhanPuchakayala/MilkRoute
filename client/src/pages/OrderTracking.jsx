import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../context/SocketContext.jsx";
import api from "../api/axios.js";
import { FiCheck, FiMapPin, FiUser, FiClock, FiTruck } from "react-icons/fi";

const OrderTracking = () => {
  const { orderId } = useParams();
  const { socket, connected } = useSocket();

  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const response = await api.get(`/orders/${orderId}`);

        setOrder(response.data.order);
        setTracking(response.data.order?.tracking || null);
      } catch (error) {
        console.error("Failed to load order:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  useEffect(() => {
    if (!socket || !orderId) return;

    socket.emit("joinOrder", orderId);

    const handleTrackingUpdate = (data) => {
      if (data.orderId !== orderId) return;

      setTracking((prev) => ({
        ...prev,
        ...data,
      }));

      setOrder((prev) => ({
        ...prev,
        status: data.status || prev?.status,
      }));
    };

    socket.on("orderTrackingUpdate", handleTrackingUpdate);

    return () => {
      socket.emit("leaveOrder", orderId);
      socket.off("orderTrackingUpdate", handleTrackingUpdate);
    };
  }, [socket, orderId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="h-8 w-56 rounded-md bg-gray-100 animate-pulse mb-6" />
        <div className="h-80 rounded-2xl bg-gray-100 animate-pulse" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-md p-6 text-center py-16">
        <h1 className="text-xl font-semibold text-gray-900">Order not found</h1>
      </div>
    );
  }

  const steps = [
    {
      label: "Order Confirmed",
      active: ["confirmed", "processing", "out_for_delivery", "delivered"].includes(order.status),
    },
    {
      label: "Preparing",
      active: ["processing", "out_for_delivery", "delivered"].includes(order.status),
    },
    {
      label: "Out for Delivery",
      active: ["out_for_delivery", "delivered"].includes(order.status),
    },
    {
      label: "Delivered",
      active: order.status === "delivered",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Track Your Order</h1>
        <p className="text-gray-500 mt-1">Order #{order._id}</p>
      </div>

      <div className="rounded-2xl bg-white p-5 md:p-6 shadow-sm animate-[fadeUp_0.4s_ease-out]">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Order Status</p>

            <h2 className="text-xl font-semibold capitalize mt-1 text-gray-900">
              {order.status?.replaceAll("_", " ")}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                connected ? "bg-emerald-500 animate-pulse" : "bg-gray-300"
              }`}
              title={connected ? "Live tracking connected" : "Live tracking disconnected"}
            />
            <span className="text-xs text-gray-500">
              {connected ? "Live" : "Offline"}
            </span>
          </div>
        </div>

        <div className="mt-8">
          {steps.map((step, index) => (
            <TrackingStep
              key={step.label}
              label={step.label}
              active={step.active}
              last={index === steps.length - 1}
            />
          ))}
        </div>

        {tracking && (
          <div className="mt-8 border-t border-gray-100 pt-5 space-y-2.5">
            <h3 className="font-semibold text-gray-900 mb-1">Delivery Details</h3>

            {tracking.driverName && (
              <p className="flex items-center gap-2 text-sm text-gray-600">
                <FiUser className="text-emerald-500" /> Driver: {tracking.driverName}
              </p>
            )}

            {tracking.estimatedDelivery && (
              <p className="flex items-center gap-2 text-sm text-gray-600">
                <FiClock className="text-emerald-500" />
                Estimated delivery:{" "}
                {new Date(tracking.estimatedDelivery).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}

            {tracking.latitude && tracking.longitude && (
              <p className="flex items-center gap-2 text-sm text-gray-600">
                <FiMapPin className="text-emerald-500" /> Live location available
              </p>
            )}
          </div>
        )}
      </div>

  </div>
  );
};

const TrackingStep = ({ label, active, last }) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300 ${
          active ? "bg-emerald-500 text-white scale-100" : "bg-gray-200 text-transparent scale-90"
        }`}
      >
        {active ? <FiCheck className="text-xs" /> : <FiTruck className="text-xs" />}
      </div>

      {!last && (
        <div
          className={`w-0.5 h-12 transition-colors duration-500 ${
            active ? "bg-emerald-400" : "bg-gray-200"
          }`}
        />
      )}
    </div>

    <div className="pb-8">
      <p className={`font-medium ${active ? "text-emerald-600" : "text-gray-400"}`}>{label}</p>
    </div>
  </div>
);

export default OrderTracking;