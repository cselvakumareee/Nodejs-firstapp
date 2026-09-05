// import {
//   getProductById,
//   getProductsFromFile,
//   product,
// } from "../models/product";
// import { CartProduct } from "../models/cart";
// import {
//   addOrder,
//   addToCart,
//   deleteCart,
//   getCart,
//   getOrder,
// } from "../models/user";

import { product } from "../models/product";
import { User } from "../models/user";
import { Order } from "../models/orders";

/** Loads all products and renders the product listing page. */
export const getProducts = async (req: any, res: any, next: any) => {
  const prods = await product
    .find({})
    // .populate("userId")
    .then((products) => {
      console.log("fetched", products);
      return products;
    })
    .catch((err) => {
      console.error("Error fetching products:", err);
      return [];
    });

  res.render("shop/product-list", {
    prods,
    pageTitle: "All Products",
    path: "/products",
  });
};

/** Loads one product by ID or redirects when the product does not exist. */
export const getProduct = async (req: any, res: any, next: any) => {
  const productId = req.params.productId;
  const prod = await product.findById(productId).exec();
  console.log("single product", prod);
  if (!prod) {
    return res.redirect("/products");
  }

  res.render("shop/product-detail", {
    product: prod,
    pageTitle: prod.title,
    path: "/products",
  });
};

/** Loads products and renders the shop home page. */
export const getIndex = async (req: any, res: any, next: any) => {
  console.log("get index");
  const prods = await product
    .find({})
    .then((products) => {
      console.log("fetched", products);
      return products;
    })
    .catch((err) => {
      console.error("Error fetching products:", err);
      return [];
    });
  console.log("prods", prods);
  res.render("shop/index", {
    prods,
    pageTitle: "Shop",
    path: "/",
  });
};

// // export const CartController = (req: any, res: any, next: any) => {
// //   console.log('cart controller');
// //   res.render('shop/cart', {
// //     pageTitle: 'Your Cart',
// //     path: req.path,
// //     formCss: true,
// //     productCSS: true,
// //     activeCart: true
// //   });
// // };

/** Adds a selected product to the cart and redirects to the cart page. */
export const postCartController = async (req: any, res: any, next: any) => {
  const productId = req.body.productId;
  console.log("req", req.body);
  const prod = await product.findById(productId).exec();
  if (prod) {
    const user = await User.findById(req.user._id).exec();
    if (!user) {
      return next(new Error("User not found"));
    }
    const userWithCartMethod = user as typeof user & {
      addToCart: (product: typeof prod, userId: string) => Promise<unknown>;
    };
    await userWithCartMethod.addToCart(prod, req.user._id);
  }

  //   console.log("product", product);
  //   if (product) {
  //     // await addProduct(productId, product.price || 0);
  //   }
  res.redirect("/cart");
};

// /** Renders the checkout page. */
// export const checkoutController = (req: any, res: any, next: any) => {
//   res.render("shop/checkout", {
//     pageTitle: "Checkout",
//     path: "/checkout",
//   });
// };

/** Renders the orders page. */
export const getOrdersController = async (req: any, res: any, next: any) => {
  const userId = req.user._id;
  await Order.find({ "user.userId": userId })
    .then((orders) => {
      console.log("fetched orders", orders);
      res.render("shop/orders", {
        pageTitle: "Orders",
        path: "/orders",
        orders: orders,
      });
    })
    .catch((err) => {
      console.error("Error fetching orders:", err);
      return null;
    });
};

/** Creates an order from the authenticated user's cart. */
export const postOrderController = async (req: any, res: any, next: any) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("cart.items.productId")
      .exec();

    if (!user) {
      throw new Error("User not found");
    }

    const actualProducts = user.cart?.items.map((item: any) => ({
      product: { ...item.productId._doc },
      quantity: item.quantity,
    }));
    const order = {
      user: {
        name: req.user.name,
        userId: req.user._id,
      },
      products: actualProducts,
    };

    await new Order(order).save();
    const userWithCartMethod = user as typeof user & {
      clearCart: () => Promise<unknown>;
    };
    await userWithCartMethod.clearCart();
    res.redirect("/orders");
  } catch (err) {
    console.error("Error creating order:", err);
    return null;
  }
};

/** Loads cart contents with their matching products and renders the cart page. */
export const getCartController = async (req: any, res: any, next: any) => {
  // const cart = await getCart();
  // console.log("cart", cart);
  const user = await User.find()
    .populate("cart.items.productId")
    .then((products) => {
      const actualProducts = products[0]?.cart?.items.map((item: any) => {
        return {
          productData: item.productId,
          qty: item.quantity,
        };
      });
      console.log("fetched products", products[0]?.cart?.items);
      res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        products: actualProducts,
      });
    })
    .catch((err) => {
      console.error("Error fetching user:", err);
      return null;
    });
};

/** Removes a selected product from the cart and redirects to the cart page. */
export const postDeleteController = async (req: any, res: any, next: any) => {
  const productId = req.body.productId;
  const user = await User.findById(req.user._id).exec();
  if (!user) {
    return next(new Error("User not found"));
  }
  const userWithCartMethod = user as typeof user & {
    deleteCart: (productId: string) => Promise<unknown>;
  };
  await userWithCartMethod.deleteCart(productId);
  res.redirect("/cart");
};
