import asyncHandler from '../middleware/asyncHandler.js';
import Shop from '../models/Shop.js';

// @desc    Get all Shops
// @route   GET /api/v1/shops
// @access  Public
export const getShops = asyncHandler(async (req, res, next) => {
  const shop = await Shop.find({});
  res.status(200).json({
    success: true,
    data: shop,
  });
});

// @desc    Create a Shop
// @route   POST /api/v1/shops
// @access  Private
export const createShop = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const shop = await Shop.create(req.body);

  res.status(200).json({
    success: true,
    data: shop,
  });
});

// @desc    Get a single Shop
// @route   GET /api/v1/shops/:id
// @access  Public
export const getShop = asyncHandler(async (req, res, next) => {
  const shop = await Shop.findById(req.params.id);

  if (!shop) {
    return next(new Error(`Bootcamp with id: ${req.params.id} not found`));
  }

  res.status(200).json({
    success: true,
    data: shop,
  });
});

// @desc    Update a Shop
// @route   PUT /api/v1/shops/:id
// @access  Private
export const updateShop = asyncHandler(async (req, res, next) => {
  const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!shop) {
    return next(new Error(`Bootcamp with id: ${req.params.id} not found`));
  }

  res.status(200).json({
    success: true,
    data: shop,
  });
});



