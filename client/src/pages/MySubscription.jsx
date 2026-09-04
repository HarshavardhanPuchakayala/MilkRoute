import { useEffect, useState } from "react";
import {
  getMySubscription,
  pauseSubscription,
  resumeSubscription,
  cancelSubscription,
} from "../api/subscriptions.js";
import {
  FiPause,
  FiPlay,
  FiXCircle,
  FiRepeat,
  FiCalendar,
  FiTruck,
  FiTag,
  FiPackage,
} from "react-icons/fi";

const MySubscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadSubscription = async () => {
    try {
      setLoading(true);

      const data = await getMySubscription();

      setSubscription(data.subscription || null);
    } catch (error) {
      console.error("Failed to load subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscription();
  }, []);

  const handlePause = async () => {
    if (!subscription) return;

    try {
      setActionLoading(true);

      await pauseSubscription(subscription._id);

      alert("Subscription paused");

      await loadSubscription();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to pause subscription");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResume = async () => {
    if (!subscription) return;

    try {
      setActionLoading(true);

      await resumeSubscription(subscription._id);

      alert("Subscription resumed");

      await loadSubscription();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to resume subscription");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!subscription) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel your subscription?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      await cancelSubscription(subscription._id);

      alert("Subscription cancelled");

      await loadSubscription();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel subscription");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="h-8 w-56 rounded-md bg-gray-100 animate-pulse mb-6" />
        <div className="h-64 rounded-2xl bg-gray-100 animate-pulse" />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="mx-auto max-w-md p-6 text-center py-16">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
          <FiRepeat className="text-2xl" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">No Active Subscription</h1>
        <p className="mt-2 text-gray-500">You don't have a subscription yet.</p>

        <a
          href="/subscription-setup"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 hover:shadow-md active:scale-95"
        >
          Start Subscription
        </a>
      </div>
    );
  }

  const statusClasses = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    paused: "bg-amber-50 text-amber-700 border-amber-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className="mx-auto max-w-3xl p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Subscription</h1>
      </div>

      <div className="rounded-2xl bg-white p-5 md:p-6 shadow-sm animate-[fadeUp_0.4s_ease-out]">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <FiPackage className="text-lg" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {subscription.plan?.name || "Subscription"}
            </h2>
          </div>

          <span
            className={`rounded-full border px-3 py-1 text-sm font-medium capitalize ${
              statusClasses[subscription.status] || "bg-gray-100 text-gray-600 border-gray-200"
            }`}
          >
            {subscription.status}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Info icon={FiPackage} label="Quantity" value={subscription.quantity} />
          <Info icon={FiRepeat} label="Frequency" value={subscription.frequency} />
          <Info icon={FiCalendar} label="Delivery Day" value={subscription.deliveryDay} />
          <Info icon={FiCalendar} label="Start Date" value={formatDate(subscription.startDate)} />

          {subscription.nextDeliveryDate && (
            <Info
              icon={FiTruck}
              label="Next Delivery"
              value={formatDate(subscription.nextDeliveryDate)}
            />
          )}

          {subscription.price !== undefined && (
            <Info icon={FiTag} label="Price" value={`₹${subscription.price}`} />
          )}
        </div>

        {subscription.status !== "cancelled" && (
          <div className="mt-8 flex flex-wrap gap-3">
            {subscription.status === "active" && (
              <button
                type="button"
                onClick={handlePause}
                disabled={actionLoading}
                className="flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                <FiPause /> Pause
              </button>
            )}

            {subscription.status === "paused" && (
              <button
                type="button"
                onClick={handleResume}
                disabled={actionLoading}
                className="flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 disabled:opacity-50"
              >
                <FiPlay /> Resume
              </button>
            )}

            <button
              type="button"
              onClick={handleCancel}
              disabled={actionLoading}
              className="flex items-center gap-2 rounded-full bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
            >
              <FiXCircle /> Cancel Subscription
            </button>
          </div>
        )}
      </div>

 </div>
  );
};

const Info = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-3.5">
    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
      <Icon className="text-sm" />
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium mt-0.5 capitalize text-gray-900">{value || "-"}</p>
    </div>
  </div>
);

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default MySubscription;