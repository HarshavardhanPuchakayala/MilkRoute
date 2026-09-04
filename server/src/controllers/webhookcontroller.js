import crypto from "node:crypto";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Subscription from "../models/Subscription.js";

export const handleRazorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const body = req.body;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    const event = JSON.parse(req.body.toString());

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;

      const order = await Order.findOne({
        razorpayOrderId: payment.order_id,
      });

      if (order && order.paymentStatus === "pending") {
        order.paymentStatus = "paid";
        order.status = "confirmed";
        order.razorpayPaymentId = payment.id;

        await order.save();
      }
    }

    if (event.event === "payment.failed") {
      const payment = event.payload.payment.entity;

      const session = await mongoose.startSession();

      try {
        session.startTransaction();

        const order = await Order.findOne({
          razorpayOrderId: payment.order_id,
          paymentStatus: "pending",
        }).session(session);

        if (order) {
          for (const item of order.items) {
            await Product.findByIdAndUpdate(
              item.productId,
              {
                $inc: {
                  stockQuantity: item.quantity,
                },
              },
              { session }
            );
          }

          order.paymentStatus = "failed";
          order.status = "cancelled";

          await order.save({ session });
        }

        await session.commitTransaction();
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        await session.endSession();
      }
    }
if (event.event === "subscription.charged") {
  const razorpaySubscription = event.payload.subscription.entity;

  const subscription = await Subscription.findOne({
    razorpaySubscriptionId: razorpaySubscription.id,
  });

  if (!subscription) {
    console.warn(
      `Subscription not found for Razorpay subscription: ${razorpaySubscription.id}`
    );
  } else {
    subscription.nextBillingDate = razorpaySubscription.charge_at
      ? new Date(razorpaySubscription.charge_at * 1000)
      : null;

    await subscription.save();
  }
}

if (event.event === "subscription.halted") {
  const razorpaySubscription = event.payload.subscription.entity;

  const subscription = await Subscription.findOne({
    razorpaySubscriptionId: razorpaySubscription.id,
  });

  if (!subscription) {
    console.warn(
      `Subscription not found for Razorpay subscription: ${razorpaySubscription.id}`
    );
  } else if (subscription.status === "cancelled") {
    console.log(
      `Ignoring halted webhook for already cancelled subscription: ${razorpaySubscription.id}`
    );
  } else {
    subscription.status = "halted";
    subscription.nextBillingDate = null;
    await subscription.save();
  }
}

if (event.event === "subscription.cancelled") {
  const razorpaySubscription = event.payload.subscription.entity;

  const subscription = await Subscription.findOne({
    razorpaySubscriptionId: razorpaySubscription.id,
  });

  if (!subscription) {
    console.warn(
      `Subscription not found for Razorpay subscription: ${razorpaySubscription.id}`
    );
  } else if (subscription.status === "cancelled") {
    console.log(`Subscription already cancelled: ${razorpaySubscription.id}`);
  } else {
    subscription.status = "cancelled";
    subscription.pausedAt = null;
    await subscription.save();
  }
}

    // Subscription activation
    if (event.event === "subscription.activated") {
      const razorpaySubscriptionId =
        event.payload.subscription.entity.id;

      const subscription = await Subscription.findOne({
        razorpaySubscriptionId,
        status: "pending",
      });

      if (subscription) {
        subscription.status = "active";
        await subscription.save();
      }
    }

    return res.status(200).json({
      received: true,
    });
  } catch (error) {
    console.error("Webhook error:", error);

    return res.status(500).json({
      success: false,
    });
  }
};