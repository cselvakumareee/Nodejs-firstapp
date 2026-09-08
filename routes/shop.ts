import express from "express";
import {
  getIndex,
  getProducts,
  getProduct,
  postCartController,
  getCartController,
  postDeleteController,
  postOrderController,
  getOrdersController,
} from "../controller/shop";
import { isAuth } from "../middleware/is-auth";

const router = express.Router();
router.get("/", getIndex);

router.post("/cart", isAuth, postCartController);

router.post("/cart-delete-item", isAuth, postDeleteController);

router.get("/products", getProducts);

router.get("/products/:productId", getProduct);

router.get("/orders", isAuth, getOrdersController);
router.post("/orders", isAuth, postOrderController);

router.get("/cart", isAuth, getCartController);

export default router;
