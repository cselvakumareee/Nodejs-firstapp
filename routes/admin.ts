import express from 'express';
import path from 'path';
import { rootDir } from '../util/path';

const router = express.Router();
const products: { title: string }[] = [];
//admin/add-product => GET
router.get('/add-product',(req, res, next) => {
  console.log('middleware 2');
  res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

//admin/add-product => POST
router.post('/product',(req, res, next) => {
  console.log('body', req.body);
  products.push({title: req.body.title});
  res.redirect('/');
});
export { products };
export default router;