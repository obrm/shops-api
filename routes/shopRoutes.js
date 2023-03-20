import express from 'express';
import {
  getShops,
  createShop
} from '../controllers/shopController.js';

const router = express.Router();

router
  .route('/')
  .get(getShops)
  .post(createShop);

export default router;