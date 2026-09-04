import Product from "../models/Product.js";
import Subscription from "../models/Subscription.js";
import razorpay from "../config/razorpay.js";

export const createSubscription = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findOne({
      _id: productId,
      isActive: true,
      isSubscribable: true, // <-- enforce backend-side, don't trust the frontend filter
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or unavailable",
      });
    }

    let planId = product.razorpayPlanId;

    if (!planId) {
      const plan = await razorpay.plans.create({
        period: "daily",
        interval: 1,
        item: {
          name: product.name,
          amount: Math.round(product.price * 100),
          currency: "INR",
        },
      });

      planId = plan.id;

      product.razorpayPlanId = planId;
      await product.save();
    }

    const razorpaySubscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 365,
    });

    const subscription = await Subscription.create({
      userId: req.user._id,
      productId: product._id,
      productName: product.name,
      unitPrice: product.price,
      startDate: new Date(),
      razorpaySubscriptionId: razorpaySubscription.id,
      razorpayPlanId: planId,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      subscription,
      razorpaySubscriptionId: razorpaySubscription.id,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create subscription error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create subscription",
    });
  }
};

export const pauseSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ success: false, message: "Subscription not found" });
    }

    if (subscription.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const liveSubscription = await razorpay.subscriptions.fetch(
      subscription.razorpaySubscriptionId
    );

    if (liveSubscription.status !== "active") {
      return res.status(400).json({
        success: false,
        message: `Cannot pause a subscription in "${liveSubscription.status}" state`,
      });
    }

    const result = await razorpay.subscriptions.pause(
      subscription.razorpaySubscriptionId,
      { pause_at: "now" }
    );

    if (result.status !== "paused") {
      console.error(
        `Unexpected pause result for ${subscription.razorpaySubscriptionId}: got status "${result.status}"`
      );
    }

    return res.status(200).json({
      success: true,
      message: "Pause requested",
    });
  } catch (error) {
    console.error("Error pausing subscription:", error);
    return res.status(500).json({ success: false, message: "Failed to pause subscription" });
  }
};

export const resumeSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    if (subscription.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const liveSubscription = await razorpay.subscriptions.fetch(
      subscription.razorpaySubscriptionId
    );

    if (liveSubscription.status !== "paused") {
      return res.status(400).json({
        success: false,
        message: `Cannot resume a subscription in "${liveSubscription.status}" state`,
      });
    }

    const result = await razorpay.subscriptions.resume(
      subscription.razorpaySubscriptionId,
      { resume_at: "now" }
    );

    if (result.status !== "active") {
      console.error(
        `Unexpected resume result for ${subscription.razorpaySubscriptionId}: got status "${result.status}"`
      );
    }

    return res.status(200).json({
      success: true,
      message: "Resume requested",
    });
  } catch (error) {
    console.error("Error resuming subscription:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to resume subscription",
    });
  }
};