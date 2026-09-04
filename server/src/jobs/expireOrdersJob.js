import cron from "node-cron";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const expireOrders = async () => {
  try {
    const orders = await Order.find({
      paymentStatus: "pending",
      expiresAt: { $lt: new Date() },
    });

    for (const order of orders) {
      const session = await mongoose.startSession();

      try {
        session.startTransaction();

        // Re-check inside transaction to avoid race conditions
        const currentOrder = await Order.findOne({
          _id: order._id,
          paymentStatus: "pending",
          expiresAt: { $lt: new Date() },
        }).session(session);

        if (!currentOrder) {
          await session.abortTransaction();
          continue;
        }

        for (const item of currentOrder.items) {
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

        currentOrder.paymentStatus = "failed";
        currentOrder.status = "cancelled";

        await currentOrder.save({ session });

        await session.commitTransaction();

        console.log(`Expired order cleaned: ${currentOrder._id}`);
      } catch (error) {
        await session.abortTransaction();
        console.error(`Failed to expire order ${order._id}:`, error);
      } finally {
        await session.endSession();
      }
    }
  } catch (error) {
    console.error("Expire orders job error:", error);
  }
};

// Run every 5 minutes
cron.schedule("*/5 * * * *", expireOrders);

export default expireOrders;