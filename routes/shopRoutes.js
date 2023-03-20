import express from 'express';
import {
  getShops,
  createShop,
  getShop,
  updateShop,
  deleteShop
} from '../controllers/shopController.js';
import advancedResults from '../middleware/advancedResults.js';
import Shop from '../models/Shop.js';

const router = express.Router();

router
  .route('/')
  .get(advancedResults(Shop), getShops)
  .post(createShop);

router
  .route('/:id')
  .get(getShop)
  .put(updateShop)
  .delete(deleteShop);

export default router;