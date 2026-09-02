import { getProductById, getProductsFromFile, product } from "../models/product";
import { addProduct, CartProduct, deleteCart, getCart } from "../models/cart";


/** Loads all products and renders the product listing page. */
export const getProducts = async(req: any, res: any, next: any) => {
  const prods = await getProductsFromFile();

  res.render('shop/product-list', {
    prods,
    pageTitle: 'All Products',
    path: '/products',
  });
};

/** Loads one product by ID or redirects when the product does not exist. */
export const getProduct = async(req: any, res: any, next: any) => {
  const productId = req.params.productId;
  const product = await getProductById(productId);
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

/** Loads products and renders the shop home page. */
export const getIndex = async (req: any, res: any, next: any) => {
  const prods = await getProductsFromFile();
  console.log('prods', prods);
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

/** Adds a selected product to the cart and redirects to the cart page. */
export const postCartController = async (req: any, res: any, next: any) => {
  const productId = req.body.productId;
  console.log('req', req.body);
  const product = await getProductById(productId);
  console.log('product', product);
  if (product) {
    await addProduct(productId, product.price || 0);
  }
  res.redirect('/cart');
};

/** Renders the checkout page. */
export const checkoutController = (req: any, res: any, next: any) => {
  
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};

/** Renders the orders page. */
export const ordersController = (req: any, res: any, next: any) => {
  
  res.render('shop/orders', {
    pageTitle: 'Orders',
    path: '/orders',
  });
};

/** Loads cart contents with their matching products and renders the cart page. */
export const getCartController = async (req: any, res: any, next: any) => {
  const cart = getCart();
  const products = await getProductsFromFile();
  const cartProducts = [];
  for(let actProd of products) {
    let cartProductData = cart.products.find((prod: CartProduct) => prod._id === actProd._id);
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

/** Removes a selected product from the cart and redirects to the cart page. */
export const postDeleteController = async (req: any, res: any, next: any) => {
  const productId = req.body.productId;
  const product = await getProductById(productId);
  if(product?.price) {
    await deleteCart(productId, product.price);
  }
  res.redirect('/cart');  
}