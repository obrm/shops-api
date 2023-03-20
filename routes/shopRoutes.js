import express from 'express';
import {
  getShops,
  createShop,
  getShop,
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
  .delete(deleteShop);

export default router;