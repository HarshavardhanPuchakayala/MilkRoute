
import mongoose from "mongoose";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    session.startTransaction();

    const orderItems = [];
    let totalAmount = 0;

    for (const { productId, quantity } of items) {
      if (!productId || !quantity || quantity < 1) {
        throw new Error(
          "Each item needs a valid productId and quantity"
        );
      }

      // Atomic stock check + decrement.
      const product = await Product.findOneAndUpdate(
        {
          _id: productId,
          isActive: true,
          stockQuantity: { $gte: quantity },
        },
        {
          $inc: {
            stockQuantity: -quantity,
          },
        },
        {
          new: true,
          session,
        }
      );

      if (!product) {
        throw new Error(
          `Product ${productId} is unavailable or doesn't have enough stock`
        );
      }

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity,
      });

      totalAmount += product.price * quantity;
    }

    const [order] = await Order.create(
      [
        {
          userId: req.user._id,
          items: orderItems,
          totalAmount,
          status: "pending",
        },
      ],
      {
        session,
      }
    );

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    await session.abortTransaction();

    console.error("Create order error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  } finally {
    await session.endSession();
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get my orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get all orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};