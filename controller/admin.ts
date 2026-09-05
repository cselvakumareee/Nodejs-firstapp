// import { deleteCart } from "../models/cart";
import { product } from "../models/product";
// import { deleteCart } from "../models/user";

/** Renders the add-product form. */
export const getAddProduct = (req: any, res: any, next: any) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: req.path,
    editing: false,
  });
};

/** Creates a product from the submitted form data and redirects to the shop. */
export const postAddProduct = async (req: any, res: any, next: any) => {
  const receivedProduct = {
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    description: req.body.description,
    price: req.body.price,
    userId: req.user._id,
  };
  await product
    .create(receivedProduct)
    .then(() => {
      console.log("Product created successfully");
    })
    .catch((err: any) => {
      console.error("Error creating product:", err);
    });
  res.redirect("/");
};

/** Loads an existing product into the edit form when edit mode is enabled. */
export const getEditProduct = async (req: any, res: any, next: any) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const productId = req.params.productId;
  const prod = await product.findById(productId).exec();
  if (prod) {
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "admin/edit-product",
      editing: editMode,
      product: prod,
    });
  }
};

/** Loads all products and renders the administrator product list. */
export const adminProductsController = async (
  req: any,
  res: any,
  next: any,
) => {
  const prods = await product
    .find()
    // .populate("userId")
    .then((products) => {
      console.log("fetched", products);
      return products;
    })
    .catch((err) => {
      console.error("Error fetching products:", err);
      return [];
    });
  res.render("admin/products", {
    prods,
    pageTitle: "Admin Products",
    path: "/admin/products",
    formCss: true,
    productCSS: true,
    activeAdminProducts: true,
  });
};

/** Updates a product from submitted form data and redirects to the admin list. */
export const postEditProduct = async (req: any, res: any, next: any) => {
  const productId = req.body.productId;
  await product
    .findByIdAndUpdate(productId, {
      title: req.body.title,
      imageUrl: req.body.imageUrl,
      description: req.body.description,
      price: req.body.price,
    })
    .then(() => {
      console.log("Product updated successfully");
    })
    .catch((err: any) => {
      console.error("Error updating product:", err);
    });
  res.redirect("/admin/products");
};

/** Deletes a product and removes its matching cart entry when applicable. */
export const postDeleteProduct = async (req: any, res: any, next: any) => {
  const productId = req.body.productId;
  await product
    .findByIdAndDelete(productId)
    .then(() => {
      console.log("Product deleted successfully");
    })
    .catch((err: any) => {
      console.error("Error deleting product:", err);
    });
  // const userId = req.user._id;

  // await deleteCart(productId, userId);

  res.redirect("/admin/products");
};
