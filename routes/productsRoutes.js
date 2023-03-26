import express from 'express';
import {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productsController.js';

import Product from '../models/Product.js';
import advancedResults from '../middleware/advancedResults.js';
import { protect, authorize } from './../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(advancedResults(Product, {
    path: 'shop',
    select: 'name description'
  }), getProducts)
  .post(protect, authorize('admin', 'shop-owner'), addProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin', 'shop-owner'), updateProduct)
  .delete(protect, authorize('admin', 'shop-owner'), deleteProduct);

export default router;