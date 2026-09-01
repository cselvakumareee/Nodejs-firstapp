import { getProductById, getProductsFromFile, product } from "../models/product";
import { addProduct, CartProduct, deleteCart, getCart } from "../models/cart";


export const getProducts = (req: any, res: any, next: any) => {
  const prods = getProductsFromFile();

  res.render('shop/product-list', {
    prods,
    pageTitle: 'All Products',
    path: '/products',
  });
};

export const getProduct = (req: any, res: any, next: any) => {
  const productId = req.params.productId;
  const prods = getProductsFromFile();
  const product = getProductById(productId);
  console.log('product', product);
  if (!product) {
    return res.redirect('/products');
  }

  res.render('shop/product-detail', {
    product,
    pageTitle: product.title,
    path: '/products'
  });
};

export const getIndex = (req: any, res: any, next: any) => {
  const prods = getProductsFromFile();

  res.render('shop/index', {
    prods,
    pageTitle: 'Shop',
    path: '/',
  });
};

// export const CartController = (req: any, res: any, next: any) => {
//   console.log('cart controller');
//   res.render('shop/cart', {
//     pageTitle: 'Your Cart',
//     path: req.path,
//     formCss: true,
//     productCSS: true,
//     activeCart: true
//   });
// };

export const postCartController = (req: any, res: any, next: any) => {
  const productId = req.body.productId;
  console.log('req', req.body);
  const product = getProductById(productId);
  console.log('product', product);
  if (product) {
    addProduct(productId, product.price || 0);
  }
  res.redirect('/cart');
};

export const checkoutController = (req: any, res: any, next: any) => {
  
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};

export const ordersController = (req: any, res: any, next: any) => {
  
  res.render('shop/orders', {
    pageTitle: 'Orders',
    path: '/orders',
  });
};

export const getCartController = (req: any, res: any, next: any) => {
  const cart = getCart();
  const products = getProductsFromFile();
  const cartProducts = [];
  for(let actProd of products) {
    let cartProductData = cart.products.find((prod: CartProduct) => prod.id === actProd.id);
    if(cartProductData) {
      cartProducts.push({productData:actProd, qty: cartProductData.qty});
    }
  }
  res.render('shop/cart', {
    pageTitle: 'Cart',
    path: '/cart',
    products: cartProducts
  })
}

export const postDeleteController = (req: any, res: any, next: any) => {
  const productId = req.body.productId;
  const product = getProductById(productId);
  if(product?.price) {
    deleteCart(productId, product.price);
  }
  res.redirect('/cart');  
}