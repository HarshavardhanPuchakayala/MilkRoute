import crypto from "node:crypto";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

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