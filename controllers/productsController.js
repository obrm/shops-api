import Product from '../models/Product.js';
import Shop from '../models/Shop.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc      Get all products
// @route     GET /api/v1/products
// @route     GET /api/v1/shops/:shopId/products
// @access    Public
export const getProducts = asyncHandler(async (req, res, next) => {
  if (req.params.shopId) {
    const products = await Product.find({ shop: req.params.shopId });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc      Get single product
// @route     GET /api/v1/products/:id
// @route     GET /api/v1/shops/:shopId/products
// @access    Public
export const getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate({
    path: 'shop',
    select: 'name description'
  });

  if (!product) {
    return next(
      new ErrorResponse(`Product that ends with '${req.params.id.slice(-6)}' was not found`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc      Add a product
// @route     POST /api/v1/shop/:shopId/products
// @access    Private
export const addProduct = asyncHandler(async (req, res, next) => {
  req.body.shop = req.params.shopId;

  const shop = await Shop.findById(req.params.shopId);

  if (!shop) {
    return next(
      new ErrorResponse(`Shop that ends with '${req.params.shopId.slice(-6)}' was not found`, 404)
    );
  }

  let product = await Product.create(req.body);

  product = await Product.findById(product._id).populate({
    path: 'shop',
    select: 'name description'
  });

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc      Update a product
// @route     PUT /api/v1/products/:id
// @access    Private
export const updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!product) {
    return next(
      new ErrorResponse(`Product that ends with '${req.params.id.slice(-6)}' was not found`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc      Delete a product
// @route     Delete /api/v1/products/:id
// @access    Private
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product that ends with '${req.params.id.slice(-6)}' was not found`, 404)
    );
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});