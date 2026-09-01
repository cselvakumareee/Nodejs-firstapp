import express from "express";
import path from 'path';
import { rootDir } from "../util/path";
import { checkoutController, getCartController, getIndex, getProduct, getProducts, ordersController, postCartController, postDeleteController } from "../controller/shop";

const router = express.Router();
router.get('/', getIndex);

// router.get('/cart', CartController);

router.post('/cart', postCartController);

router.post('/cart-delete-item', postDeleteController);

router.get('/products', getProducts);

// router.get('/products/delete', getProducts);

router.get('/products/:productId', getProduct);

router.get('/checkout', checkoutController);

router.get('/orders', ordersController);

router.get('/cart', getCartController);

export default router;