import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSubscriptionPlans, createSubscription } from "../api/subscriptions.js";
import { FiCheck, FiRepeat } from "react-icons/fi";

const SubscriptionSetup = () => {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    planId: "",
    quantity: 1,
    frequency: "weekly",
    deliveryDay: "monday",
    startDate: "",
  });

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const data = await getSubscriptionPlans();
        setPlans(data.plans || []);

        if (data.plans?.length > 0) {
          setForm((prev) => ({
            ...prev,
            planId: data.plans[0]._id,
          }));
        }
      } catch (error) {
        console.error("Failed to load subscription plans:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await createSubscription({
        ...form,
        quantity: Number(form.quantity),
      });

      alert("Subscription created successfully!");

      navigate("/my-subscription");
    } catch (error) {
      console.error("Create subscription error:", error);

      alert(error.response?.data?.message || "Failed to create subscription");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="h-8 w-64 rounded-md bg-gray-100 animate-pulse mb-6" />
        <div className="h-96 rounded-2xl bg-gray-100 animate-pulse" />
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

  return (
    <div className="mx-auto max-w-3xl p-4 md:p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <FiRepeat className="text-lg" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Start a Subscription
          </h1>
          <p className="text-gray-500 mt-0.5 text-sm">
            Get your favorite dairy products delivered regularly.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-7 rounded-2xl bg-white p-5 md:p-6 shadow-sm animate-[fadeUp_0.4s_ease-out]"
      >
        {/* Plan */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Choose Plan
          </label>

          {plans.length === 0 ? (
            <p className="text-gray-500 text-sm">No subscription plans available.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {plans.map((plan) => {
                const selected = form.planId === plan._id;

                return (
                  <label
                    key={plan._id}
                    className={`relative cursor-pointer rounded-2xl border-2 p-4 transition-all duration-200 ${
                      selected
                        ? "border-emerald-500 bg-emerald-50/60 shadow-sm"
                        : "border-gray-200 hover:border-emerald-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="planId"
                      value={plan._id}
                      checked={selected}
                      onChange={handleChange}
                      className="sr-only"
                    />

                    {selected && (
                      <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                        <FiCheck className="text-xs" />
                      </span>
                    )}

                    <h3 className="font-semibold text-gray-900 pr-6">{plan.name}</h3>

                    {plan.description && (
                      <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                    )}

                    {plan.price !== undefined && (
                      <p className="font-bold mt-2 text-emerald-600 tabular-nums">
                        ₹{plan.price}
                      </p>
                    )}
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Quantity</label>

          <input
            type="number"
            name="quantity"
            min="1"
            value={form.quantity}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        {/* Frequency */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Delivery Frequency
          </label>

          <select
            name="frequency"
            value={form.frequency}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {/* Delivery day */}
        {form.frequency === "weekly" && (
          <div className="animate-[fadeUp_0.3s_ease-out]">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Delivery Day
            </label>

            <select
              name="deliveryDay"
              value={form.deliveryDay}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="monday">Monday</option>
              <option value="tuesday">Tuesday</option>
              <option value="wednesday">Wednesday</option>
              <option value="thursday">Thursday</option>
              <option value="friday">Friday</option>
              <option value="saturday">Saturday</option>
              <option value="sunday">Sunday</option>
            </select>
          </div>
        )}

        {/* Start date */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Start Date</label>

          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            className={inputClass}
            required
          />
        </div>

        <button
          type="submit"
          disabled={saving || plans.length === 0}
          className="w-full rounded-full bg-emerald-600 py-3.5 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 hover:shadow-md active:scale-[0.98] disabled:opacity-50"
        >
          {saving ? "Creating..." : "Start Subscription"}
        </button>
      </form>


    </div>
  );
};

export default SubscriptionSetup;