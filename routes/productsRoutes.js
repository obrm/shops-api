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

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(advancedResults(Product, {
    path: 'shop',
    select: 'name description'
  }), getProducts)
  .post(addProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

export default router;