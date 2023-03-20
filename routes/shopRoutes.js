import express from 'express';
import {
  getShops,
  createShop,
  getShop
} from '../controllers/shopController.js';

const router = express.Router();

router
  .route('/')
  .get(getShops)
  .post(createShop);

router
  .route('/:id')
  .get(getShop);

export default router;