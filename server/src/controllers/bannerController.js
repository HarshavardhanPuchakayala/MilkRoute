import Banner from "../models/Banner.js";
import { uploadToCloudinary } from "../middleware/upload.js";

export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({
      displayOrder: 1,
    });

    res.status(200).json({
      success: true,
      banners,
    });
  } catch (error) {
    console.error("Get banners error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch banners",
    });
  }
};

export const getAdminBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({
      displayOrder: 1,
    });

    res.status(200).json({
      success: true,
      banners,
    });
  } catch (error) {
    console.error("Get admin banners error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch banners",
    });
  }
};

export const createBanner = async (req, res) => {
  try {
    const { title, subtitle, linkUrl, isActive, displayOrder } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Banner image is required",
      });
    }

    const result = await uploadToCloudinary(req.file.buffer);

    const banner = await Banner.create({
      title,
      subtitle,
      imageUrl: result.secure_url,
      linkUrl,
      isActive,
      displayOrder,
    });

    res.status(201).json({
      success: true,
      banner,
    });
  } catch (error) {
    console.error("Create banner error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create banner",
    });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const { title, subtitle, linkUrl, isActive, displayOrder } = req.body;

    const updates = {
      title,
      subtitle,
      linkUrl,
      isActive,
      displayOrder,
    };

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      updates.imageUrl = result.secure_url;
    }

    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    res.status(200).json({
      success: true,
      banner,
    });
  } catch (error) {
    console.error("Update banner error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update banner",
    });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    console.error("Delete banner error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete banner",
    });
  }
};