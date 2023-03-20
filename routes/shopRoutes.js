import express from 'express';
import {
  getShops,
  createShop,
  getShop,
  updateShop,
  deleteShop
} from '../controllers/shopController.js';

const router = express.Router();

router
  .route('/')
  .get(getShops)
  .post(createShop);

router
  .route('/:id')
  .get(getShop)
  .put(updateShop)
  .delete(deleteShop);

export default router;