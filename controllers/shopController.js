import Shop from '../models/Shop.js';

// @desc    Get all Shops
// @route   GET /api/v1/shops
// @access  Public
export const getShops = async (req, res, next) => {
  try {
    const shop = await Shop.find({});
    res.status(200).json({
      success: true,
      data: shop,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Create a Shop
// @route   POST /api/v1/shops
// @access  Private
export const createShop = async (req, res, next) => {
  try {
    const shop = await Shop.create(req.body);

    res.status(200).json({
      success: true,
      data: shop,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

