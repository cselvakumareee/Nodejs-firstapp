import { deleteCart } from "../models/cart";
import { deleteProduct, editProduct, getProductById, getProductsFromFile, product } from "../models/product";

export const getAddProduct = (req: any, res: any, next: any) => {
  console.log('middleware 2');
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: req.path,
    editing: false
  });
};

export const postAddProduct = (req: any, res: any, next: any) => {
  console.log('body', req.body);
  const receivedProduct = {id:null, title: req.body.title, imageUrl: req.body.imageUrl, description: req.body.description, price: req.body.price };
  product(receivedProduct);
  res.redirect('/');
};

export const getEditProduct = (req: any, res: any, next: any) => {
  console.log("getEditProduct");
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const productId = req.params.productId;
  const product = getProductById(productId);
  if (product) {
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "admin/edit-product",
      editing: editMode,
      product: product,
    });
  }
};

export const adminProductsController = (req: any, res: any, next: any) => {
  console.log('admin products controller');
  const prods = getProductsFromFile();
  res.render('admin/products', {
    prods,
    pageTitle: 'Admin Products',
    path: '/admin/products',
    formCss: true,
    productCSS: true,
    activeAdminProducts: true
  });
};

export const postEditProduct = (req: any, res: any, next: any) => {
  const productId = req.body.productId;
  editProduct(productId, req.body.title, req.body.imageUrl, req.body.description, req.body.price);
  res.redirect('/admin/products ');
}

export const postDeleteProduct = (req: any, res: any, next: any) => {
  const productId = req.body.productId;
  // const price = req.body.price;
  const prods = getProductsFromFile();
  const product = prods.find(prod => prod.id === productId);
  const price = product?.price;
  deleteProduct(productId);
  if(price){
    deleteCart(productId, price);
  }
  
  res.redirect('/admin/products');
}