import mongoose from "mongoose";

const subscriptionDeliverySchema = new mongoose.Schema(
  {
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    deliveryDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["delivered", "skipped"],
      default: "delivered",
    },
  },
  {
    timestamps: true,
  }
);

// One delivery record per subscription per calendar day.
subscriptionDeliverySchema.index(
  { subscriptionId: 1, deliveryDate: 1 },
  { unique: true }
);

export default mongoose.model(
  "SubscriptionDelivery",
  subscriptionDeliverySchema
);