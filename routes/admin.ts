import express from "express";
import {
  adminProductsController,
  getAddProduct as getAddProductController,
  getEditProduct,
  postAddProduct as postAddProductController,
  postDeleteProduct,
  postEditProduct,
} from "../controller/admin";
import { isAuth } from "../middleware/is-auth";

const router = express.Router();
//admin/add-product => GET
router.get("/add-product", isAuth, getAddProductController);

router.get("/products", isAuth, adminProductsController);

//admin/add-product => POST
router.post("/add-product", isAuth, postAddProductController);

router.get("/edit-product/:productId", isAuth, getEditProduct);

router.post("/edit-product", isAuth, postEditProduct);

router.post("/delete-product", isAuth, postDeleteProduct);

export default router;
