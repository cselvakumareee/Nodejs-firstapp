import { product } from "../models/product";
import { User } from "../models/user";
import { Order } from "../models/orders";

/** Loads all products and renders the product listing page. */
export const getProducts = async (req: any, res: any, next: any) => {
  const prods = await product
    .find({})
    // .populate("userId")
    .then((products) => {
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
  const productId = req.params.productId; //productId --defined in routes/shop.ts
  const prod = await product.findById(productId).exec();
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
  const prods = await product
    .find({})
    .then((products) => {
      return products;
    })
    .catch((err) => {
      console.error("Error fetching products:", err);
      return [];
    });
  res.render("shop/index", {
    prods,
    pageTitle: "Shop",
    path: "/",
  });
};

/** Adds a selected product to the cart and redirects to the cart page. */
export const postCartController = async (req: any, res: any, next: any) => {
  const productId = req.body.productId;
  const prod = await product.findById(productId).exec();
  if (prod) {
    const user = await User.findById(req.session.user._id).exec();
    if (!user) {
      return next(new Error("User not found"));
    }
    const userWithCartMethod = user as typeof user & {
      addToCart: (product: typeof prod, userId: string) => Promise<unknown>;
    };
    await userWithCartMethod.addToCart(prod, req.session.user._id);
  }
  res.redirect("/cart");
};

/** Renders the orders page. */
export const getOrdersController = async (req: any, res: any, next: any) => {
  const userId = req.session.user._id;
  await Order.find({ "user.userId": userId })
    .then((orders) => {
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
    const user = await User.findById(req.session.user._id)
      .populate("cart.items.productId")
      .exec();

    if (!user) {
      throw new Error("User not found");
    }

    const actualProducts = (user.cart?.items ?? [])
      .filter((item: any) => item.productId)
      .map((item: any) => ({
        product: { ...item.productId._doc },
        quantity: item.quantity,
      }));
    const order = {
      user: {
        // name: req.session.user.name,
        userId: req.session.user._id,
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
  try {
    const user = await User.findById(req.session.user._id)
      .populate("cart.items.productId")
      .exec();

    if (!user) {
      return next(new Error("User not found"));
    }

    const products = (user.cart?.items ?? [])
      .filter((item: any) => item.productId)
      .map((item: any) => ({
        productData: item.productId,
        qty: item.quantity,
      }));

    res.render("shop/cart", {
      pageTitle: "Cart",
      path: "/cart",
      products,
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    next(err);
  }
};

/** Removes a selected product from the cart and redirects to the cart page. */
export const postDeleteController = async (req: any, res: any, next: any) => {
  const productId = req.body.productId;
  const user = await User.findById(req.session.user._id).exec();
  if (!user) {
    return next(new Error("User not found"));
  }
  const userWithCartMethod = user as typeof user & {
    deleteCart: (productId: string) => Promise<unknown>;
  };
  await userWithCartMethod.deleteCart(productId);
  res.redirect("/cart");
};
