import express from 'express';
import {
  getShops,
  createShop,
  getShop,
  updateShop,
  deleteShop
} from '../controllers/shopsController.js';

import advancedResults from '../middleware/advancedResults.js';

import Shop from '../models/Shop.js';

import productsRouter from './productsRoutes.js';

// Include other resource routers
const router = express.Router();

// Re-route into other resource routers
router
  .use('/:shopId/products', productsRouter);

router
  .route('/')
  .get(advancedResults(Shop, 'products'), getShops)
  .post(createShop);

router
  .route('/:id')
  .get(getShop)
  .put(updateShop)
  .delete(deleteShop);

export default router;