// import { deleteCart } from "../models/cart";
import {
  deleteProduct,
  editProduct,
  getProductById,
  getProductsFromFile,
  product,
} from "../models/product";
import { deleteCart } from "../models/user";

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
    _id: null,
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    description: req.body.description,
    price: req.body.price,
    userId: req.user?._id,
  };
  await product(receivedProduct);
  res.redirect("/");
};

/** Loads an existing product into the edit form when edit mode is enabled. */
export const getEditProduct = async (req: any, res: any, next: any) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const productId = req.params.productId;
  const product = await getProductById(productId);
  if (product) {
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "admin/edit-product",
      editing: editMode,
      product: product,
    });
  }
};

/** Loads all products and renders the administrator product list. */
export const adminProductsController = async (
  req: any,
  res: any,
  next: any,
) => {
  const prods = await getProductsFromFile();
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
  await editProduct(
    productId,
    req.body.title,
    req.body.imageUrl,
    req.body.description,
    req.body.price,
  );
  res.redirect("/admin/products");
};

/** Deletes a product and removes its matching cart entry when applicable. */
export const postDeleteProduct = async (req: any, res: any, next: any) => {
  const productId = req.body.productId;
  // const price = req.body.price;
  const prods = await getProductsFromFile();
  const product = prods?.find((prod) => prod?._id === productId);
  const price = product?.price;
  await deleteProduct(productId);
  const userId = req.user._id;

  await deleteCart(productId, userId);

  res.redirect("/admin/products");
};
