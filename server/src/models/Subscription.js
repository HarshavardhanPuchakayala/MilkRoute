import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    startDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "active", "paused", "halted", "cancelled"],
      default: "pending",
    },
    nextBillingDate: {
      type: Date,
      default: null,
    },
    pausedAt: {
      type: Date,
      default: null,
    },

    razorpaySubscriptionId: {
      type: String,
      default: null,
    },

    razorpayPlanId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Subscription", subscriptionSchema);