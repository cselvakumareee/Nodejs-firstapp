import express from "express";
import path from 'path';
import { rootDir } from "../util/path";
import { products } from "./admin";

const router = express.Router();
router.get('/', (req, res, next) => {
  console.log('products', products);
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
  res.render('shop', {prods: products, docTitle: 'Shop'});
});

export default router;