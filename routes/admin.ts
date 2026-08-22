import express from 'express';
import path from 'path';
import { rootDir } from '../util/path';
import { getAddProduct as getAddProductController, postAddProduct as postAddProductController } from '../controller/products';

const router = express.Router();
//admin/add-product => GET
router.get('/add-product', getAddProductController);

//admin/add-product => POST
router.post('/add-product', postAddProductController);

export default router;