import path from "path";
import { rootDir } from "../util/path";
import { getProductsFromFile, product } from "../models/product";

export const getAddProduct = (req: any, res: any, next: any) => {
  console.log('middleware 2');
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: req.path,
    formCss: true,
    productCSS: true,
    activeAddProduct: true
  });
};

export const postAddProduct = (req: any, res: any, next: any) => {
  console.log('body', req.body);
  product({ title: req.body.title });
  res.redirect('/');
};

export const getProducts = (req: any, res: any, next: any) => {
  const prods = getProductsFromFile();

  res.render('shop/product-list', {
    prods,
    pageTitle: 'Shop',
    path: req.path,
    hasProducts: prods.length > 0,
    activeShop: true,
    productCSS: true
  });
};
