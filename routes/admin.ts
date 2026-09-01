import express from 'express';
import path from 'path';
import { rootDir } from '../util/path';
import { adminProductsController, getAddProduct as getAddProductController, getEditProduct, postAddProduct as postAddProductController, postDeleteProduct, postEditProduct } from '../controller/admin';

const router = express.Router();
//admin/add-product => GET
router.get('/add-product', getAddProductController);

router.get('/products', adminProductsController);

//admin/add-product => POST
router.post('/add-product', postAddProductController);

router.get('/edit-product/:productId', getEditProduct);

router.post('/edit-product', postEditProduct);

router.post('/delete-product', postDeleteProduct);

export default router;