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

const router = express.Router();
router.get("/", getIndex);

router.post("/cart", postCartController);

router.post("/cart-delete-item", postDeleteController);

router.get("/products", getProducts);

router.get("/products/:productId", getProduct);

router.get("/orders", getOrdersController);
router.post("/orders", postOrderController);

router.get("/cart", getCartController);

export default router;
